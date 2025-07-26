#!/usr/bin/env node

/**
 * gremote - Enhanced Git Remote Alias
 * 
 * Usage:
 *   gremote               - List remote repositories
 *   gremote -h, --help    - Show help
 *   gremote --verbose     - Show detailed remote info
 * 
 * Features:
 * - Repository context validation
 * - Remote repository listing
 * - Detailed information display
 */

const { spawn } = require('child_process');
const path = require('path');
const { validateRepository, showHelp, showRepoContext } = require('../advanced/common');

// Get command line arguments
const args = process.argv.slice(2);

// Help functionality
if (args.includes('-h') || args.includes('--help')) {
  showHelp(
    'gremote',
    'Enhanced Git Remote Management',
    `  gremote               List remote repositories
  gremote --verbose     Show detailed remote info
  gremote -h, --help    Show this help`,
    [
      'gremote               # List remotes',
      'gremote --verbose     # Show detailed info'
    ]
  );
  process.exit(0);
}

// Validate repository
if (!validateRepository('remote')) {
  process.exit(1);
}

// Show detailed info if requested
if (args.includes('--verbose')) {
  showRepoContext();
  console.log('');
}

console.log('🔗 Remote repositories:');

// Execute git remote -v directly in current directory
const gitProcess = spawn('git', ['remote', '-v'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let output = '';
let errorOutput = '';

gitProcess.stdout.on('data', (data) => {
  output += data.toString();
});

gitProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

gitProcess.on('close', (code) => {
  if (code === 0) {
    if (output.trim()) {
      console.log(output.trim());
    } else {
      console.log('📭 No remote repositories configured.');
    }
    console.log('\n💡 Related commands:');
    console.log('   gremote-add "name" "url"  - Add remote');
    console.log('   gpush                     - Push to remote');
    console.log('   gpull                     - Pull from remote');
  } else {
    console.error('❌ Error:', errorOutput.trim() || 'Failed to list remotes');
  }
  process.exit(code);
});

gitProcess.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
