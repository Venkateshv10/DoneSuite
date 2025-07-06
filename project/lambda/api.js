const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Credentials': true,
};

// Helper functions
const generateJWT = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      provider: user.provider 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const getAuthToken = (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

const requireAuth = (event) => {
  const token = getAuthToken(event);
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const decoded = verifyJWT(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }
  
  return decoded;
};

// Authentication handlers
const handleLogin = async (event) => {
  const { email, password } = JSON.parse(event.body);
  
  if (!email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Email and password are required' })
    };
  }

  try {
    // Query user by email
    const result = await dynamodb.query({
      TableName: `donesuite-${process.env.STAGE || 'dev'}-users`,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    const user = result.Items[0];
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    const token = generateJWT(user);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar
        },
        token
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const handleRegister = async (event) => {
  const { name, email, password } = JSON.parse(event.body);
  
  if (!name || !email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Name, email, and password are required' })
    };
  }

  if (password.length < 6) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Password must be at least 6 characters' })
    };
  }

  try {
    // Check if user already exists
    const existingUser = await dynamodb.query({
      TableName: `donesuite-${process.env.STAGE || 'dev'}-users`,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    if (existingUser.Items.length > 0) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'User already exists' })
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: `user_${Date.now()}`,
      email,
      name,
      password: hashedPassword,
      role: 'user',
      provider: 'email',
      avatar: null,
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: `donesuite-${process.env.STAGE || 'dev'}-users`,
      Item: user
    }).promise();

    const token = generateJWT(user);
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar
        },
        token
      })
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

const handleOAuthLogin = async (event) => {
  const { provider, token } = JSON.parse(event.body);
  
  if (!provider || !token) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Provider and token are required' })
    };
  }

  try {
    let userInfo;
    
    switch (provider) {
      case 'google':
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        userInfo = {
          id: `google_${payload.sub}`,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          provider: 'google'
        };
        break;
        
      case 'github':
        const githubResponse = await axios.get('https://api.github.com/user', {
          headers: { Authorization: `token ${token}` }
        });
        const githubUser = githubResponse.data;
        userInfo = {
          id: `github_${githubUser.id}`,
          email: githubUser.email,
          name: githubUser.name || githubUser.login,
          avatar: githubUser.avatar_url,
          provider: 'github'
        };
        break;
        
      case 'microsoft':
        const msResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const msUser = msResponse.data;
        userInfo = {
          id: `microsoft_${msUser.id}`,
          email: msUser.mail || msUser.userPrincipalName,
          name: msUser.displayName,
          avatar: null,
          provider: 'microsoft'
        };
        break;
        
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Unsupported provider' })
        };
    }

    // Check if user exists, create if not
    let user = await dynamodb.get({
      TableName: `donesuite-${process.env.STAGE || 'dev'}-users`,
      Key: { id: userInfo.id }
    }).promise();

    if (!user.Item) {
      user = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        role: 'user',
        provider: userInfo.provider,
        avatar: userInfo.avatar,
        createdAt: new Date().toISOString()
      };
      
      await dynamodb.put({
        TableName: `donesuite-${process.env.STAGE || 'dev'}-users`,
        Item: user
      }).promise();
    } else {
      user = user.Item;
    }

    const jwtToken = generateJWT(user);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          provider: user.provider,
          avatar: user.avatar
        },
        token: jwtToken
      })
    };
  } catch (error) {
    console.error('OAuth login error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'OAuth authentication failed' })
    };
  }
};

// Data handlers
const handleGetData = async (event) => {
  try {
    const user = requireAuth(event);
    const { type } = event.pathParameters || {};
    
    const tableName = `donesuite-${process.env.STAGE || 'dev'}-${type}`;
    
    const result = await dynamodb.scan({
      TableName: tableName
    }).promise();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error('Get data error:', error);
    return {
      statusCode: error.message.includes('Authentication') ? 401 : 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const handleCreateData = async (event) => {
  try {
    const user = requireAuth(event);
    const { type } = event.pathParameters || {};
    const data = JSON.parse(event.body);
    
    const tableName = `donesuite-${process.env.STAGE || 'dev'}-${type}`;
    const item = {
      id: `${type}_${Date.now()}`,
      ...data,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    
    await dynamodb.put({
      TableName: tableName,
      Item: item
    }).promise();
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Create data error:', error);
    return {
      statusCode: error.message.includes('Authentication') ? 401 : 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Main handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  const { path, httpMethod } = event;
  
  try {
    // Authentication routes
    if (path === '/auth/login' && httpMethod === 'POST') {
      return await handleLogin(event);
    }
    
    if (path === '/auth/register' && httpMethod === 'POST') {
      return await handleRegister(event);
    }
    
    if (path === '/auth/oauth' && httpMethod === 'POST') {
      return await handleOAuthLogin(event);
    }
    
    // Data routes
    if (path.match(/^\/api\/(participants|projects|tasks)$/) && httpMethod === 'GET') {
      return await handleGetData(event);
    }
    
    if (path.match(/^\/api\/(participants|projects|tasks)$/) && httpMethod === 'POST') {
      return await handleCreateData(event);
    }
    
    // Default response
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 