import os
import re

def find_and_fix_missing_imports(content):
    """
    Find and comment out imports for components that don't exist
    """
    changes_made = False
    
    # List of components that might be missing
    potentially_missing = [
        'teacher-tip',
        'activity-card', 
        'weekly-overview',
        'lesson-objectives',
        'assessment-criteria',
        'differentiation-strategies',
        'resources-list'
    ]
    
    for component in potentially_missing:
        # Pattern to match import statements for this component
        pattern = rf'import\s*\{{[^}}]*\}}\s*from\s*["\']@/components/{component}["\'];?\s*\n'
        
        if re.search(pattern, content):
            # Comment out the import
            content = re.sub(
                pattern,
                f'// Commented out missing import: @/components/{component}\n',
                content
            )
            changes_made = True
    
    return content, changes_made

def check_if_components_exist():
    """
    Check which components actually exist in the components folder
    """
    components_path = os.path.join('frontend', 'src', 'components')
    
    if not os.path.exists(components_path):
        print(f"Components folder not found: {components_path}")
        return set()
    
    existing_components = set()
    for file in os.listdir(components_path):
        if file.endswith('.tsx') or file.endswith('.ts'):
            component_name = file.replace('.tsx', '').replace('.ts', '')
            existing_components.add(component_name)
    
    print("Existing components:", existing_components)
    return existing_components

def process_file(file_path):
    """
    Process a single file
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix missing imports
        new_content, changes = find_and_fix_missing_imports(content)
        
        # Only write if changes were made
        if changes:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def scan_and_report_imports(curriculum_path):
    """
    Scan all files and report which components are being imported
    """
    imports_found = {}
    
    for root, dirs, files in os.walk(curriculum_path):
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Find all component imports
                    pattern = r'import\s*\{[^}]*\}\s*from\s*["\']@/components/([^"\']+)["\']'
                    matches = re.findall(pattern, content)
                    
                    for component in matches:
                        if component not in imports_found:
                            imports_found[component] = []
                        imports_found[component].append(file_path)
                except:
                    pass
    
    return imports_found

def fix_all_files(curriculum_path):
    """
    Fix all .tsx files in the curriculum folder
    """
    fixed_count = 0
    total_count = 0
    
    for root, dirs, files in os.walk(curriculum_path):
        for file in files:
            if file.endswith('.tsx'):
                total_count += 1
                file_path = os.path.join(root, file)
                if process_file(file_path):
                    fixed_count += 1
                    print(f"✓ Fixed: {file_path}")
    
    return fixed_count, total_count

if __name__ == '__main__':
    curriculum_path = os.path.join('frontend', 'src', 'curriculum')
    
    if not os.path.exists(curriculum_path):
        print(f"Error: Curriculum path not found: {curriculum_path}")
        exit(1)
    
    print("Scanning for component imports...")
    print("-" * 60)
    
    # Check which components exist
    existing_components = check_if_components_exist()
    
    # Scan and report
    imports_found = scan_and_report_imports(curriculum_path)
    
    print("\nComponent imports found:")
    for component, files in imports_found.items():
        status = "✓ EXISTS" if component in existing_components else "✗ MISSING"
        print(f"{status} - {component} (used in {len(files)} files)")
        if component not in existing_components:
            print(f"  Files: {files[:3]}...")  # Show first 3 files
    
    print("\n" + "-" * 60)
    print("Fixing missing component imports...")
    print("-" * 60)
    
    fixed, total = fix_all_files(curriculum_path)
    
    print("-" * 60)
    print(f"Fix complete!")
    print(f"Files processed: {total}")
    print(f"Files fixed: {fixed}")