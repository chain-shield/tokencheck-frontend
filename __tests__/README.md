# Testing in TokenCheck.ai

This directory contains tests for the TokenCheck.ai application. The tests are written using Jest and React Testing Library.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (tests will automatically re-run when files change):

```bash
npm run test:watch
```

## Test Structure

- `__tests__/examples/` - Example tests demonstrating how to use the mock implementations
- `utils/__mocks__/` - Mock implementations of API services for testing

## Mock API Services

The `utils/__mocks__/` directory contains mock implementations of all API services in the `utils/` folder. These mocks can be used in tests to simulate API responses without making actual network requests.

See the [utils/__mocks__/README.md](../utils/__mocks__/README.md) file for detailed instructions on how to use these mocks in your tests.

## Writing Tests

When writing tests:

1. Use the mock implementations to simulate API responses
2. Reset mocks before or after each test to ensure a clean state
3. Use Jest's `expect` function to make assertions
4. Follow the examples in `__tests__/examples/` for best practices

## Example Test

```javascript
import { mockApiResponse, apiRequest } from '@/utils/__mocks__/apiRequest';

describe('My Component', () => {
  beforeEach(() => {
    // Configure mock responses
    mockApiResponse('/api/data', { 
      data: { id: '123', name: 'Test' },
      status: 200
    });
  });

  it('should fetch data from the API', async () => {
    // Call the API
    const result = await apiRequest('/api/data');
    
    // Assert the result
    expect(result).toEqual({ id: '123', name: 'Test' });
  });
});
```
