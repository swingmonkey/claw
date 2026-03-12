#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Programming Language Rankings Video...\n');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', {stdio: 'inherit', cwd: __dirname});
  console.log('✅ Dependencies installed\n');

  console.log('📁 Creating output directory...');
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {recursive: true});
  }
  console.log('✅ Output directory created\n');

  console.log('🎬 Ready to render video!');
  console.log('   Run: npm run build\n');
  console.log('🔍 To preview in studio:');
  console.log('   Run: npm start\n');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
