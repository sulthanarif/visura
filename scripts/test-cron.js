// scripts/test-cron.js
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const testCronEndpoint = async () => {
  console.log('🧪 Testing Cron Keep-Alive Endpoint...\n');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cron/keep-alive',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`📊 Status Code: ${res.statusCode}`);
          console.log(`📝 Response:`, JSON.stringify(response, null, 2));
          
          if (res.statusCode === 200) {
            console.log('✅ Cron endpoint test PASSED');
          } else {
            console.log('❌ Cron endpoint test FAILED');
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Failed to parse response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      reject(error);
    });

    req.end();
  });
};

const testStatusEndpoint = async () => {
  console.log('\n🔍 Testing Status Endpoint...\n');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cron/status',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`📊 Status Code: ${res.statusCode}`);
          console.log(`📝 Response:`, JSON.stringify(response, null, 2));
          
          if (res.statusCode === 200 && response.status === 'healthy') {
            console.log('✅ Status endpoint test PASSED');
          } else {
            console.log('❌ Status endpoint test FAILED');
          }
          
          resolve(response);
        } catch (error) {
          console.log('❌ Failed to parse response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      reject(error);
    });

    req.end();
  });
};

const main = async () => {
  console.log('🚀 Starting Cron Job Tests...\n');
  console.log('⚠️  Make sure your Next.js dev server is running on localhost:3000\n');
  
  // Check environment variables
  if (!process.env.CRON_SECRET) {
    console.log('⚠️  CRON_SECRET not found in environment variables');
    console.log('   Using "test-secret" for local testing\n');
  }

  try {
    // Test status endpoint first
    await testStatusEndpoint();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test keep-alive endpoint
    await testCronEndpoint();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Set CRON_SECRET in your .env.local file');
    console.log('   2. Deploy to Vercel with vercel.json');
    console.log('   3. Set CRON_SECRET in Vercel environment variables');
    console.log('   4. Monitor cron execution in Vercel Dashboard');
    
  } catch (error) {
    console.log('\n💥 Test failed:', error.message);
    process.exit(1);
  }
};

main();
