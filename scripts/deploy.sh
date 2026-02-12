#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}
STACK_NAME="event-management-api-${ENVIRONMENT}"

echo "Deploying Event Management API to ${ENVIRONMENT}..."

npm ci --production

zip -r lambda-package.zip src/ node_modules/ package.json

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="event-management-deployments-${AWS_ACCOUNT_ID}-${ENVIRONMENT}"

aws s3 mb s3://${BUCKET_NAME} --region ${AWS_REGION} 2>/dev/null || true

aws s3 cp lambda-package.zip s3://${BUCKET_NAME}/${ENVIRONMENT}/lambda-package.zip

aws cloudformation deploy \
  --template-file cloudformation/template.yml \
  --stack-name ${STACK_NAME} \
  --parameter-overrides Environment=${ENVIRONMENT} \
  --capabilities CAPABILITY_IAM \
  --region ${AWS_REGION}

API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

echo ""
echo "Deployment complete!"
echo "API Endpoint: ${API_ENDPOINT}"
echo ""
echo "Test with:"
echo "  curl ${API_ENDPOINT}/health"
