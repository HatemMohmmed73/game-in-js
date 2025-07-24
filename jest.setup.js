// Global test setup
console.log('Jest test environment setup complete');

// Mock any global objects or functions needed for testing
global.console = {
  ...console,
  // Override console methods if needed
  // error: jest.fn(),
  // warn: jest.fn(),
};
