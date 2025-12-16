// Test script for GoMart API endpoints
const baseURL = 'http://localhost:3000';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, body = null, headers = {}) {
  try {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`Testing: ${name}`, 'blue');
    log(`Method: ${method} | URL: ${url}`, 'yellow');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      log(`✓ SUCCESS (${response.status})`, 'green');
      log(`Response:`, 'green');
      console.log(JSON.stringify(data, null, 2));
      return { success: true, data, status: response.status };
    } else {
      log(`✗ FAILED (${response.status})`, 'red');
      log(`Error: ${data.message || 'Unknown error'}`, 'red');
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    log(`✗ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n🚀 Starting GoMart API Endpoint Tests\n', 'cyan');
  
  // Test 1: Get all products
  await testEndpoint('Get All Products', 'GET', `${baseURL}/api/products`);
  
  // Test 2: Get all categories
  await testEndpoint('Get All Categories', 'GET', `${baseURL}/api/categories`);
  
  // Test 3: Get all customers
  await testEndpoint('Get All Customers', 'GET', `${baseURL}/api/customers`);
  
  // Test 4: Register a new customer
  const registerResult = await testEndpoint(
    'Register Customer',
    'POST',
    `${baseURL}/api/customers`,
    {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      phoneNumber: `024${Math.floor(Math.random() * 10000000)}`,
      password: 'testpassword123',
      region: 'Greater Accra',
      city: 'Accra',
      address: '123 Test Street',
    }
  );
  
  let customerId = null;
  if (registerResult.success && registerResult.data?.data?.customer) {
    customerId = registerResult.data.data.customer.id;
    log(`\n✓ Customer registered with ID: ${customerId}`, 'green');
  }
  
  // Test 5: Login (Authentication)
  const loginResult = await testEndpoint(
    'Customer Login (Authentication)',
    'POST',
    `${baseURL}/api/auth/login`,
    {
      identifier: 'test@example.com', // Use existing or the one we just created
      password: 'testpassword123',
    }
  );
  
  // Test 6: Get products with filters
  await testEndpoint('Get Products with Search', 'GET', `${baseURL}/api/products?search=test&limit=5`);
  
  // Test 7: Get products by category (if categories exist)
  await testEndpoint('Get Products by Category', 'GET', `${baseURL}/api/products?category=test`);
  
  // Test 8: Get cart (requires customerId)
  if (customerId) {
    await testEndpoint('Get Customer Cart', 'GET', `${baseURL}/api/cart?customerId=${customerId}`);
  }
  
  // Test 9: Get all vendors
  await testEndpoint('Get All Vendors', 'GET', `${baseURL}/api/vendors`);
  
  // Test 10: Get all reviews
  await testEndpoint('Get All Reviews', 'GET', `${baseURL}/api/reviews`);
  
  log('\n' + '='.repeat(60), 'cyan');
  log('✅ API Testing Complete!', 'green');
  log('='.repeat(60) + '\n', 'cyan');
}

// Wait for server to be ready
setTimeout(() => {
  runTests().catch(console.error);
}, 3000);

