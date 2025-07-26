#!/usr/bin/env node

/**
 * gremote-set-url - Remote Set URL Alias
 * 
 * Usage:
 *   gremote-set-url <name> <url>
 * 
 * Change remote repository URL
 */

const { spawn } = require('child_process');
const path = require('path');

// Get command line arguments (excluding node and script name)
const args = process.argv.slice(2);

console.log('🎯 Executing: git-remote-set-url with args: " + args.join(" ") + "');

// Get the MCP CLI path
const mcpCliPath = path.join(__dirname, '..', '..', 'mcp-cli.js');

const mcpProcess = spawn('node', [mcpCliPath, 'git-remote-set-url', ...args], {
  stdio: 'inherit',
  cwd: process.cwd()
});

mcpProcess.on('close', (code) => {
  process.exit(code);
});

mcpProcess.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
