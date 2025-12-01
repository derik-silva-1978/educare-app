
import '@testing-library/jest-dom';

// This will add all the jest-dom matchers to extend the expect interface
// This includes matchers like toBeInTheDocument, toHaveAttribute, etc.

// Global mocks for Jest environment
global.afterEach = () => {};
global.beforeEach = () => {};
global.beforeAll = () => {};
global.afterAll = () => {};

// Mock window.matchMedia if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
