#!/usr/bin/env node

/**
 * ginit - Git Initialize Alias
 * 
 * This script initializes a new Git repository in the current directory.
 * 
 * Usage:
 *   ginit
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeGitCommand(gitArgs) {
  return new Promise((resolve, reject) => {
    const gitProcess = spawn('git', gitArgs, { stdio: 'inherit' });
    gitProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Git command failed with code ${code}`));
      }
    });
    gitProcess.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const gitDir = path.join(process.cwd(), '.git');
  if (fs.existsSync(gitDir)) {
    console.log('✅ This directory is already a Git repository.');
    return;
  }

  console.log('🚀 Initializing a new Git repository...');
  try {
    await executeGitCommand(['init']);
    console.log('🎉 Successfully initialized empty Git repository.');
  } catch (error) {
    console.error(`❌ Error initializing repository: ${error.message}`);
  }
}

main();
