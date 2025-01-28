const path = require('path');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: [path.join(__dirname, '..', 'tests')],
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: path.join(__dirname, '..', 'tsconfig.json'),
			},
		],
	},
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	coverageDirectory: path.join(__dirname, '..', 'coverage'),
	coverageReporters: ['text', 'lcov'],
	collectCoverageFrom: ['src/**/*.ts'],
};
