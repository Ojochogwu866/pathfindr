const { execSync } = require('child_process');

function publish() {
	try {
		// Run tests
		execSync('npm test', { stdio: 'inherit' });

		// Build project
		execSync('npm run build', { stdio: 'inherit' });

		// Publish to npm
		execSync('npm publish', { stdio: 'inherit' });

		console.log('Published successfully!');
	} catch (error) {
		console.error('Publish failed:', error);
		process.exit(1);
	}
}

publish();
