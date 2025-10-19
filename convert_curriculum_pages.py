import os
import re

def convert_nextjs_to_react(content):
    """
    Convert Next.js specific code to React code
    """
    # Replace Next.js Link import with React Router Link
    content = re.sub(
        r'import\s+Link\s+from\s+["\']next/link["\']',
        'import { Link } from "react-router-dom"',
        content
    )
    
    # Replace Next.js Image import
    content = re.sub(
        r'import\s+Image\s+from\s+["\']next/image["\']',
        '// import Image from "next/image" - replaced with img tag',
        content
    )
    
    # Replace Image component with img tag
    content = re.sub(
        r'<Image\s+([^>]+)/>',
        lambda m: convert_image_tag(m.group(1)),
        content
    )
    
    # Remove "use client" directive
    content = re.sub(r'["\']use client["\']\s*\n', '', content)
    
    # Remove "use server" directive  
    content = re.sub(r'["\']use server["\']\s*\n', '', content)
    
    # Fix Link href to 'to' prop for React Router
    # This handles: <Link href="/path">
    content = re.sub(
        r'<Link\s+href=',
        '<Link to=',
        content
    )
    
    # Fix Button asChild with Link - convert to onClick with navigate
    # Find patterns like: <Button asChild><Link href="/path">
    content = convert_button_asChild_links(content)
    
    return content

def convert_button_asChild_links(content):
    """
    Convert Button asChild pattern with Link to proper React Router navigation
    """
    # Pattern: <Button asChild><Link href="/path">Text</Link></Button>
    # Convert to: <Link to="/path"><Button>Text</Button></Link>
    
    pattern = r'<Button\s+asChild[^>]*>\s*<Link\s+(?:href|to)=(["\'][^"\']+["\'])[^>]*>(.*?)</Link>\s*</Button>'
    
    def replace_func(match):
        path = match.group(1)
        text = match.group(2)
        return f'<Link to={path}><Button>{text}</Button></Link>'
    
    return re.sub(pattern, replace_func, content, flags=re.DOTALL)

def convert_image_tag(props_str):
    """
    Convert Next.js Image props to standard img tag
    """
    # Extract src
    src_match = re.search(r'src=["\']([^"\']+)["\']', props_str)
    alt_match = re.search(r'alt=["\']([^"\']+)["\']', props_str)
    
    src = src_match.group(1) if src_match else ''
    alt = alt_match.group(1) if alt_match else ''
    
    # Check if it uses fill prop
    if 'fill' in props_str:
        return f'<img src="{src}" alt="{alt}" className="w-full h-full object-cover" />'
    
    return f'<img src="{src}" alt="{alt}" className="w-auto h-auto" />'

def process_file(file_path):
    """
    Process a single file
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert Next.js code to React
        converted = convert_nextjs_to_react(content)
        
        # Only write if changes were made
        if converted != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(converted)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def convert_all_curriculum_files(curriculum_path):
    """
    Convert all .tsx files in curriculum folder
    """
    converted_count = 0
    total_count = 0
    
    for root, dirs, files in os.walk(curriculum_path):
        for file in files:
            if file.endswith('.tsx'):
                total_count += 1
                file_path = os.path.join(root, file)
                if process_file(file_path):
                    converted_count += 1
                    print(f"✓ Converted: {file_path}")
    
    return converted_count, total_count

if __name__ == '__main__':
    curriculum_path = os.path.join('frontend', 'src', 'curriculum')
    
    if not os.path.exists(curriculum_path):
        print(f"Error: Curriculum path not found: {curriculum_path}")
        exit(1)
    
    print("Converting curriculum files from Next.js to React...")
    print("-" * 60)
    
    converted, total = convert_all_curriculum_files(curriculum_path)
    
    print("-" * 60)
    print(f"Conversion complete!")
    print(f"Files processed: {total}")
    print(f"Files converted: {converted}")
    
    if converted > 0:
        print("\n⚠️  Please review the converted files to ensure:")
        print("  - All imports are correct")
        print("  - Image paths are correct")
        print("  - Links work as expected")
        print("  - No Next.js specific code remains")