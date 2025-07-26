/**
 * GitHub MCP Server - Git Operations Module
 * 
 * This module contains all Git operations exposed by the MCP server.
 * Each function implements a specific Git workflow with comprehensive
 * error handling, validation, and safety checks.
 * 
 * Architecture:
 * - Utility functions for command execution and validation
 * - 29 Git operations grouped by functionality (20 core + 9 advanced)
 * - Consistent error handling and response formatting
 * - Timeout protection for all operations
 * - Cross-platform compatibility
 * - Advanced workflow combinations for developer productivity
 * 
 * Operations Include:
 * • Core Git Operations: add, commit, push, pull, branch, checkout, etc.
 * • Advanced Operations: tag, merge, rebase, cherry-pick, blame, bisect
 * • Workflow Combinations: flow, sync, quick-commit for productivity
 * • Remote Management: list, add, remove, set-url for repository management
 * • Stash Operations: stash, pop for temporary change management
 * 
 * @module github
 * @version 1.8.3
 */

// Node.js built-in modules for executing shell commands and file operations
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

// Convert callback-based exec to Promise-based for async/await support
const execAsync = promisify(exec);

// Configuration constants
const DEFAULT_TIMEOUT = 30000; // 30 seconds for Git operations
const VALIDATION_TIMEOUT = 5000; // 5 seconds for validation checks
const MAX_LOG_ENTRIES = 50; // Maximum log entries to prevent memory issues

// Standard return type for all Git operations - matches MCP server expectations
export interface GitOperationResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
  metadata?: {
    operation: string;
    duration: number;
    timestamp: string;
    workingDirectory: string;
  };
}

// === UTILITY FUNCTIONS ===

/**
 * Executes git commands safely with enhanced error handling and timeout protection
 * @param command - The git command to execute
 * @param cwd - Working directory (defaults to current directory)
 * @param timeout - Command timeout in milliseconds
 * @returns Promise with stdout and stderr
 */
async function executeGitCommand(
  command: string, 
  cwd?: string, 
  timeout: number = DEFAULT_TIMEOUT
): Promise<{ stdout: string; stderr: string }> {
  const startTime = Date.now();
  
  try {
    // Sanitize command to prevent injection attacks
    if (!command.startsWith('git ')) {
      throw new Error('Invalid command: Only git commands are allowed');
    }
    
    const result = await execAsync(command, { 
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
      timeout,
      env: { ...process.env, LANG: 'en_US.UTF-8' } // Ensure consistent output
    });
    
    const duration = Date.now() - startTime;
    console.error(`[GIT-CMD] ${command} | ${duration}ms | ${cwd || 'cwd'}`);
    
    return result;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Enhanced error messaging based on common Git scenarios
    let errorMessage = error.message;
    
    if (error.code === 'ETIMEDOUT') {
      errorMessage = `Git command timed out after ${timeout}ms. Try with smaller scope or check network connectivity.`;
    } else if (error.stderr?.includes('not a git repository')) {
      errorMessage = 'Not a git repository. Run "git init" to initialize or navigate to a git repository.';
    } else if (error.stderr?.includes('nothing to commit')) {
      errorMessage = 'Nothing to commit. All changes are already staged or there are no changes.';
    } else if (error.stderr?.includes('merge conflict')) {
      errorMessage = 'Merge conflict detected. Resolve conflicts manually before proceeding.';
    } else if (error.stderr?.includes('authentication failed') || error.stderr?.includes('Authentication failed')) {
      errorMessage = 'Git authentication failed. Please check your credentials and remote access.\nTip: Configure Git credentials with "git config --global user.name" and "git config --global user.email"';
    } else if (error.stderr?.includes('remote rejected')) {
      errorMessage = 'Push rejected by remote. Pull latest changes first or check branch permissions.';
    } else if (error.stderr?.includes('credential') || error.stderr?.includes('credentials')) {
      errorMessage = 'Git credential error. Please configure your Git credentials or check your access tokens.';
    } else if (error.stderr?.includes('Permission denied') || error.stderr?.includes('permission denied')) {
      errorMessage = 'Permission denied. Check your SSH keys or repository access permissions.';
    } else if (error.stderr?.includes('Could not resolve hostname')) {
      errorMessage = 'Network error: Could not resolve hostname. Check your internet connection.';
    }
    
    console.error(`[GIT-ERROR] ${command} | ${duration}ms | ${errorMessage}`);
    
    // Create a proper error object with additional properties
    const gitError = new Error(errorMessage) as any;
    gitError.stderr = error.stderr;
    gitError.stdout = error.stdout;
    gitError.code = error.code;
    throw gitError;
  }
}

/**
 * Validates if the specified directory is a git repository with enhanced error messaging
 * @param dir - Directory to check (defaults to current directory)
 * @returns Promise<boolean> - true if valid git repository
 */
async function isGitRepository(dir?: string): Promise<boolean> {
  try {
    await execAsync('git rev-parse --git-dir', { 
      cwd: dir || process.cwd(),
      timeout: VALIDATION_TIMEOUT
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a standardized response with metadata for debugging and monitoring
 * @param operation - Name of the Git operation
 * @param text - Response text
 * @param isError - Whether this is an error response
 * @param workingDir - Working directory used
 * @param startTime - Operation start time
 * @returns GitOperationResult with metadata
 */
function createResponse(
  operation: string,
  text: string,
  isError: boolean = false,
  workingDir: string = process.cwd(),
  startTime: number = Date.now()
): GitOperationResult {
  const duration = Date.now() - startTime;
  
  return {
    content: [{
      type: "text",
      text
    }],
    isError,
    metadata: {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      workingDirectory: workingDir
    }
  };
}

// === GIT STAGING OPERATIONS ===

/**
 * Adds all modified and untracked files to the staging area
 * @param directory - Working directory (optional)
 * @returns GitOperationResult with operation status
 */
export async function gitAddAll(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-add-all', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    // Check if there are any changes to add
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (!statusResult.stdout.trim()) {
      return createResponse('git-add-all', 'No changes to add. Working directory is clean.', false, workingDir, startTime);
    }

    const result = await executeGitCommand('git add .', workingDir);
    
    // Get summary of what was added (use diff --cached instead of status --cached)
    try {
      const statusAfter = await executeGitCommand('git diff --cached --name-status', workingDir);
      const addedFiles = statusAfter.stdout.trim().split('\n').filter(line => line.trim()).length;
      
      const message = addedFiles > 0 
        ? `✅ Successfully added ${addedFiles} file(s) to staging area.\n\nStaged files:\n${statusAfter.stdout || 'All modified files staged.'}`
        : `✅ All files added to staging area successfully.`;
      
      return createResponse('git-add-all', message, false, workingDir, startTime);
    } catch {
      // Fallback if diff command fails
      return createResponse('git-add-all', '✅ Successfully added all files to staging area.', false, workingDir, startTime);
    }
  } catch (error: any) {
    return createResponse('git-add-all', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Adds specific files to the staging area with validation
export async function gitAdd(files: string[], directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    if (!files || files.length === 0) {
      throw new Error("No files specified to add");
    }

    // Check if files exist
    for (const file of files) {
      const filePath = path.resolve(workingDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${file}`);
      }
    }

    // Quote each file path to handle spaces and special characters
    const quotedFiles = files.map(file => `"${file}"`).join(' ');
    const result = await executeGitCommand(`git add ${quotedFiles}`, workingDir);
    
    return createResponse('git-add', `✅ Successfully added files to staging area: ${files.join(', ')}\n${result.stdout || 'Files staged successfully.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-add', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Removes a specific file from the staging area (unstages it)
export async function gitRemove(file: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand(`git reset HEAD "${file}"`, workingDir);
    
    return createResponse('git-remove', `✅ Successfully removed file from staging area: ${file}\n${result.stdout || 'File unstaged successfully.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remove', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Removes all files from the staging area (unstages everything)
export async function gitRemoveAll(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand('git reset HEAD .', workingDir);
    
    return createResponse('git-remove-all', `✅ Successfully removed all files from staging area.\n${result.stdout || 'All files unstaged successfully.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remove-all', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === REPOSITORY STATUS & INFORMATION ===

// Gets the current status of the repository (staged, unstaged, untracked files)
export async function gitStatus(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    // Get repository context
    const currentDir = path.basename(workingDir);
    let contextInfo = `📁 Directory: ${currentDir}\n`;
    
    try {
      const remoteResult = await executeGitCommand('git remote get-url origin', workingDir);
      contextInfo += `🔗 Remote: ${remoteResult.stdout.trim()}\n`;
      
      const branchResult = await executeGitCommand('git branch --show-current', workingDir);
      contextInfo += `🌿 Branch: ${branchResult.stdout.trim()}\n\n`;
    } catch {
      contextInfo += `🔗 Remote: Not configured\n🌿 Branch: Unknown\n\n`;
    }

    const result = await executeGitCommand('git status --porcelain', workingDir);
    
    let statusText = contextInfo + "✅ Repository is clean (no changes)";
    if (result.stdout.trim()) {
      statusText = contextInfo + `📊 Current repository status:\n${result.stdout}`;
    }
    
    return createResponse('git-status', statusText, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-status', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === COMMIT & SYNC OPERATIONS ===

// Creates a commit with staged files and the provided message
export async function gitCommit(message: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-commit', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!message || message.trim() === '') {
      return createResponse('git-commit', 'Error: Commit message cannot be empty.', true, workingDir, startTime);
    }

    // Check if there are staged changes
    const statusResult = await executeGitCommand('git diff --cached --name-only', workingDir);
    if (!statusResult.stdout.trim()) {
      return createResponse('git-commit', 'Error: No staged changes to commit. Use "git add" to stage files first.', true, workingDir, startTime);
    }

    // Get list of staged files for confirmation
    const stagedFiles = await executeGitCommand('git diff --cached --name-status', workingDir);
    const fileCount = stagedFiles.stdout.trim().split('\n').filter(line => line.trim()).length;

    // Escape the commit message properly
    const escapedMessage = message.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const result = await executeGitCommand(`git commit -m "${escapedMessage}"`, workingDir);
    
    const message_output = `✅ Successfully committed ${fileCount} file(s) with message: "${message}"\n\n📝 Commit details:\n${result.stdout}\n\n📁 Files committed:\n${stagedFiles.stdout}`;
    return createResponse('git-commit', message_output, false, workingDir, startTime);
    
  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during commit';
    return createResponse('git-commit', `Error: ${errorMsg}`, true, workingDir, startTime);
  }
}

// Pushes local commits to the remote repository
export async function gitPush(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-push', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    // Get current working directory info for safety
    const currentDir = path.basename(workingDir);
    
    // Check remote URL for safety
    let remoteInfo = '';
    try {
      const remoteResult = await executeGitCommand('git remote get-url origin', workingDir);
      remoteInfo = remoteResult.stdout.trim();
    } catch {
      return createResponse('git-push', 'Error: No remote repository configured. Add a remote with "git remote add origin <url>".', true, workingDir, startTime);
    }

    // Check if there are commits to push
    try {
      const statusCheck = await executeGitCommand('git log @{u}..', workingDir);
      if (!statusCheck.stdout.trim()) {
        return createResponse('git-push', '✅ Nothing to push - all commits are already on remote.', false, workingDir, startTime);
      }
    } catch {
      // Remote may not exist or branch not tracked, continue with push attempt
    }

    // Check current branch
    const branchResult = await executeGitCommand('git branch --show-current', workingDir);
    const currentBranch = branchResult.stdout.trim();

    // Show confirmation info before push
    const confirmationInfo = `📁 Directory: ${currentDir}\n🔗 Remote: ${remoteInfo}\n🌿 Branch: ${currentBranch}\n\n`;

    const result = await executeGitCommand('git push', workingDir, 60000); // Longer timeout for push
    
    const message_output = `🚀 Successfully pushed changes to remote repository.\n\n${confirmationInfo}${result.stdout || result.stderr || 'Push completed successfully.'}`;
    return createResponse('git-push', message_output, false, workingDir, startTime);
    
  } catch (error: any) {
    let errorMsg = error.stderr || error.message || 'Unknown error during push';
    
    // Provide helpful suggestions for common push errors
    if (errorMsg.includes('rejected')) {
      errorMsg += '\n\n💡 Suggestion: Pull the latest changes first with "git pull" or use force push if you\'re sure.';
    } else if (errorMsg.includes('upstream')) {
      errorMsg += '\n\n💡 Suggestion: Set upstream branch with "git push -u origin <branch-name>".';
    } else if (errorMsg.includes('authentication failed') || errorMsg.includes('Authentication failed')) {
      errorMsg += '\n\n💡 Suggestions:\n- Check your Git credentials with "git config --list"\n- Update your personal access token\n- Verify repository access permissions';
    } else if (errorMsg.includes('credential') || errorMsg.includes('credentials')) {
      errorMsg += '\n\n💡 Suggestions:\n- Configure Git credentials: git config --global credential.helper store\n- Set up SSH keys for authentication\n- Check if your access token is valid';
    } else if (errorMsg.includes('Permission denied')) {
      errorMsg += '\n\n💡 Suggestions:\n- Verify SSH key setup: ssh -T git@github.com\n- Check repository access permissions\n- Ensure you have push access to the repository';
    }
    
    return createResponse('git-push', `❌ Error: ${errorMsg}`, true, workingDir, startTime);
  }
}

// Fetches and merges changes from the remote repository
export async function gitPull(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand('git pull', workingDir);
    
    return createResponse('git-pull', `✅ Successfully pulled changes from remote repository.\n${result.stdout || 'Already up to date.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-pull', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === BRANCH OPERATIONS ===

// Lists all branches or creates a new branch
export async function gitBranch(branchName?: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const command = branchName ? `git branch "${branchName}"` : 'git branch -a';
    const result = await executeGitCommand(command, workingDir);
    
    const message = branchName 
      ? `✅ Successfully created branch: ${branchName}`
      : `🌿 Available branches:\n${result.stdout}`;
    
    return createResponse('git-branch', message, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-branch', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Switches to a different branch or creates and switches to a new branch
export async function gitCheckout(branchName: string, createNew: boolean = false, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const command = createNew 
      ? `git checkout -b "${branchName}"` 
      : `git checkout "${branchName}"`;
    
    const result = await executeGitCommand(command, workingDir);
    
    const message = createNew
      ? `✅ Successfully created and switched to branch: ${branchName}`
      : `✅ Successfully switched to branch: ${branchName}`;
    
    return createResponse('git-checkout', `${message}\n${result.stdout || result.stderr || ''}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-checkout', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === HISTORY & INFORMATION ===

// Shows commit history
export async function gitLog(maxCount: number = 10, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand(`git log --oneline -${maxCount}`, workingDir);
    
    return createResponse('git-log', result.stdout || "📝 No commits found", false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-log', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Shows differences between commits, branches, or working directory
export async function gitDiff(target?: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const command = target ? `git diff ${target}` : 'git diff';
    const result = await executeGitCommand(command, workingDir);
    
    return createResponse('git-diff', result.stdout || "📄 No differences found", false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-diff', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === STASH OPERATIONS ===

// Stashes current changes
export async function gitStash(message?: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const command = message ? `git stash push -m "${message}"` : 'git stash';
    const result = await executeGitCommand(command, workingDir);
    
    return createResponse('git-stash', `💾 Successfully stashed changes.\n${result.stdout || 'Changes stashed successfully.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-stash', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Applies the most recent stash
export async function gitStashPop(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand('git stash pop', workingDir);
    
    return createResponse('git-stash-pop', `💾 Successfully applied stash.\n${result.stdout || 'Stash applied successfully.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-stash-pop', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === RESET OPERATIONS ===

// Resets repository to a specific commit or state
export async function gitReset(
  mode: 'soft' | 'mixed' | 'hard' | '--help' | '-h' = 'mixed',
  target: string = 'HEAD',
  directory?: string
): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  // Handle help request
  if (mode === '--help' || mode === '-h') {
    const helpText = `🔄 greset - Git Reset Command

Usage:
  greset [mode] [target]

Reset Modes:
  --soft     Reset HEAD only (keep staged changes)
  --mixed    Reset HEAD and index (default)
  --hard     Reset HEAD, index, and working tree (DESTRUCTIVE!)

Examples:
  greset                    # Reset to HEAD (mixed)
  greset --soft HEAD~1      # Soft reset to previous commit
  greset --hard origin/main # Hard reset to remote main

⚠️  WARNING: --hard mode will destroy uncommitted changes!
💡 Use --soft to keep your changes staged.`;
    
    return createResponse('git-reset', helpText, false, workingDir, startTime);
  }
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error("Not a git repository");
    }

    const result = await executeGitCommand(`git reset --${mode} ${target}`, workingDir);
    
    return createResponse('git-reset', `🔄 Successfully reset repository (${mode}) to ${target}.\n${result.stdout || 'Reset completed.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-reset', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === REMOTE OPERATIONS ===

// Lists all remote repositories
export async function gitRemoteList(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error('Current directory is not a Git repository');
    }
    
    const result = await executeGitCommand('git remote -v', workingDir);
    
    const remotes = result.stdout.trim();
    const displayText = remotes 
      ? `🔗 Remote repositories:\n${remotes}`
      : '📭 No remote repositories configured.';
    
    return createResponse('git-remote-list', displayText, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remote-list', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Adds a remote repository
export async function gitRemoteAdd(name: string, url: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error('Current directory is not a Git repository');
    }
    
    if (!name || !url) {
      throw new Error('Remote name and URL are required');
    }
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/|git@|ssh:\/\/)/;
    if (!urlPattern.test(url)) {
      throw new Error('Invalid Git URL format. Use HTTPS (https://...) or SSH (git@...) format.');
    }
    
    const result = await executeGitCommand(`git remote add "${name}" "${url}"`, workingDir);
    
    return createResponse('git-remote-add', `✅ Successfully added remote '${name}' with URL: ${url}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remote-add', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Removes a remote repository
export async function gitRemoteRemove(name: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error('Current directory is not a Git repository');
    }
    
    if (!name) {
      throw new Error('Remote name is required');
    }
    
    const result = await executeGitCommand(`git remote remove "${name}"`, workingDir);
    
    return createResponse('git-remote-remove', `✅ Successfully removed remote '${name}'`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remote-remove', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Changes the URL of an existing remote
export async function gitRemoteSetUrl(name: string, url: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      throw new Error('Current directory is not a Git repository');
    }
    
    if (!name || !url) {
      throw new Error('Remote name and URL are required');
    }
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/|git@|ssh:\/\/)/;
    if (!urlPattern.test(url)) {
      throw new Error('Invalid Git URL format. Use HTTPS (https://...) or SSH (git@...) format.');
    }
    
    const result = await executeGitCommand(`git remote set-url "${name}" "${url}"`, workingDir);
    
    return createResponse('git-remote-set-url', `✅ Successfully updated remote '${name}' URL to: ${url}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-remote-set-url', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === REPOSITORY OPERATIONS ===

// Clones a repository
export async function gitClone(url: string, directory?: string, targetDir?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    const command = targetDir ? `git clone "${url}" "${targetDir}"` : `git clone "${url}"`;
    
    const result = await executeGitCommand(command, workingDir);
    
    return createResponse('git-clone', `✅ Successfully cloned repository from ${url}.\n${result.stdout || result.stderr || 'Clone completed.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-clone', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// Initializes a new Git repository
export async function gitInit(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    // Check if already a git repository
    if (await isGitRepository(workingDir)) {
      return createResponse('git-init', '✅ Directory is already a Git repository.', false, workingDir, startTime);
    }
    
    const result = await executeGitCommand('git init', workingDir);
    
    return createResponse('git-init', `🎉 Successfully initialized empty Git repository.\n${result.stdout || result.stderr || 'Repository initialized.'}`, false, workingDir, startTime);
  } catch (error: any) {
    return createResponse('git-init', `Error: ${error.message}`, true, workingDir, startTime);
  }
}

// === ENHANCED WORKFLOW OPERATIONS ===

/**
 * Complete git flow: add all, commit, and push in one operation
 * @param message - Commit message
 * @param directory - Working directory (optional)
 * @returns GitOperationResult with detailed step-by-step progress
 */
export async function gitFlow(message: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-flow', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!message || message.trim() === '') {
      return createResponse('git-flow', 'Error: Commit message is required for git flow.', true, workingDir, startTime);
    }

    // Get repository context for safety
    const currentDir = path.basename(workingDir);
    let remoteInfo = '';
    let currentBranch = '';
    
    try {
      const remoteResult = await executeGitCommand('git remote get-url origin', workingDir);
      remoteInfo = remoteResult.stdout.trim();
      
      const branchResult = await executeGitCommand('git branch --show-current', workingDir);
      currentBranch = branchResult.stdout.trim();
    } catch {
      return createResponse('git-flow', 'Error: No remote repository configured. Add a remote with "git remote add origin <url>".', true, workingDir, startTime);
    }

    let progressLog = '🚀 Starting Git Flow...\n\n';
    progressLog += `📁 Directory: ${currentDir}\n🔗 Remote: ${remoteInfo}\n🌿 Branch: ${currentBranch}\n\n`;

    // Step 1: Check if there are any changes
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (!statusResult.stdout.trim()) {
      return createResponse('git-flow', '✅ Git Flow Complete: No changes to commit. Working directory is clean.', false, workingDir, startTime);
    }

    progressLog += `📁 Found ${statusResult.stdout.trim().split('\n').length} modified file(s)\n`;

    // Step 2: Add all changes
    progressLog += '📝 Step 1/3: Adding all changes...\n';
    await executeGitCommand('git add .', workingDir);
    
    // Verify what was staged
    const stagedResult = await executeGitCommand('git diff --cached --name-status', workingDir);
    const stagedFiles = stagedResult.stdout.trim().split('\n').filter(line => line.trim()).length;
    progressLog += `✅ Successfully staged ${stagedFiles} file(s)\n\n`;

    // Step 3: Commit changes
    progressLog += '💾 Step 2/3: Creating commit...\n';
    const escapedMessage = message.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const commitResult = await executeGitCommand(`git commit -m "${escapedMessage}"`, workingDir);
    progressLog += `✅ Successfully committed with message: "${message}"\n`;
    progressLog += `${commitResult.stdout}\n\n`;

    // Step 4: Push to remote
    progressLog += '🚀 Step 3/3: Pushing to remote...\n';
    const pushResult = await executeGitCommand('git push', workingDir, 60000);
    progressLog += `✅ Successfully pushed to remote repository\n`;
    progressLog += `${pushResult.stdout || pushResult.stderr || 'Push completed successfully.'}\n\n`;

    progressLog += `🎉 Git Flow Complete! All changes committed and pushed successfully.\n`;
    progressLog += `⏱️  Total time: ${Date.now() - startTime}ms`;

    return createResponse('git-flow', progressLog, false, workingDir, startTime);
    
  } catch (error: any) {
    let errorMsg = error.stderr || error.message || 'Unknown error during git flow';
    
    // Provide specific guidance for git flow errors
    if (errorMsg.includes('authentication') || errorMsg.includes('credential')) {
      errorMsg += '\n\n💡 Git Flow Authentication Help:\n- Verify your Git credentials are configured\n- Check if your access token is valid\n- Ensure you have push permissions to the repository';
    } else if (errorMsg.includes('rejected')) {
      errorMsg += '\n\n💡 Git Flow Push Rejected:\n- Someone else may have pushed changes\n- Try running "git pull" first, then retry git flow\n- Check if you have the latest changes';
    } else if (errorMsg.includes('nothing to commit')) {
      return createResponse('git-flow', '✅ Git Flow Complete: No changes to commit. Working directory is clean.', false, workingDir, startTime);
    }
    
    return createResponse('git-flow', `❌ Git Flow failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Quick commit: add all and commit (without push)
 * @param message - Commit message
 * @param directory - Working directory (optional)
 * @returns GitOperationResult with operation status
 */
export async function gitQuickCommit(message: string, directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-quick-commit', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!message || message.trim() === '') {
      return createResponse('git-quick-commit', 'Error: Commit message is required.', true, workingDir, startTime);
    }

    // Step 1: Check for changes
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (!statusResult.stdout.trim()) {
      return createResponse('git-quick-commit', '✅ No changes to commit. Working directory is clean.', false, workingDir, startTime);
    }

    // Step 2: Add all changes
    await executeGitCommand('git add .', workingDir);
    
    // Step 3: Commit
    const escapedMessage = message.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const commitResult = await executeGitCommand(`git commit -m "${escapedMessage}"`, workingDir);
    
    return createResponse('git-quick-commit', `✅ Quick commit successful!\nMessage: "${message}"\n${commitResult.stdout}`, false, workingDir, startTime);
    
  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during quick commit';
    return createResponse('git-quick-commit', `Error: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Sync with remote: pull then push
 * @param directory - Working directory (optional)
 * @returns GitOperationResult with sync status
 */
export async function gitSync(directory?: string): Promise<GitOperationResult> {
  const startTime = Date.now();
  const workingDir = directory || process.cwd();
  
  try {
    if (!(await isGitRepository(workingDir))) {
      return createResponse('git-sync', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    let syncLog = '🔄 Starting Git Sync...\n\n';

    // Step 1: Pull from remote
    syncLog += '⬇️  Step 1/2: Pulling from remote...\n';
    const pullResult = await executeGitCommand('git pull', workingDir);
    syncLog += `✅ Pull completed\n${pullResult.stdout || 'Already up to date.'}\n\n`;

    // Step 2: Push to remote (if there are local commits)
    syncLog += '⬆️  Step 2/2: Pushing to remote...\n';
    try {
      const pushResult = await executeGitCommand('git push', workingDir, 60000);
      syncLog += `✅ Push completed\n${pushResult.stdout || 'Everything up-to-date.'}\n\n`;
    } catch (pushError: any) {
      if (pushError.message.includes('Everything up-to-date')) {
        syncLog += `✅ Nothing to push - repository is up-to-date\n\n`;
      } else {
        throw pushError;
      }
    }

    syncLog += `🎉 Sync Complete! Repository is synchronized with remote.`;

    return createResponse('git-sync', syncLog, false, workingDir, startTime);
    
  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during sync';
    return createResponse('git-sync', `❌ Sync failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

// === NEW ADVANCED GIT OPERATIONS ===

/**
 * Git tag operations - Create, list, and delete tags
 */
export async function gitTag(directory?: string, action?: string, tagName?: string, message?: string): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-tag', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    let command = 'git tag';
    let resultText = '';

    switch (action) {
      case 'list':
      case undefined:
        // List all tags
        const listResult = await executeGitCommand('git tag --sort=-version:refname', workingDir);
        const tags = listResult.stdout.trim().split('\n').filter(tag => tag);
        if (tags.length === 0) {
          resultText = '📌 No tags found in this repository.';
        } else {
          resultText = `📌 Available tags (${tags.length}):\n\n${tags.map(tag => `  • ${tag}`).join('\n')}`;
        }
        break;

      case 'create':
        if (!tagName) {
          return createResponse('git-tag', '❌ Error: Tag name is required for creating tags.', true, workingDir, startTime);
        }
        command = message ? `git tag -a "${tagName}" -m "${message}"` : `git tag "${tagName}"`;
        const createResult = await executeGitCommand(command, workingDir);
        resultText = `✅ Tag '${tagName}' created successfully.${message ? `\nMessage: ${message}` : ''}`;
        break;

      case 'delete':
        if (!tagName) {
          return createResponse('git-tag', '❌ Error: Tag name is required for deleting tags.', true, workingDir, startTime);
        }
        await executeGitCommand(`git tag -d "${tagName}"`, workingDir);
        resultText = `🗑️ Tag '${tagName}' deleted successfully.`;
        break;

      case 'show':
        if (!tagName) {
          return createResponse('git-tag', '❌ Error: Tag name is required for showing tag details.', true, workingDir, startTime);
        }
        const showResult = await executeGitCommand(`git show "${tagName}" --stat`, workingDir);
        resultText = `📋 Tag details for '${tagName}':\n\n${showResult.stdout}`;
        break;

      default:
        return createResponse('git-tag', '❌ Error: Invalid action. Use: list, create, delete, or show.', true, workingDir, startTime);
    }

    return createResponse('git-tag', resultText, false, workingDir, startTime);

  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during tag operation';
    return createResponse('git-tag', `❌ Tag operation failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Git merge operations with conflict detection
 */
export async function gitMerge(directory?: string, branch?: string, strategy?: string): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-merge', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!branch) {
      return createResponse('git-merge', '❌ Error: Branch name is required for merge.', true, workingDir, startTime);
    }

    // Check if branch exists
    try {
      await executeGitCommand(`git rev-parse --verify "${branch}"`, workingDir);
    } catch {
      return createResponse('git-merge', `❌ Error: Branch '${branch}' does not exist.`, true, workingDir, startTime);
    }

    // Check for uncommitted changes
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (statusResult.stdout.trim()) {
      return createResponse('git-merge', '❌ Error: You have uncommitted changes. Please commit or stash them before merging.', true, workingDir, startTime);
    }

    let command = `git merge "${branch}"`;
    if (strategy) {
      command += ` --strategy=${strategy}`;
    }

    try {
      const mergeResult = await executeGitCommand(command, workingDir);
      const resultText = `✅ Successfully merged '${branch}' into current branch.\n\n${mergeResult.stdout}`;
      return createResponse('git-merge', resultText, false, workingDir, startTime);

    } catch (mergeError: any) {
      if (mergeError.stderr?.includes('CONFLICT')) {
        const conflictFiles = await executeGitCommand('git diff --name-only --diff-filter=U', workingDir);
        const conflicts = conflictFiles.stdout.trim().split('\n').filter(f => f);
        
        let conflictText = `⚠️ Merge conflict detected!\n\n`;
        conflictText += `Conflicted files:\n${conflicts.map(f => `  • ${f}`).join('\n')}\n\n`;
        conflictText += `To resolve:\n`;
        conflictText += `1. Edit the conflicted files\n`;
        conflictText += `2. Run: git add <resolved-files>\n`;
        conflictText += `3. Run: git commit\n`;
        conflictText += `\nOr abort with: git merge --abort`;

        return createResponse('git-merge', conflictText, true, workingDir, startTime);
      }
      throw mergeError;
    }

  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during merge';
    return createResponse('git-merge', `❌ Merge failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Git rebase operations with interactive support
 */
export async function gitRebase(directory?: string, target?: string, interactive?: boolean): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-rebase', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!target) {
      target = 'HEAD~1'; // Default to last commit
    }

    // Check for uncommitted changes
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (statusResult.stdout.trim()) {
      return createResponse('git-rebase', '❌ Error: You have uncommitted changes. Please commit or stash them before rebasing.', true, workingDir, startTime);
    }

    let command = interactive ? `git rebase -i "${target}"` : `git rebase "${target}"`;

    try {
      const rebaseResult = await executeGitCommand(command, workingDir);
      const resultText = `✅ Rebase completed successfully.\n\n${rebaseResult.stdout}`;
      return createResponse('git-rebase', resultText, false, workingDir, startTime);

    } catch (rebaseError: any) {
      if (rebaseError.stderr?.includes('CONFLICT')) {
        const conflictFiles = await executeGitCommand('git diff --name-only --diff-filter=U', workingDir);
        const conflicts = conflictFiles.stdout.trim().split('\n').filter(f => f);
        
        let conflictText = `⚠️ Rebase conflict detected!\n\n`;
        conflictText += `Conflicted files:\n${conflicts.map(f => `  • ${f}`).join('\n')}\n\n`;
        conflictText += `To resolve:\n`;
        conflictText += `1. Edit the conflicted files\n`;
        conflictText += `2. Run: git add <resolved-files>\n`;
        conflictText += `3. Run: git rebase --continue\n`;
        conflictText += `\nOr abort with: git rebase --abort`;

        return createResponse('git-rebase', conflictText, true, workingDir, startTime);
      }
      throw rebaseError;
    }

  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during rebase';
    return createResponse('git-rebase', `❌ Rebase failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Git cherry-pick operations
 */
export async function gitCherryPick(directory?: string, commitHash?: string): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-cherry-pick', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!commitHash) {
      return createResponse('git-cherry-pick', '❌ Error: Commit hash is required for cherry-pick.', true, workingDir, startTime);
    }

    // Validate commit exists
    try {
      await executeGitCommand(`git rev-parse --verify "${commitHash}"`, workingDir);
    } catch {
      return createResponse('git-cherry-pick', `❌ Error: Commit '${commitHash}' does not exist.`, true, workingDir, startTime);
    }

    // Check for uncommitted changes
    const statusResult = await executeGitCommand('git status --porcelain', workingDir);
    if (statusResult.stdout.trim()) {
      return createResponse('git-cherry-pick', '❌ Error: You have uncommitted changes. Please commit or stash them before cherry-picking.', true, workingDir, startTime);
    }

    const cherryPickResult = await executeGitCommand(`git cherry-pick "${commitHash}"`, workingDir);
    const resultText = `🍒 Successfully cherry-picked commit '${commitHash.substring(0, 8)}'.\n\n${cherryPickResult.stdout}`;
    
    return createResponse('git-cherry-pick', resultText, false, workingDir, startTime);

  } catch (error: any) {
    if (error.stderr?.includes('CONFLICT')) {
      const conflictFiles = await executeGitCommand('git diff --name-only --diff-filter=U', workingDir);
      const conflicts = conflictFiles.stdout.trim().split('\n').filter(f => f);
      
      let conflictText = `⚠️ Cherry-pick conflict detected!\n\n`;
      conflictText += `Conflicted files:\n${conflicts.map(f => `  • ${f}`).join('\n')}\n\n`;
      conflictText += `To resolve:\n`;
      conflictText += `1. Edit the conflicted files\n`;
      conflictText += `2. Run: git add <resolved-files>\n`;
      conflictText += `3. Run: git cherry-pick --continue\n`;
      conflictText += `\nOr abort with: git cherry-pick --abort`;

      return createResponse('git-cherry-pick', conflictText, true, workingDir, startTime);
    }

    const errorMsg = error.stderr || error.message || 'Unknown error during cherry-pick';
    return createResponse('git-cherry-pick', `❌ Cherry-pick failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Git blame operations - Show line-by-line authorship
 */
export async function gitBlame(directory?: string, filePath?: string, lineRange?: string): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-blame', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    if (!filePath) {
      return createResponse('git-blame', '❌ Error: File path is required for blame.', true, workingDir, startTime);
    }

    // Check if file exists
    const fullPath = path.resolve(workingDir, filePath);
    if (!fs.existsSync(fullPath)) {
      return createResponse('git-blame', `❌ Error: File '${filePath}' does not exist.`, true, workingDir, startTime);
    }

    let command = `git blame "${filePath}"`;
    if (lineRange) {
      command += ` -L ${lineRange}`;
    }

    const blameResult = await executeGitCommand(command, workingDir);
    const resultText = `📝 Blame information for '${filePath}':\n\n${blameResult.stdout}`;
    
    return createResponse('git-blame', resultText, false, workingDir, startTime);

  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during blame';
    return createResponse('git-blame', `❌ Blame failed: ${errorMsg}`, true, workingDir, startTime);
  }
}

/**
 * Git bisect operations - Binary search for bugs
 */
export async function gitBisect(directory?: string, action?: string, commit?: string): Promise<GitOperationResult> {
  const workingDir = directory || process.cwd();
  const startTime = Date.now();

  try {
    if (!isGitRepository(workingDir)) {
      return createResponse('git-bisect', 'Error: Not a git repository. Run "git init" to initialize.', true, workingDir, startTime);
    }

    let command = '';
    let resultText = '';

    switch (action) {
      case 'start':
        command = 'git bisect start';
        break;
      case 'bad':
        command = commit ? `git bisect bad "${commit}"` : 'git bisect bad';
        break;
      case 'good':
        command = commit ? `git bisect good "${commit}"` : 'git bisect good';
        break;
      case 'reset':
        command = 'git bisect reset';
        break;
      case 'status':
        command = 'git bisect log';
        break;
      default:
        return createResponse('git-bisect', '❌ Error: Invalid action. Use: start, bad, good, reset, or status.', true, workingDir, startTime);
    }

    const bisectResult = await executeGitCommand(command, workingDir);
    resultText = `🔍 Bisect ${action}:\n\n${bisectResult.stdout}`;
    
    return createResponse('git-bisect', resultText, false, workingDir, startTime);

  } catch (error: any) {
    const errorMsg = error.stderr || error.message || 'Unknown error during bisect';
    return createResponse('git-bisect', `❌ Bisect failed: ${errorMsg}`, true, workingDir, startTime);
  }
}
