#!/usr/bin/env node

/**
 * gquick - Quick Commit Workflow
 * 
 * Usage:
 *   gquick [commit-message]
 * 
 * This combines: add all → commit
 */

const { spawn } = require('child_process');
const path = require('path');

// Get the directory where this script is located
const binDir = __dirname;

// Get command line arguments (excluding node and script name)
const args = process.argv.slice(2);
const commitMessage = args.join(' ') || 'Auto commit';

console.log('🚀 Starting add all → commit workflow...');
console.log('📁 Step 1/2: add...');

// Step 1
const step1Path = path.join(binDir, '..', 'basic', 'gadd.js');
const step1Process = spawn('node', [step1Path, commitMessage], {
  stdio: 'inherit',
  cwd: process.cwd()
});

step1Process.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed at step 1');
    process.exit(code);
  }

  console.log('📄 Step 2/2: commit...');
  
  // Step 2
  const step2Path = path.join(binDir, '..', 'basic', 'gcommit.js');
  const step2Process = spawn('node', [step2Path], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  step2Process.on('close', (code) => {
    if (code === 0) {
      console.log('✅ add all → commit workflow completed!');
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