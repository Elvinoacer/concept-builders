#!/bin/bash

BASE_URL="http://localhost:3000"

# 1. Get a Category ID
echo "Fetching categories..."
CATEGORIES_RESPONSE=$(curl -s "$BASE_URL/api/categories")

CATEGORY_ID=$(echo "$CATEGORIES_RESPONSE" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)

if [ -z "$CATEGORY_ID" ]; then
  echo "No existing categories found. Creating a test category..."
  CREATE_CAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/categories" \
    -H "Content-Type: application/json" \
    -d '{"name": "Test Category", "description": "For testing"}')
  CATEGORY_ID=$(echo "$CREATE_CAT_RESPONSE" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)
  
  if [ -z "$CATEGORY_ID" ]; then
      echo "Failed to create category. Exiting."
      exit 1
  fi
fi

echo "Using Category ID: $CATEGORY_ID"

# 2. Create a Design
echo "Creating a test design..."
CREATE_PAYLOAD=$(cat <<EOF
{
  "name": "Automated Test Design",
  "description": "This is a test design created by the verification script.",
  "basePrice": "5000",
  "categoryId": "$CATEGORY_ID",
  "images": {
    "create": [
      {
        "name": "test-image.jpg",
        "url": "https://placehold.co/600x400.jpg",
        "type": "IMAGE"
      }
    ]
  },
  "packageOptions": {
    "create": [
      {
        "name": "Basic Package",
        "price": "100"
      }
    ]
  }
}
EOF
)

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/designs" \
  -H "Content-Type: application/json" \
  -d "$CREATE_PAYLOAD")

# Check if design successfully created
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
  DESIGN_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -n 1 | cut -d'"' -f4)
  echo "✓ Successfully created design with ID: $DESIGN_ID"
else
  echo "✗ Failed to create design."
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

# 3. Verify Design Exists (GET)
echo "Verifying design exists..."
GET_RESPONSE=$(curl -s "$BASE_URL/api/designs/$DESIGN_ID")
if echo "$GET_RESPONSE" | grep -q "Automated Test Design"; then
  echo "✓ Design verification successful."
else
  echo "✗ Design verification failed."
  echo "Response: $GET_RESPONSE"
  exit 1
fi

# 4. Delete the Design
echo "Deleting the test design..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/designs/$DESIGN_ID")

if echo "$DELETE_RESPONSE" | grep -q '"success":true'; then
  echo "✓ Design deleted successfully."
else
  echo "⚠ Warning: Design might not have been deleted."
  echo "Response: $DELETE_RESPONSE"
fi

echo ""
echo "========================================="
echo "✓ ALL VERIFICATION TESTS PASSED!"
echo "========================================="
