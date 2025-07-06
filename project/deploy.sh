#!/bin/bash

# DoneSuite AWS Lambda Deployment Script
# Created by VENKATESH STACKS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STAGE=${1:-dev}
REGION=${2:-us-east-1}
SERVICE_NAME="donesuite-platform"

echo -e "${BLUE}🚀 Starting DoneSuite deployment to AWS Lambda...${NC}"
echo -e "${YELLOW}Stage: ${STAGE}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo -e "${RED}❌ Serverless Framework is not installed. Installing...${NC}"
    npm install -g serverless
fi

# Check if user is authenticated with AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Build the React application
echo -e "${BLUE}📦 Building React application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ React build completed${NC}"

# Install Lambda dependencies
echo -e "${BLUE}📦 Installing Lambda dependencies...${NC}"
cd lambda
npm install --production
cd ..

# Copy built files to lambda directory for deployment
echo -e "${BLUE}📁 Preparing files for deployment...${NC}"
mkdir -p lambda/dist
cp -r dist/* lambda/dist/

# Deploy to AWS
echo -e "${BLUE}🚀 Deploying to AWS Lambda...${NC}"
cd lambda

serverless deploy \
    --stage $STAGE \
    --region $REGION \
    --verbose

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get deployment outputs
echo -e "${BLUE}📋 Deployment Information:${NC}"
aws cloudformation describe-stacks \
    --stack-name $SERVICE_NAME-$STAGE \
    --region $REGION \
    --query 'Stacks[0].Outputs' \
    --output table

echo -e "${GREEN}🎉 DoneSuite is now deployed and ready to use!${NC}"
echo -e "${YELLOW}💡 Don't forget to configure your OAuth providers in AWS Systems Manager Parameter Store${NC}"
echo -e "${YELLOW}💡 Set up your domain and SSL certificate for production use${NC}" 