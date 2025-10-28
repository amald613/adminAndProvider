const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up test environment...');

// Create .env.staging if it doesn't exist
const envStagingPath = path.join(process.cwd(), '.env.staging');
if (!fs.existsSync(envStagingPath)) {
  const envExample = `# Staging Environment - UPDATE WITH YOUR CREDENTIALS
NODE_ENV=staging
BASE_URL=https://appv2.ezyscribe.com
ADMIN_EMAIL=deepeshm@pennhealthinfo.com
ADMIN_PASSWORD=Pennhealth@0925
HEADLESS=true
SLOW_MO=0
TIMEOUT=60000
`;
  
  fs.writeFileSync(envStagingPath, envExample);
  console.log('✅ Created .env.staging file');
  console.log('📝 Please edit .env.staging with your actual credentials:');
  console.log('   - ADMIN_EMAIL: Your admin email');
  console.log('   - ADMIN_PASSWORD: Your admin password');
} else {
  console.log('✅ .env.staging already exists');
}

console.log('\n🎉 Setup complete! Now run:');
console.log('   npm install');
console.log('   npx playwright install');
console.log('   npm test');