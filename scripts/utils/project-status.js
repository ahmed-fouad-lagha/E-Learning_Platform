#!/usr/bin/env node

console.log('🗂️ E-Learning Platform - Project Organization Summary');
console.log('='.repeat(60));
console.log('');

const fs = require('fs');
const path = require('path');

// Function to count files in directory
function countFiles(dir) {
  try {
    return fs.readdirSync(dir).length;
  } catch (e) {
    return 0;
  }
}

// Function to check if directory exists
function dirExists(dir) {
  return fs.existsSync(dir);
}

console.log('📁 Directory Structure:');
console.log('='.repeat(30));

const directories = [
  { name: 'app/', path: './app', description: 'Next.js App Router pages' },
  { name: 'components/', path: './components', description: 'Reusable UI components' },
  { name: 'hooks/', path: './hooks', description: 'Custom React hooks' },
  { name: 'lib/', path: './lib', description: 'Utility functions & configs' },
  { name: 'prisma/', path: './prisma', description: 'Database schema & migrations' },
  { name: 'scripts/', path: './scripts', description: 'Automation & utility scripts' },
  { name: '  ├── database/', path: './scripts/database', description: 'Database scripts' },
  { name: '  ├── deployment/', path: './scripts/deployment', description: 'Deployment scripts' },
  { name: '  ├── setup/', path: './scripts/setup', description: 'Setup scripts' },
  { name: '  └── utils/', path: './scripts/utils', description: 'Utility scripts' },
  { name: 'tests/', path: './tests', description: 'Test files' },
  { name: '  ├── auth/', path: './tests/auth', description: 'Authentication tests' },
  { name: '  └── database/', path: './tests/database', description: 'Database tests' },
  { name: 'docs/', path: './docs', description: 'Documentation' },
  { name: '  ├── deployment/', path: './docs/deployment', description: 'Deployment guides' },
  { name: '  ├── features/', path: './docs/features', description: 'Feature docs' },
  { name: '  ├── setup/', path: './docs/setup', description: 'Setup guides' },
  { name: '  └── api/', path: './docs/api', description: 'API documentation' },
  { name: 'public/', path: './public', description: 'Static assets' }
];

directories.forEach(dir => {
  const exists = dirExists(dir.path);
  const fileCount = exists ? countFiles(dir.path) : 0;
  const status = exists ? '✅' : '❌';
  
  console.log(`${status} ${dir.name.padEnd(20)} (${fileCount} files) - ${dir.description}`);
});

console.log('');
console.log('📊 Organization Status:');
console.log('='.repeat(30));

const organizationTasks = [
  { task: 'Documentation organized', check: () => dirExists('./docs/deployment') && dirExists('./docs/setup') },
  { task: 'Scripts categorized', check: () => dirExists('./scripts/database') && dirExists('./scripts/setup') },
  { task: 'Tests organized', check: () => dirExists('./tests/auth') && dirExists('./tests/database') },
  { task: 'Components structured', check: () => dirExists('./components/ui') && dirExists('./components/auth') },
  { task: 'README updated', check: () => fs.existsSync('./README.md') && fs.statSync('./README.md').size > 1000 },
  { task: 'Package.json organized', check: () => {
    try {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      return pkg.scripts && pkg.scripts['setup:env'] && pkg.scripts['test:all'];
    } catch (e) {
      return false;
    }
  }}
];

organizationTasks.forEach(task => {
  const status = task.check() ? '✅' : '❌';
  console.log(`${status} ${task.task}`);
});

console.log('');
console.log('🚀 Next Steps:');
console.log('='.repeat(20));

const nextSteps = [
  '1. Test all npm scripts: npm run test:all',
  '2. Verify development workflow: npm run dev',
  '3. Check deployment readiness: npm run check:ready',
  '4. Review documentation: docs/DEVELOPMENT_WORKFLOW.md',
  '5. Commit organized structure: git add . && git commit -m "organize: project structure"'
];

nextSteps.forEach(step => console.log(step));

console.log('');
console.log('📚 Available Commands:');
console.log('='.repeat(25));

const commands = [
  'npm run dev              # Start development',
  'npm run test:all         # Run all tests',
  'npm run setup:complete   # Complete setup verification',
  'npm run db:setup         # Setup database',
  'npm run deploy:verify    # Verify deployment',
  'npm run check:ready      # Check project readiness'
];

commands.forEach(cmd => console.log(cmd));

console.log('');
console.log('✨ Project organization complete!');
console.log('📖 See docs/DEVELOPMENT_WORKFLOW.md for detailed workflows.');
console.log('='.repeat(60));
