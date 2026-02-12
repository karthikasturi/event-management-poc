# Lambda Deployment Guide

## Prerequisites

- AWS CLI configured with credentials
- Node.js 18.x
- AWS account with appropriate permissions

## Architecture

- **Lambda Function**: Runs Express app using serverless-express
- **API Gateway HTTP API**: Routes requests to Lambda
- **CloudWatch Logs**: Stores Lambda and API Gateway logs
- **S3 Bucket**: Stores deployment packages

## Quick Deploy

```bash
./scripts/deploy.sh dev
```

## Manual Deployment Steps

### 1. Install dependencies

```bash
npm ci --production
```

### 2. Package Lambda function

```bash
zip -r lambda-package.zip src/ node_modules/ package.json
```

### 3. Create S3 bucket (first time only)

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws s3 mb s3://event-management-deployments-${AWS_ACCOUNT_ID}-dev
```

### 4. Upload package to S3

```bash
aws s3 cp lambda-package.zip s3://event-management-deployments-${AWS_ACCOUNT_ID}-dev/dev/lambda-package.zip
```

### 5. Deploy CloudFormation stack

```bash
aws cloudformation deploy \
  --template-file cloudformation/template.yml \
  --stack-name event-management-api-dev \
  --parameter-overrides Environment=dev \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### 6. Get API endpoint

```bash
aws cloudformation describe-stacks \
  --stack-name event-management-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

## Testing

```bash
# Health check
curl https://YOUR_API_ENDPOINT/health

# Create event
curl -X POST https://YOUR_API_ENDPOINT/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Lambda Event","date":"2026-03-15","location":"AWS"}'

# List events
curl https://YOUR_API_ENDPOINT/api/events
```

## GitHub Actions Setup

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`

## Stack Deletion

```bash
aws cloudformation delete-stack --stack-name event-management-api-dev
```

## Environment Variables

Set in CloudFormation template under Lambda Environment Variables. No secrets should be hardcoded.
