import '@testing-library/jest-dom';
import { mockup } from './src/tests/mockup';

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();

  document.body.innerHTML = mockup;
});

afterEach(() => {
  jest.clearAllMocks();
  // @ts-ignore
  console.error.mockRestore();
  // @ts-ignore
  console.warn.mockRestore();
});
