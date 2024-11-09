import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/test/**/*.test.ts'], // Adjust this pattern based on your test file locations
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.json', // Ensure this points to your TypeScript config
		},
	},
};

export default config;
