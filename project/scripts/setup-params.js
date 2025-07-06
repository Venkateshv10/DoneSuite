#!/usr/bin/env node

const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm');
const crypto = require('crypto');
const readline = require('readline');

const ssm = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupParameters() {
  console.log('🔧 Setting up AWS Systems Manager Parameters for DoneSuite\n');
  
  const stage = process.argv[2] || 'dev';
  console.log(`Stage: ${stage}\n`);

  try {
    // Generate JWT Secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    
    // JWT Secret
    await putParameter(`/donesuite/${stage}/jwt-secret`, jwtSecret, 'JWT Secret');
    
    // OAuth Configuration
    console.log('\n📋 OAuth Provider Configuration');
    console.log('You can skip any provider by pressing Enter\n');
    
    // Google OAuth
    const googleClientId = await question('Google Client ID (optional): ');
    if (googleClientId.trim()) {
      const googleClientSecret = await question('Google Client Secret: ');
      await putParameter(`/donesuite/${stage}/google-client-id`, googleClientId, 'Google Client ID');
      await putParameter(`/donesuite/${stage}/google-client-secret`, googleClientSecret, 'Google Client Secret');
    }
    
    // GitHub OAuth
    const githubClientId = await question('GitHub Client ID (optional): ');
    if (githubClientId.trim()) {
      const githubClientSecret = await question('GitHub Client Secret: ');
      await putParameter(`/donesuite/${stage}/github-client-id`, githubClientId, 'GitHub Client ID');
      await putParameter(`/donesuite/${stage}/github-client-secret`, githubClientSecret, 'GitHub Client Secret');
    }
    
    // Microsoft OAuth
    const microsoftClientId = await question('Microsoft Client ID (optional): ');
    if (microsoftClientId.trim()) {
      const microsoftClientSecret = await question('Microsoft Client Secret: ');
      await putParameter(`/donesuite/${stage}/microsoft-client-id`, microsoftClientId, 'Microsoft Client ID');
      await putParameter(`/donesuite/${stage}/microsoft-client-secret`, microsoftClientSecret, 'Microsoft Client Secret');
    }
    
    console.log('\n✅ AWS Parameters setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Configure your OAuth providers in their respective consoles');
    console.log('2. Set up redirect URIs for your domain');
    console.log('3. Run the deployment script: npm run deploy:dev');
    
  } catch (error) {
    console.error('❌ Error setting up parameters:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function putParameter(name, value, description) {
  try {
    const command = new PutParameterCommand({
      Name: name,
      Value: value,
      Type: 'SecureString',
      Description: description,
      Overwrite: true
    });
    
    await ssm.send(command);
    console.log(`✅ ${description} configured`);
  } catch (error) {
    console.error(`❌ Failed to configure ${description}:`, error.message);
    throw error;
  }
}

// Run the setup
setupParameters().catch(console.error); 