const { execSync } = require('child_process');

// Run tests with coverage
try {
	console.log('Running tests with coverage...');
	execSync('npm run test:coverage', { stdio: 'inherit' });

	// Check coverage thresholds
	const coverage = JSON.parse(
		require('fs').readFileSync('./coverage/coverage-final.json')
	);

	const threshold = 80;
	if (coverage.total.lines.pct < threshold) {
		throw new Error(`Coverage below ${threshold}%`);
	}

	console.log('All tests passed with sufficient coverage!');
} catch (error) {
	console.error('Test execution failed:', error);
	process.exit(1);
}
