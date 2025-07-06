const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Credentials': true,
};

exports.handler = async (event) => {
  console.log('Static handler event:', JSON.stringify(event, null, 2));
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const bucketName = process.env.STATIC_BUCKET;
    let key = 'index.html'; // Default to index.html
    
    // Extract the path from the event
    if (event.pathParameters && event.pathParameters.proxy) {
      key = event.pathParameters.proxy;
    } else if (event.path && event.path !== '/') {
      key = event.path.substring(1); // Remove leading slash
    }
    
    // If no file extension, assume it's a route and serve index.html
    if (!key.includes('.')) {
      key = 'index.html';
    }
    
    console.log(`Serving file: ${key} from bucket: ${bucketName}`);
    
    const params = {
      Bucket: bucketName,
      Key: key
    };
    
    const result = await s3.getObject(params).promise();
    
    // Determine content type based on file extension
    const getContentType = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      const contentTypes = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
        'ttf': 'font/ttf',
        'eot': 'application/vnd.ms-fontobject'
      };
      return contentTypes[ext] || 'application/octet-stream';
    };
    
    const contentType = getContentType(key);
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
      },
      body: result.Body.toString('base64'),
      isBase64Encoded: true
    };
    
  } catch (error) {
    console.error('Static handler error:', error);
    
    // If file not found, serve index.html for SPA routing
    if (error.code === 'NoSuchKey' || error.statusCode === 404) {
      try {
        const bucketName = process.env.STATIC_BUCKET;
        const result = await s3.getObject({
          Bucket: bucketName,
          Key: 'index.html'
        }).promise();
        
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          },
          body: result.Body.toString('base64'),
          isBase64Encoded: true
        };
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    }
    
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'File not found' })
    };
  }
}; 