#!/bin/bash

# Script to find routes that don't await params

echo "Checking all dynamic routes for missing 'await params'..."
echo ""

ROUTES_NEEDING_FIX=()

while IFS= read -r route; do
    if ! grep -q "await params" "$route"; then
        ROUTES_NEEDING_FIX+=("$route")
    fi
done < <(find src/app/api -name "route.ts" -path "*\[*\]*" | sort)

echo "Found ${#ROUTES_NEEDING_FIX[@]} routes that need fixing:"
echo ""

for route in "${ROUTES_NEEDING_FIX[@]}"; do
    echo "- $route"
done
