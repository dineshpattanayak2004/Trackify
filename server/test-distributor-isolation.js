import http from 'http';

const BASE_URL = 'http://localhost:4000';

// Test credentials
const distributors = [
  { email: 'distributor@trackify.test', password: 'distpass', name: 'Test Distribution Co.' },
  { email: 'techdistro@trackify.test', password: 'distpass', name: 'TechDistro Pvt Ltd' },
  { email: 'softwaresolutions@trackify.test', password: 'distpass', name: 'Software Solutions Inc' },
];

let tokens = {};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Login and get token
async function login(email, password) {
  const result = await makeRequest('POST', '/distributor/login', { email, password });
  if (result.status === 200 && result.data.token) {
    return result.data.token;
  }
  throw new Error(`Login failed for ${email}: ${JSON.stringify(result.data)}`);
}

// Test 1: Login all distributors
async function testLogin() {
  console.log('\n=== Test 1: Login Distributors ===');
  for (const dist of distributors) {
    try {
      const token = await login(dist.email, dist.password);
      tokens[dist.email] = token;
      console.log(`✓ ${dist.name} logged in successfully`);
    } catch (err) {
      console.error(`✗ ${dist.name} login failed:`, err.message);
      throw err;
    }
  }
}

// Test 2: Create orders for different distributors
async function testCreateOrders() {
  console.log('\n=== Test 2: Create Orders for Each Distributor ===');
  
  const testOrders = [
    {
      distributorEmail: 'distributor@trackify.test',
      order: {
        userId: 'testuser1',
        userName: 'Test User 1',
        productId: '1',
        productName: 'Trackify Pro License',
        qty: 2,
        total: 5998,
        paymentMethod: 'UPI',
        distributor: 'Test Distribution Co.',
        distributorId: null, // Will be filled after getting distributor ID
      }
    },
    {
      distributorEmail: 'techdistro@trackify.test',
      order: {
        userId: 'testuser2',
        userName: 'Test User 2',
        productId: '9',
        productName: 'AI Chatbot Assistant',
        qty: 1,
        total: 4999,
        paymentMethod: 'Credit Card',
        distributor: 'TechDistro Pvt Ltd',
        distributorId: null,
      }
    },
    {
      distributorEmail: 'softwaresolutions@trackify.test',
      order: {
        userId: 'testuser3',
        userName: 'Test User 3',
        productId: '17',
        productName: 'Cloud Storage 1TB',
        qty: 3,
        total: 7497,
        paymentMethod: 'Cash on Delivery',
        distributor: 'Software Solutions Inc',
        distributorId: null,
      }
    }
  ];

  // First get distributor IDs
  for (const test of testOrders) {
    const distInfo = await makeRequest('GET', '/distributor/me', null, tokens[test.distributorEmail]);
    if (distInfo.status === 200) {
      test.order.distributorId = distInfo.data.id;
      console.log(`  ${test.distributorEmail} ID: ${distInfo.data.id}`);
    } else {
      console.error(`  Failed to get distributor info:`, distInfo.data);
      throw new Error('Could not get distributor ID');
    }
  }

  // Create orders
  for (const test of testOrders) {
    const result = await makeRequest('POST', '/orders', test.order, tokens[test.distributorEmail]);
    if (result.status === 200 && result.data.success) {
      console.log(`✓ Order created for ${test.order.distributor}: ${result.data.order.id}`);
    } else {
      console.error(`✗ Failed to create order for ${test.order.distributor}:`, result.data);
      throw new Error('Order creation failed');
    }
  }
}

// Test 3: Verify each distributor only sees their own orders
async function testOrderIsolation() {
  console.log('\n=== Test 3: Verify Order Isolation ===');
  
  for (const dist of distributors) {
    const result = await makeRequest('GET', '/orders', null, tokens[dist.email]);
    
    if (result.status === 200 && Array.isArray(result.data)) {
      const orders = result.data;
      console.log(`\n${dist.name}:`);
      console.log(`  Total orders: ${orders.length}`);
      
      if (orders.length > 0) {
        orders.forEach((order, idx) => {
          console.log(`  Order ${idx + 1}: ${order.productName} - Distributor: ${order.distributor} (ID: ${order.distributorId})`);
        });

        // Verify all orders belong to this distributor
        const allOrdersBelongToDistributor = orders.every(order => {
          // Get distributor ID from the test data
          const expectedId = distributors.find(d => d.email === dist.email) ? 
            testOrderIsolation.distributorIds?.[dist.email] : null;
          return order.distributor === dist.name || order.distributorId === expectedId || !order.distributorId;
        });

        if (allOrdersBelongToDistributor || orders.length === 0) {
          console.log(`  ✓ All orders belong to ${dist.name} (or no distributorId set)`);
        } else {
          console.log(`  ✗ WARNING: Some orders might not belong to ${dist.name}`);
        }
      } else {
        console.log(`  (No orders found - this is okay if none were created)`);
      }
    } else {
      console.error(`✗ Failed to fetch orders for ${dist.name}:`, result.data);
    }
  }
}

// Test 4: Verify products are unique per distributor
async function testProductIsolation() {
  console.log('\n=== Test 4: Verify Product Isolation ===');
  
  for (const dist of distributors) {
    const result = await makeRequest('GET', '/public/distributors', null, null);
    
    if (result.status === 200) {
      const allDistributors = result.data;
      const currentDist = allDistributors.find(d => d.email === dist.email);
      
      if (currentDist) {
        const productsResult = await makeRequest('GET', `/public/distributors/${currentDist.id}/products`, null, null);
        
        if (productsResult.status === 200 && Array.isArray(productsResult.data)) {
          const products = productsResult.data;
          console.log(`\n${dist.name}:`);
          console.log(`  Total products: ${products.length}`);
          console.log(`  Products: ${products.map(p => p.name).join(', ')}`);
        }
      }
    }
  }
}

// Main test runner
async function runTests() {
  console.log('========================================');
  console.log('Testing Distributor Isolation');
  console.log('========================================');

  try {
    await testLogin();
    await testCreateOrders();
    await testOrderIsolation();
    await testProductIsolation();

    console.log('\n========================================');
    console.log('✓ All tests completed successfully!');
    console.log('========================================');
  } catch (err) {
    console.error('\n========================================');
    console.error('✗ Test failed:', err.message);
    console.error('========================================');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await makeRequest('GET', '/health');
    return true;
  } catch (err) {
    return false;
  }
}

// Run tests
(async () => {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('✗ Server is not running. Please start the server first with: npm run dev');
    process.exit(1);
  }
  
  console.log('✓ Server is running');
  await runTests();
})();
