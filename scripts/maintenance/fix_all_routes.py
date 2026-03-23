#!/usr/bin/env python3
"""
Script to fix all routes missing await params
"""
import re
import os

# Routes that need fixing
routes_to_fix = [
    # Batch 2: Design routes
    "src/app/api/designs/folders/[folderId]/route.ts",
    "src/app/api/designs/[id]/faq/[faqIndex]/route.ts",
    "src/app/api/designs/[id]/faq/route.ts",
    "src/app/api/designs/[id]/files/route.ts",
    "src/app/api/designs/[id]/files/version/route.ts",
    "src/app/api/designs/[id]/package-options/route.ts",
   "src/app/api/designs/[id]/view/route.ts",
    "src/app/api/custom-design/[id]/file/route.ts",
    # Batch 3-5: Continue listing all routes...
]

def fix_route_file(filepath):
    """Fix a single route file to await params"""
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        return False
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Skip if already fixed
    if 'await params' in content:
        print(f"Skipping {filepath} - already fixed")
        return False
    
    original = content
    
    # Pattern 1: Single param in function signature
    pattern1 = r'(\{ params \}: \{ params: )(\{ [^}]+ \})(\s*\})'
    repl1 = r'\1Promise<\2>\3'
    content = re.sub(pattern1, repl1, content)
    
    # Pattern 2: Add await before params destructuring
    # Find all params destructuring and add await
    pattern2 = r'(\s+)(const \{ [^}]+ \} = )(params)(;)'
    repl2 = r'\1\2await \3\4'
    content = re.sub(pattern2, repl2, content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")
        return True
   return False

if __name__ == "__main__":
    fixed_count = 0
    for route in routes_to_fix:
        if fix_route_file(route):
            fixed_count += 1
   
    print(f"\nFixed {fixed_count} routes")
