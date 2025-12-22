#!/bin/bash

# Base URL
BASE_URL="http://localhost:8002/v1"

# 1. Create a Project
echo "Creating Project..."
PROJECT_RESP=$(curl -s -X POST "$BASE_URL/projects")
PROJECT_ID=$(echo $PROJECT_RESP | grep -o '"id":[0-9]*' | head -1 | awk -F: '{print $2}')

if [ -z "$PROJECT_ID" ]; then
    echo "Failed to create project. Response: $PROJECT_RESP"
    exit 1
fi

echo "Project Created: ID=$PROJECT_ID"

# 2. Generate Topics (Simulate)
echo "Generating Topics..."
curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/topics/generate" \
    -H "Content-Type: application/json" \
    -d '{"initialIdea": "AI in Healthcare"}' > /dev/null

# 3. Confirm Topic
echo "Confirming Topic..."
CONFIRM_RESP=$(curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/topics/confirm" \
    -H "Content-Type: application/json" \
    -d '{"title": "The Impact of AI on Modern Healthcare", "rationale": "High relevance", "candidateId": null}')

echo "Confirm Response: $CONFIRM_RESP"

# 4. Verify Project Status
echo "Verifying Project Status..."
GET_RESP=$(curl -s -X GET "$BASE_URL/projects/$PROJECT_ID")
STATUS=$(echo $GET_RESP | grep -o '"status":"[^"]*"' | awk -F: '{print $2}' | tr -d '"')
TITLE=$(echo $GET_RESP | grep -o '"title":"[^"]*"' | awk -F: '{print $2}' | tr -d '"')

echo "Project Status: $STATUS"
echo "Project Title: $TITLE"

if [ "$STATUS" == "TOPIC_SELECTED" ] && [ "$TITLE" == "The Impact of AI on Modern Healthcare" ]; then
    echo "✅ Verification SUCCESS"
else
    echo "❌ Verification FAILED"
    exit 1
fi
