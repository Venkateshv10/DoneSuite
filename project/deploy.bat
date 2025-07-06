@echo off
REM DoneSuite AWS Lambda Deployment Script for Windows
REM Created by VENKATESH STACKS

setlocal enabledelayedexpansion

REM Configuration
set STAGE=%1
if "%STAGE%"=="" set STAGE=dev
set REGION=%2
if "%REGION%"=="" set REGION=us-east-1
set SERVICE_NAME=donesuite-platform

echo 🚀 Starting DoneSuite deployment to AWS Lambda...
echo Stage: %STAGE%
echo Region: %REGION%

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not installed. Please install it first.
    exit /b 1
)

REM Check if Serverless Framework is installed
where serverless >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Serverless Framework is not installed. Installing...
    npm install -g serverless
)

REM Check if user is authenticated with AWS
aws sts get-caller-identity >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ AWS credentials not configured. Please run 'aws configure' first.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Build the React application
echo 📦 Building React application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ React build completed

REM Install Lambda dependencies
echo 📦 Installing Lambda dependencies...
cd lambda
call npm install --production
cd ..

REM Copy built files to lambda directory for deployment
echo 📁 Preparing files for deployment...
if not exist lambda\dist mkdir lambda\dist
xcopy /E /I /Y dist\* lambda\dist\

REM Deploy to AWS
echo 🚀 Deploying to AWS Lambda...
cd lambda

serverless deploy --stage %STAGE% --region %REGION% --verbose
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    cd ..
    exit /b 1
)

cd ..

echo ✅ Deployment completed successfully!

REM Get deployment outputs
echo 📋 Deployment Information:
aws cloudformation describe-stacks --stack-name %SERVICE_NAME%-%STAGE% --region %REGION% --query 'Stacks[0].Outputs' --output table

echo 🎉 DoneSuite is now deployed and ready to use!
echo 💡 Don't forget to configure your OAuth providers in AWS Systems Manager Parameter Store
echo 💡 Set up your domain and SSL certificate for production use

pause 