"""
This script adds process tracking to all websocket handlers in main.py
Run this once to patch the file with proper process cleanup
"""

import re

import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
main_py_path = os.path.join(script_dir, 'main.py')

# Read the current main.py
with open(main_py_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Add register_process after subprocess.Popen creation (not already registered)
# Look for patterns where we create a process but don't register it
pattern1 = r'(process = subprocess\.Popen\([^)]+\)\s+)\n(\s+)(print\("✓ Subprocess created successfully"\)\s+)?(\s+process\.stdin\.close\(\))'
replacement1 = r'\1\n\2# Register process for cleanup tracking\n\2register_process(process)\n\2\n\2\3\4'

# Apply pattern 1
content = re.sub(pattern1, replacement1, content)

# Pattern 2: Replace process.terminate() + kill sequences with cleanup_process()
pattern2 = r'(\s+)# Kill the process.*?\n\s+process\.terminate\(\)\s+time\.sleep\([^)]+\)\s+if process\.poll\(\) is None:\s+process\.kill\(\)'
replacement2 = r'\1# Kill the process and cleanup\n\1cleanup_process(process)'

# Apply pattern 2
content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

# Alternative pattern for simpler terminate/kill sequences
pattern3 = r'(\s+)process\.terminate\(\)\s+time\.sleep\([^)]+\)\s+if process\.poll\(\) is None:\s+process\.kill\(\)'
replacement3 = r'\1cleanup_process(process)'

# Apply pattern 3
content = re.sub(pattern3, replacement3, content)

# Write the patched content
with open(main_py_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Process tracking added to all websocket handlers")
print("✓ Process cleanup calls updated")