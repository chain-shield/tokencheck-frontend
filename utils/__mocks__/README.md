# API Service Mocks

This directory contains mock implementations of the API services in the `utils/` folder. These mocks are designed to be used in unit tests to simulate API responses without making actual network requests.

## Available Mocks

- `apiRequest.ts` - Mock for the base API request utility
- `authService.ts` - Mock for authentication-related services
- `keyService.ts` - Mock for API key management services
- `oAuthService.ts` - Mock for OAuth authentication services
- `subscriptionService.ts` - Mock for subscription plan services
- `itemService.ts` - Mock for item management services

## How to Use

### Automatic Mocking with Jest

If you're using Jest for testing, you can take advantage of its automatic mocking feature. When you import a module, Jest will automatically use the mock implementation if it exists in a `__mocks__` directory adjacent to the module.

```javascript
// In your test file
import { loginUser } from '@/utils/authService';

// Jest will automatically use the mock implementation from utils/__mocks__/authService.ts
```

### Manual Mocking

If you need more control over when mocks are used, you can manually import them:

```javascript
// In your test file
import { loginUser, mockUser, authServiceCalls } from '@/utils/__mocks__/authService';

// Now you can use the mock implementation directly
```

### Configuring Mock Responses

Each mock service includes functions to configure mock responses:

```javascript
// For apiRequest.ts
import { mockApiResponse, mockApiError, resetMocks } from '@/utils/__mocks__/apiRequest';

// Configure a successful response
mockApiResponse('/api/users', { 
  data: { id: '123', name: 'Test User' },
  status: 200
});

// Configure an error response
mockApiError('/api/users', 'User not found', 404);

// Reset all mocks after your test
resetMocks();
```

### Tracking Function Calls

Each mock service includes tracking for function calls, which you can use in your assertions:

```javascript
// For keyService.ts
import { createKey, keyServiceCalls, resetMocks } from '@/utils/__mocks__/keyService';

// Call the function
await createKey('Test Key');

// Assert that the function was called with the correct arguments
expect(keyServiceCalls.createKey).toHaveLength(1);
expect(keyServiceCalls.createKey[0]).toEqual({ name: 'Test Key' });

// Reset tracking after your test
resetMocks();
```

## Example Test

Here's an example of how to use these mocks in a Jest test:

```javascript
import { loginUser, mockUser, authServiceCalls, resetMocks } from '@/utils/__mocks__/authService';

describe('Authentication', () => {
  // Reset mocks before each test
  beforeEach(() => {
    resetMocks();
  });

  it('should login a user with valid credentials', async () => {
    // Call the function
    const user = await loginUser('test@example.com', 'password123');
    
    // Assert that the function was called with the correct arguments
    expect(authServiceCalls.loginUser).toHaveLength(1);
    expect(authServiceCalls.loginUser[0]).toEqual({ 
      email: 'test@example.com', 
      password: 'password123' 
    });
    
    // Assert that the function returned the expected result
    expect(user).toEqual(mockUser);
  });

  it('should throw an error with invalid credentials', async () => {
    // Expect the function to throw an error
    await expect(loginUser('fail@example.com', 'wrongpassword'))
      .rejects.toThrow('Authentication failed');
  });
});
```

## Best Practices

1. Always reset mocks before or after each test to ensure a clean state.
2. Configure mock responses specific to your test case.
3. Use the tracking objects to assert that functions were called with the expected arguments.
4. Remember that these mocks are simulating API responses, so they should behave similarly to the real API.

## Extending Mocks

If you need to extend these mocks for additional functionality:

1. Add new functions to the mock implementation.
2. Add tracking for the new functions in the tracking object.
3. Update the `resetMocks` function to reset the new tracking.
