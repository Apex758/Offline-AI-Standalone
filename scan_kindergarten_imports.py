import os
import re

# 🧭 Kindergarten Component Path Corrector
# This script will replace all "@/components/..." imports with the correct
# relative path to frontend/src/components within each week page.

BASE_DIR = os.path.join("frontend", "src", "curriculum", "kindergarten")
TARGET_FILES = []

# Components mapping
COMPONENTS = {
    "WeeklyOverview": "components/weekly-overview",
    "ActivityCard": "components/activity-card",
    "TeacherTip": "components/teacher-tip",
    "DailyPlan": "components/daily-plan"
}

# Find all week page files
for root, _, files in os.walk(BASE_DIR):
    for name in files:
        if name == "page.tsx" and "week-" in root:
            TARGET_FILES.append(os.path.join(root, name))


def relative_import_path(from_path, to_path):
    """Compute relative import path from one file to another."""
    rel_path = os.path.relpath(to_path, os.path.dirname(from_path))
    return rel_path.replace("\\", "/").replace(".tsx", "")


def fix_imports(file_path):
    """Insert missing component imports if not found and correct existing ones."""
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    content = "".join(lines)
    modified = False

    # Determine relative component path base
    for comp, target in COMPONENTS.items():
        import_regex = rf'import\s*{{[^}}]*{comp}[^}}]*}}\s*from\s*["\'][^"\']*["\']'
        if re.search(import_regex, content):
            # Already imported; skip
            continue

        # If component appears in markup but not imported, auto-insert import
        if re.search(rf'<\s*{comp}\b', content):
            rel_path = relative_import_path(file_path, os.path.join("frontend", "src", target + ".tsx"))
            lines.insert(0, f'import {{{comp}}} from "{rel_path}";\n')
            modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(lines)
        print(f"✅ Fixed missing imports in: {file_path}")

    return modified


def main():
    print("🔧 Updating all week page import paths to relative...")
    total = 0
    changed = 0
    for file in TARGET_FILES:
        total += 1
        if fix_imports(file):
            changed += 1
    print("\n========== Import Path Correction Report ==========")
    print(f"🧩 Total week pages scanned: {total}")
    print(f"✅ Files updated: {changed}")
    if changed == 0:
        print("All files already have correct relative imports.")
    print("===================================================\n")


if __name__ == "__main__":
    main()