/**
 * Jest Configuration for Alpha LMS Frontend
 */
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

const config: Config = {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],

    // Test patterns
    testMatch: [
        '<rootDir>/src/__tests__/**/*.test.ts',
        '<rootDir>/src/__tests__/**/*.test.tsx',
    ],

    // Module name mapper for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Coverage configuration
    collectCoverageFrom: [
        'src/lib/**/*.ts',
        'src/lib/**/*.tsx',
        '!src/lib/**/*.d.ts',
        '!src/lib/**/index.ts',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },

    // Verbose output
    verbose: true,

    // Test timeout (30 seconds for API tests)
    testTimeout: 30000,
};

export default createJestConfig(config);
