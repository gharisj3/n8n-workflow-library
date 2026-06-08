from __future__ import annotations

import json
import sys
from pathlib import Path


REQUIRED_FIELDS = ("name", "nodes", "connections")


def validate_workflow(path: Path) -> list[str]:
    errors: list[str] = []

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"invalid JSON: line {exc.lineno}, column {exc.colno}: {exc.msg}"]

    for field in REQUIRED_FIELDS:
        if field not in data:
            errors.append(f"missing top-level field: {field}")

    if "nodes" in data and not isinstance(data["nodes"], list):
        errors.append("nodes must be a list")

    if "connections" in data and not isinstance(data["connections"], dict):
        errors.append("connections must be an object")

    return errors


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    workflow_paths = sorted((repo_root / "workflows").glob("*/workflow.json"))

    if not workflow_paths:
        print("FAIL: no workflow.json files found under workflows/")
        return 1

    failed = False
    print(f"Validating {len(workflow_paths)} workflow exports...")

    for path in workflow_paths:
        errors = validate_workflow(path)
        rel_path = path.relative_to(repo_root)
        if errors:
            failed = True
            print(f"FAIL: {rel_path}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS: {rel_path}")

    if failed:
        print("Validation failed.")
        return 1

    print("All workflow JSON files passed validation.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
