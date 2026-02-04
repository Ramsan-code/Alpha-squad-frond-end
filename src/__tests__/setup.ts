/**
 * Jest Setup File
 * Configures the test environment before each test file
 */

import '@testing-library/jest-dom';

// Storage mock interface
interface StorageMock {
    store: Record<string, string>;
    getItem: jest.Mock<string | null, [string]>;
    setItem: jest.Mock<void, [string, string]>;
    removeItem: jest.Mock<void, [string]>;
    clear: jest.Mock<void, []>;
}

// Mock window.matchMedia (required for some UI components)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock localStorage
const localStorageMock: StorageMock = {
    store: {} as Record<string, string>,
    getItem: jest.fn((key: string): string | null => localStorageMock.store[key] || null),
    setItem: jest.fn((key: string, value: string): void => {
        localStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
        delete localStorageMock.store[key];
    }),
    clear: jest.fn((): void => {
        localStorageMock.store = {};
    }),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock: StorageMock = {
    store: {} as Record<string, string>,
    getItem: jest.fn((key: string): string | null => sessionStorageMock.store[key] || null),
    setItem: jest.fn((key: string, value: string): void => {
        sessionStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
        delete sessionStorageMock.store[key];
    }),
    clear: jest.fn((): void => {
        sessionStorageMock.store = {};
    }),
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.store = {};
    sessionStorageMock.store = {};
});

// Global test timeout for API calls
jest.setTimeout(30000);
