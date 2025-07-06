# DoneSuite AWS Lambda Deployment Guide

This guide will walk you through deploying the DoneSuite platform to AWS Lambda using the Serverless Framework.

## Prerequisites

1. **AWS Account**: You need an active AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI
3. **Node.js**: Version 16 or higher
4. **Serverless Framework**: Install globally with `npm install -g serverless`

## Setup Instructions

### 1. AWS Configuration

```bash
# Configure AWS CLI
aws configure

# Enter your AWS Access Key ID, Secret Access Key, and default region
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install

# Install Lambda dependencies
cd lambda
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# AWS Configuration
AWS_REGION=us-east-1
STAGE=dev

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth Provider Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### 4. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `https://your-domain.com/auth/callback`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://your-domain.com/auth/callback`

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Configure redirect URIs: `https://your-domain.com/auth/callback`

### 5. AWS Systems Manager Parameter Store

Store sensitive configuration in AWS Systems Manager Parameter Store:

```bash
# JWT Secret
aws ssm put-parameter \
    --name "/donesuite/dev/jwt-secret" \
    --value "your-super-secret-jwt-key-here" \
    --type "SecureString" \
    --region us-east-1

# Google OAuth
aws ssm put-parameter \
    --name "/donesuite/dev/google-client-id" \
    --value "your-google-client-id" \
    --type "SecureString" \
    --region us-east-1

aws ssm put-parameter \
    --name "/donesuite/dev/google-client-secret" \
    --value "your-google-client-secret" \
    --type "SecureString" \
    --region us-east-1

# GitHub OAuth
aws ssm put-parameter \
    --name "/donesuite/dev/github-client-id" \
    --value "your-github-client-id" \
    --type "SecureString" \
    --region us-east-1

aws ssm put-parameter \
    --name "/donesuite/dev/github-client-secret" \
    --value "your-github-client-secret" \
    --type "SecureString" \
    --region us-east-1

# Microsoft OAuth
aws ssm put-parameter \
    --name "/donesuite/dev/microsoft-client-id" \
    --value "your-microsoft-client-id" \
    --type "SecureString" \
    --region us-east-1

aws ssm put-parameter \
    --name "/donesuite/dev/microsoft-client-secret" \
    --value "your-microsoft-client-secret" \
    --type "SecureString" \
    --region us-east-1
```

## Deployment

### Quick Deployment

Use the provided deployment script:

```bash
# Make script executable
chmod +x deploy.sh

# Deploy to dev stage
./deploy.sh dev

# Deploy to production
./deploy.sh prod
```

### Manual Deployment

```bash
# Build the React application
npm run build

# Deploy using Serverless Framework
cd lambda
serverless deploy --stage dev --region us-east-1
cd ..
```

## Architecture Overview

The deployment creates the following AWS resources:

### Lambda Functions
- **API Handler**: Handles authentication and data operations
- **Static Handler**: Serves the React application from S3

### Database
- **DynamoDB Tables**:
  - Users table with email index
  - Participants table
  - Projects table
  - Tasks table

### Storage
- **S3 Bucket**: Stores static assets and serves the React app

### API Gateway
- **REST API**: Provides HTTP endpoints for the application

## API Endpoints

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `POST /auth/oauth` - OAuth authentication

### Data Operations
- `GET /api/participants` - Get all participants
- `POST /api/participants` - Create participant
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: Bcrypt for password security
3. **OAuth Integration**: Support for Google, GitHub, and Microsoft
4. **CORS Configuration**: Proper cross-origin resource sharing
5. **IAM Roles**: Least privilege access to AWS resources

## Monitoring and Logging

### CloudWatch Logs
All Lambda function logs are automatically sent to CloudWatch Logs.

### CloudWatch Metrics
Monitor function performance and errors through CloudWatch Metrics.

### X-Ray Tracing
Enable X-Ray for distributed tracing (optional).

## Cost Optimization

1. **DynamoDB On-Demand**: Pay-per-request billing
2. **Lambda Cold Starts**: Optimize function size and dependencies
3. **S3 Lifecycle**: Configure lifecycle policies for old data
4. **CloudFront**: Use CloudFront for static asset delivery

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS configuration in API Gateway
2. **Authentication Failures**: Verify JWT secret and OAuth credentials
3. **Database Errors**: Check DynamoDB table permissions
4. **Build Failures**: Ensure all dependencies are installed

### Debug Commands

```bash
# View CloudWatch logs
aws logs tail /aws/lambda/donesuite-platform-dev-api --follow

# Test API endpoints
curl -X POST https://your-api-gateway-url/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check deployment status
serverless info --stage dev
```

## Production Considerations

1. **Custom Domain**: Set up a custom domain with SSL certificate
2. **CloudFront**: Use CloudFront for global content delivery
3. **Monitoring**: Set up CloudWatch alarms and notifications
4. **Backup**: Configure DynamoDB point-in-time recovery
5. **Security**: Enable AWS WAF for additional protection

## Support

For issues and questions:
- Check the CloudWatch logs for detailed error information
- Review the serverless.yml configuration
- Ensure all environment variables are properly set
- Verify AWS IAM permissions

---

**Created by VENKATESH STACKS**

This deployment guide ensures a secure, scalable, and cost-effective deployment of the DoneSuite platform on AWS Lambda. 