// Mock axios for all tests because it uses ESM imports
jest.mock('axios', () => ({
  create: () => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn()
  }),
  get: jest.fn(),
  post: jest.fn()
}));
import '@testing-library/jest-dom';
