const http = require('http');

// Test health endpoint
const testHealthCheck = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:9000', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Health Check Response:');
        console.log(JSON.parse(data));
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Health check failed:', err.message);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.error('❌ Request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

// Test IPFS upload endpoint
const testIPFSUpload = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      farmerName: "Ramesh Kumar",
      farmId: "farm123",
      carbonTons: 4.2,
      satelliteImages: {
        january: "/images/jan.jpg",
        june: "/images/jun.jpg"
      },
      certificateId: "CC-001"
    });

    const options = {
      hostname: 'localhost',
      port: 9000,
      path: '/upload-to-ipfs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('\n📤 IPFS Upload Response:');
        console.log(JSON.parse(data));
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (err) => {
      console.error('❌ IPFS upload failed:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

// Run tests
async function runTests() {
  console.log('🧪 Testing CarbonSetu Blockchain API...\n');
  
  try {
    await testHealthCheck();
    
    // Only test IPFS if Pinata credentials are configured
    if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
      await testIPFSUpload();
    } else {
      console.log('\n⚠️  Skipping IPFS test - Pinata credentials not configured');
    }
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();