#!/bin/bash

# Script to automatically fix routes that don't await params

fix_single_param_route() {
  local file="$1"
  echo "Fixing $file..."
  
  # Create backup
  cp "$file" "$file.bak"
  
  # Fix single param routes (id, slug, etc.)
  sed -i 's/{ params }: { params: { \([^}]*\) } }/{ params }: { params: Promise<{ \1 }> }/g' "$file"
  
  # Add await before params destructuring (after function start)
  sed -i '/^export async function [A-Z]*(/,/try {/ {
    /try {/a\    const { id } = await params;
    /try {/a\    const { slug } = await params;
    /try {/a\    const { orderId } = await params;
    /try {/a\    const { invoiceId } = await params;
    /try {/a\    const { purchaseId } = await params;
    /try {/a\    const { optionId } = await params;
    /try {/a\    const { faqIndex } = await params;
    /try {/a\    const { folderId } = await params;
  }' "$file"
  
  # Remove old params destructuring
  sed -i '/^[[:space:]]*const { [a-zA-Z]* } = params;$/d' "$file"
  sed -i '/^[[:space:]]*const { [a-zA-Z]* } = params\./d' "$file"
}

# List of files to fix
files=(
  "src/app/api/admin/feedback/[id]/feature/route.ts"
  "src/app/api/admin/feedback/[id]/route.ts"
  "src/app/api/admin/marquee-items/[id]/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    fix_single_param_route "$file"
  fi
done

echo "Done!"
