const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function clean() {
	const distPath = path.resolve(__dirname, '../dist');
	if (fs.existsSync(distPath)) {
		fs.rmSync(distPath, { recursive: true });
	}
}

function build() {
	try {
		clean();
		execSync('npx tsc', { stdio: 'inherit' });
		console.log('Build successful!');
	} catch (error) {
		console.error('Build failed:', error);
		process.exit(1);
	}
}

build();
