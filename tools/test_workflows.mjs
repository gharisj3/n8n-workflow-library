import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import test from 'node:test';

// Offline checks of exported Code nodes and graph contracts, not an n8n runtime.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'workflows');
const folders = readdirSync(root);
function workflow(prefix) {
  const folder = folders.find(name => name.startsWith(prefix));
  return JSON.parse(readFileSync(join(root, folder, 'workflow.json'), 'utf8'));
}
function execute(flow, name, items, helpers = {}) {
  const node = flow.nodes.find(node => node.name === name);
  const input = { all: () => items, first: () => items[0] };
  return new Function('$input', '$json', '$env', '$', '$execution', node.parameters.jsCode)(
    input, items[0]?.json, helpers.env ?? {}, helpers.previous, { id: 'offline-test' },
  );
}
function output(flow, node, port = 0) {
  return flow.connections[node].main[port].map(link => link.node);
}

test('all exported graph targets exist and Code nodes parse', () => {
  for (const folder of folders) {
    const flow = JSON.parse(readFileSync(join(root, folder, 'workflow.json'), 'utf8'));
    const names = new Set(flow.nodes.map(node => node.name));
    for (const [source, channels] of Object.entries(flow.connections)) {
      assert(names.has(source));
      for (const edges of channels.main) for (const edge of edges) assert(names.has(edge.node));
    }
    for (const node of flow.nodes.filter(node => node.type === 'n8n-nodes-base.code')) {
      assert.doesNotThrow(() => new Function('$input', '$json', '$env', '$', '$execution', node.parameters.jsCode));
    }
  }
});

test('batch graph loops and aggregates all results with one injected failure', () => {
  const flow = workflow('04-');
  assert.deepEqual(output(flow, 'Split In Batches', 0), ['Collect Results']);
  assert.deepEqual(output(flow, 'Split In Batches', 1), ['Process Item Placeholder']);
  assert.deepEqual(output(flow, 'Delay / Rate Limit'), ['Split In Batches']);
  const items = Array.from({ length: 7 }, (_, id) => ({ id, simulate_failure: id === 4 }));
  const loaded = execute(flow, 'Load Input Array', [{ json: { body: { items, batch_size: 3 } } }]);
  const expanded = execute(flow, 'Validate Array', loaded);
  const processed = [];
  for (let offset = 0; offset < expanded.length; offset += 3) {
    processed.push(...execute(flow, 'Process Item Placeholder', expanded.slice(offset, offset + 3)));
  }
  const collected = execute(flow, 'Collect Results', processed);
  const result = execute(flow, 'Handle Failed Items', collected)[0].json;
  assert.equal(result.processed_count, 6);
  assert.equal(result.failed_count, 1);
  assert.equal(result.results.length, 7);
  assert.deepEqual(result.results.map(row => row.id), [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(result.failed_items[0].id, 4);
  assert.equal(result.ok, false);
});

test('batch input errors stop before the loop', () => {
  const flow = workflow('04-');
  for (const body of [{ items: [] }, { items: [null] }, { items: [{}], batch_size: 0 }, { items: [{}], batch_size: 1.5 }]) {
    const result = execute(flow, 'Load Input Array', [{ json: { body } }])[0].json;
    assert.equal(result.ok, false);
    assert.equal(result.statusCode, 400);
  }
  assert.deepEqual(output(flow, 'Input Valid?', 1), ['Return Summary']);
});

test('health records use each matching endpoint and preserve all items', () => {
  const flow = workflow('06-');
  const endpoints = [
    { name: 'A', url: 'https://a.invalid', expected: [200], started_at: Date.now() },
    { name: 'B', url: 'https://b.invalid', expected: [201], started_at: Date.now() },
  ];
  const previous = () => ({ itemMatching: index => ({ json: endpoints[index] }) });
  const checked = execute(flow, 'Status Code Check', [{ json: { statusCode: 200 } }, { json: { statusCode: 201 } }], { previous });
  assert.deepEqual(checked.map(item => item.json.name), ['A', 'B']);
  assert.deepEqual(checked.map(item => item.json.status), ['healthy', 'healthy']);
  const timed = execute(flow, 'Latency Capture', checked);
  const prepared = execute(flow, 'Prepare Health Record', timed);
  assert.equal(prepared.length, 2);
  assert(prepared.every(item => item.json.persisted === false));
});

test('dead-letter storage explicitly remains an extension point', () => {
  const result = execute(workflow('03-'), 'Prepare Storage Payload', [{ json: { decision: 'final_dead_letter' } }])[0].json;
  assert.equal(result.persisted, false);
  assert.equal(result.stored_at, undefined);
});

test('MySQL errors cannot connect directly to a success response', () => {
  const flow = workflow('02-');
  assert.deepEqual(output(flow, 'MySQL Insert'), ['Insert Succeeded?']);
  assert.deepEqual(output(flow, 'Insert Succeeded?', 1), ['Error Response']);
});

test('provider templates require actual endpoint and model configuration', () => {
  const claude = workflow('01-');
  assert.throws(() => execute(claude, 'Build Claude Request', [{ json: { text: 'hello' } }]), /Configure/);
  const built = execute(claude, 'Build Claude Request', [{ json: { text: 'hello' } }], { env: { CLAUDE_MODEL: 'configured-model', CLAUDE_API_URL: 'https://test.invalid' } });
  assert.equal(built[0].json.payload.model, 'configured-model');
  const odoo = workflow('05-').nodes.find(node => node.name === 'HTTP Request to Odoo');
  assert.equal(odoo.parameters.url, '={{$env.ODOO_SYNC_URL}}');
});
