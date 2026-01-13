/**
 * Development utility to check backend connectivity and API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Check if backend is running
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('Backend is running:', data);
      return true;
    } else {
      console.error('Backend health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Backend is not reachable:', error.message);
    return false;
  }
};

/**
 * Check specific API endpoints
 */
export const checkApiEndpoints = async () => {
  // Skip POST-only endpoints that would 404 on GET requests
  const skipEndpoints = ['/orders', '/orders/pay/create', '/orders/pay/verify'];

  const endpoints = [
    '/products',
    '/collections',
    '/mobile'
  ];

  console.log('Checking API endpoints...');

  for (const endpoint of endpoints) {
    if (skipEndpoints.includes(endpoint)) {
      console.log(`${endpoint} - Skipped (POST-only endpoint)`);
      continue;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.log(`${endpoint} - Requires authentication (401)`);
      } else if (response.status === 404) {
        console.error(`${endpoint} - Not found (404)`);
      } else if (response.ok) {
        console.log(`${endpoint} - Available (${response.status})`);
      } else {
        console.warn(`${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`${endpoint} - Error:`, error.message);
    }
  }
};

/**
 * Run all checks
 */
export const runDevelopmentChecks = async () => {
  if (import.meta.env.DEV) {
    console.log('Running development checks...');
    await checkBackendHealth();
    await checkApiEndpoints();
  }
};
