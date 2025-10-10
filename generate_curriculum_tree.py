import os
import json

def generate_curriculum_tree(base_path):
    """
    Generate a hierarchical tree structure of curriculum files
    """
    tree = {}
    
    def should_include_file(filename):
        """Only include .tsx files that are actual pages"""
        return filename.endswith('.tsx') and not filename.startswith('_')
    
    def should_include_dir(dirname):
        """Exclude certain directories"""
        exclude = ['node_modules', '.next', 'dist', 'build']
        return dirname not in exclude and not dirname.startswith('.')
    
    def process_directory(current_path, current_tree):
        """Recursively process directories"""
        try:
            items = sorted(os.listdir(current_path))
        except PermissionError:
            return
        
        for item in items:
            full_path = os.path.join(current_path, item)
            
            if os.path.isdir(full_path):
                if should_include_dir(item):
                    current_tree[item] = {}
                    process_directory(full_path, current_tree[item])
            elif os.path.isfile(full_path):
                if should_include_file(item):
                    # Store file info
                    rel_path = os.path.relpath(full_path, base_path)
                    # Convert to route path
                    route_path = rel_path.replace('\\', '/').replace('page.tsx', '').replace('.tsx', '')
                    if route_path.endswith('/'):
                        route_path = route_path[:-1]
                    
                    current_tree[item] = {
                        'type': 'file',
                        'path': rel_path.replace('\\', '/'),
                        'route': '/curriculum/' + route_path if route_path else '/curriculum',
                        'name': item.replace('.tsx', '').replace('page', 'index')
                    }
    
    process_directory(base_path, tree)
    return tree

def generate_route_list(tree, base_route=''):
    """Generate a flat list of routes from the tree"""
    routes = []
    
    def traverse(node, current_route):
        for key, value in node.items():
            if isinstance(value, dict):
                if value.get('type') == 'file':
                    routes.append({
                        'path': value['route'],
                        'file_path': value['path'],
                        'name': key.replace('.tsx', '').replace('page', '').replace('-', ' ').title()
                    })
                else:
                    # It's a directory
                    new_route = f"{current_route}/{key}" if current_route else key
                    traverse(value, new_route)
    
    traverse(tree, base_route)
    return routes

if __name__ == '__main__':
    # Set the path to your curriculum folder
    curriculum_path = os.path.join('frontend', 'src', 'curriculum')
    
    if not os.path.exists(curriculum_path):
        print(f"Error: Curriculum path not found: {curriculum_path}")
        exit(1)
    
    # Generate tree
    print("Generating curriculum tree...")
    tree = generate_curriculum_tree(curriculum_path)
    
    # Generate routes
    routes = generate_route_list(tree)
    
    # Save tree
    output_dir = os.path.join('frontend', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    tree_file = os.path.join(output_dir, 'curriculumTree.json')
    with open(tree_file, 'w', encoding='utf-8') as f:
        json.dump(tree, f, indent=2)
    
    # Save routes
    routes_file = os.path.join(output_dir, 'curriculumRoutes.json')
    with open(routes_file, 'w', encoding='utf-8') as f:
        json.dump(routes, f, indent=2)
    
    print(f"✓ Generated curriculum tree: {tree_file}")
    print(f"✓ Generated {len(routes)} routes: {routes_file}")
    print("\nSample routes:")
    for route in routes[:5]:
        print(f"  - {route['path']}")