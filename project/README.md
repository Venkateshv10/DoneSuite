# DoneSuite

DoneSuite is a modern, interactive to-do list dashboard built with React, Vite, and Tailwind CSS. It features a beautiful UI, user authentication (including social logins), a profile section, and a stylish logout experience. Easily add, edit, complete, and delete your to-dos in a responsive, delightful interface.

**Developed by VENKEY STACKS**

## Features
- Beautiful dashboard with gradient backgrounds and modern design
- User authentication (email/password & social logins)
- Profile dropdown with user info and logout
- Add, edit, complete, and delete to-dos (CRUD)
- Animated progress bar and celebratory messages
- Responsive, mobile-friendly, and dark mode support

## Getting Started
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open [http://localhost:5173/](http://localhost:5173/) in your browser

---

**© 2024 VENKEY STACKS. All rights reserved.**

Enjoy managing your tasks with DoneSuite!

## 🚀 Features

### Authentication & Security
- **Multiple Sign-in Options**: Email/password, Google, GitHub, and Microsoft OAuth
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Role-based Access**: Admin and user roles with different permissions

### User Interface
- **Modern Design**: Beautiful, responsive UI with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Live data synchronization
- **Mobile Responsive**: Works perfectly on all devices

### Data Management
- **Participants Tracking**: Manage hackathon participants and their progress
- **Project Management**: Track projects, teams, and development stages
- **Task Management**: Assign and monitor tasks with deadlines
- **Export Functionality**: Export data to JSON and CSV formats

### AWS Integration
- **Serverless Architecture**: Built on AWS Lambda for scalability
- **DynamoDB**: NoSQL database for flexible data storage
- **S3 Storage**: Static asset hosting and file storage
- **API Gateway**: RESTful API endpoints
- **CloudWatch**: Comprehensive logging and monitoring

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **AWS Lambda** - Serverless compute
- **DynamoDB** - NoSQL database
- **API Gateway** - REST API management
- **S3** - Object storage
- **CloudWatch** - Monitoring and logging

### Authentication
- **JWT** - JSON Web Tokens
- **OAuth 2.0** - Google, GitHub, Microsoft
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm 8+
- AWS CLI configured
- AWS account with appropriate permissions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/venkateshstacks/donesuite-platform.git
   cd donesuite-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 AWS Deployment

### Quick Start

1. **Setup AWS Parameters**
   ```bash
   npm run setup:aws
   ```

2. **Deploy to AWS**
   ```bash
   npm run deploy:dev
   ```

### Manual Setup

1. **Configure AWS CLI**
   ```bash
   aws configure
   ```

2. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

3. **Setup OAuth Providers**
   - [Google Cloud Console](https://console.cloud.google.com/)
   - [GitHub Developer Settings](https://github.com/settings/developers)
   - [Azure Portal](https://portal.azure.com/)

4. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh dev
   ```

For detailed deployment instructions, see [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# AWS Configuration
AWS_REGION=us-east-1
STAGE=dev

# JWT Secret (auto-generated)
JWT_SECRET=your-jwt-secret

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://your-domain.com/auth/callback`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `https://your-domain.com/auth/callback`

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Configure redirect URIs: `https://your-domain.com/auth/callback`

## 📚 API Documentation

### Authentication Endpoints

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}
```

```http
POST /auth/oauth
Content-Type: application/json

{
  "provider": "google",
  "token": "oauth-token"
}
```

### Data Endpoints

```http
GET /api/participants
Authorization: Bearer <jwt-token>

GET /api/projects
Authorization: Bearer <jwt-token>

GET /api/tasks
Authorization: Bearer <jwt-token>
```

## 🏗️ Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── AuthPage.jsx     # Authentication page
│   │   ├── LoginForm.jsx    # Login form with OAuth
│   │   ├── RegisterForm.jsx # Registration form
│   │   └── Header.jsx       # Navigation header
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── data/                # Sample data
│   ├── utils/               # Utility functions
│   └── App.jsx              # Main application
├── lambda/                  # AWS Lambda functions
│   ├── api.js              # Main API handler
│   ├── static.js           # Static file handler
│   └── package.json        # Lambda dependencies
├── serverless.yml          # Serverless configuration
├── deploy.sh               # Deployment script
└── AWS_DEPLOYMENT.md       # Deployment guide
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **OAuth Integration**: Secure third-party authentication
- **CORS Configuration**: Proper cross-origin resource sharing
- **IAM Roles**: Least privilege access to AWS resources
- **Parameter Store**: Secure storage of sensitive configuration

## 📊 Monitoring & Logging

- **CloudWatch Logs**: Automatic logging of all Lambda functions
- **CloudWatch Metrics**: Performance monitoring and alerting
- **X-Ray Tracing**: Distributed tracing (optional)
- **Error Tracking**: Comprehensive error handling and reporting

## 💰 Cost Optimization

- **DynamoDB On-Demand**: Pay-per-request billing
- **Lambda Optimization**: Minimal cold start times
- **S3 Lifecycle**: Automatic cleanup of old data
- **CloudFront**: Global content delivery (optional)

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API Gateway CORS configuration
   - Verify allowed origins

2. **Authentication Failures**
   - Verify JWT secret in Parameter Store
   - Check OAuth provider credentials

3. **Database Errors**
   - Verify DynamoDB table permissions
   - Check IAM role configuration

4. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**VENKATESH STACKS**

- GitHub: [@venkateshstacks](https://github.com/venkateshstacks)
- LinkedIn: [Venkatesh Stacks](https://linkedin.com/in/venkateshstacks)

## 🙏 Acknowledgments

- React team for the amazing framework
- AWS for the serverless infrastructure
- Tailwind CSS for the beautiful styling
- Lucide for the beautiful icons

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for deployment help
- Review CloudWatch logs for debugging

---

**Made with ❤️ by VENKATESH STACKS**