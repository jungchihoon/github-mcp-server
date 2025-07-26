#!/usr/bin/env node

/**
 * gsync - Sync Workflow
 * 
 * Usage:
 *   gsync
 * 
 * This combines: pull → status
 */

const { spawn } = require('child_process');
const path = require('path');

// Get the directory where this script is located
const binDir = __dirname;

console.log('🔄 Starting pull → status workflow...');
console.log('📁 Step 1/2: pull...');

// Step 1
const step1Path = path.join(binDir, '..', 'basic', 'gpull.js');
const step1Process = spawn('node', [step1Path], {
  stdio: 'inherit',
  cwd: process.cwd()
});

step1Process.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed at step 1');
    process.exit(code);
  }

  console.log('📄 Step 2/2: status...');
  
  // Step 2
  const step2Path = path.join(binDir, '..', 'basic', 'gstatus.js');
  const step2Process = spawn('node', [step2Path], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  step2Process.on('close', (code) => {
    if (code === 0) {
      console.log('✅ pull → status workflow completed!');
    } else {
      console.error('❌ Failed at step 2');
    }
    process.exit(code);
  });

  step2Process.on('error', (err) => {
    console.error('❌ Error executing step 2:', err.message);
    process.exit(1);
  });
});

step1Process.on('error', (err) => {
  console.error('❌ Error executing step 1:', err.message);
  process.exit(1);
});