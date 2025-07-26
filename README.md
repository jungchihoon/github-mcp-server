# GitHub MCP Server

A **Model Context Protocol (MCP) server** that provides **29 Git operations + 11 workflow combinations** for AI assistants and developers. This server exposes comprehensive Git repository management through a standardized interface, enabling AI models and developers to safely manage complex version control workflows.

## 🎯 About

**GitHub MCP Server** bridges AI assistants with Git repositories and provides powerful developer productivity tools. It provides:
- **Safe Git operations** through a standardized MCP interface (29 operations)
- **Complete version control** capabilities including advanced operations (tag, merge, rebase, cherry-pick, blame, bisect)
- **31 workflow combinations** for enhanced developer productivity
- **Advanced developer tools** (backup, cleanup, workflow automation)
- **Error handling and validation** to prevent common Git mistakes
- **Direct integration** with VS Code and AI assistants like GitHub Copilot
- **CLI wrapper** for terminal access and automation

## 🚀 Features Overview

This server provides comprehensive Git repository management through two main categories:

### 📁 **Basic Git Operations** (17 operations)
Essential daily Git commands organized in [`bin/basic/`](bin/basic/) - see **[Basic Operations Guide](bin/basic/README.md)** for detailed documentation.

- **File Management**: Add, remove files from staging area
- **Repository Information**: Status, history, differences
- **Commit Operations**: Create commits, push, pull
- **Branch Management**: Create, switch branches
- **Remote Management**: Add, remove, configure remotes
- **Stash Operations**: Temporarily save changes
- **Reset Operations**: Repository state management

### 🚀 **Advanced Git Operations** (12 operations) 
Sophisticated workflows and automation in [`bin/advanced/`](bin/advanced/) - see **[Advanced Workflows Guide](bin/advanced/README.md)** for comprehensive documentation.

- **Workflow Combinations**: Complete flows (add→commit→push), quick commits, sync operations
- **Development Tools**: Smart development workflows, backup systems
- **Advanced Git Features**: Tags, merging, rebasing, cherry-picking, blame, bisect
- **Maintenance & Safety**: Repository cleanup, optimization, backup management
- **Professional Workflows**: Release management, hotfix procedures, team collaboration

## 🛠️ Installation

### **🐳 Easy Docker Setup (Recommended)**
```bash
# Pull and run the ready-to-use Docker image
docker pull 0xshariq/github-mcp-server:latest
docker run -it --rm 0xshariq/github-mcp-server:latest

# For detailed Docker setup and deployment options
```
📖 **See [DOCKER.md](markdown/DOCKER.md)** for complete Docker setup guide  
🚀 **See [DEPLOY.md](markdown/DEPLOY.md)** for production deployment guide

### **📦 Local Installation**

#### **Prerequisites**
- Node.js 16+ 
- Git installed and accessible in PATH

#### **Setup**
```bash
# 1. Clone the repository
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server

# 2. Install dependencies and build
npm install
npm run build

# 3. Link globally (run this INSIDE the github-mcp-server directory)
npm link
```

## 🚀 Quick Start

### Install and Setup
```bash
# Clone and install
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install

# Install globally with npm  
npm install -g .

# Or with pnpm
pnpm install -g .
```

### First Commands
```bash
# Get overview of all available tools
glist

# Check repository status
gstatus

# Quick workflow: add, commit, and push
gflow "my first commit"

# Start a development session
gdev
```

## 📋 Common Development Patterns

### **🌅 Starting Your Day**
```bash
# Check status and sync with latest changes
gdev

# Start working on a new feature
gdev feature-auth

# Continue previous work
gdev --continue
```

### **💾 During Development**
```bash
# Quick save during development
gsave

# Save with description
gsave "implementing user authentication"

# Save work-in-progress
gsave --wip

# Save and push to backup
gsave --push
```

### **🔧 Fixing Issues**
```bash
# Quick fix for small bugs
gfix "fix typo in header"

# Create hotfix branch for urgent fixes
gfix --hotfix "security patch"

# Amend the last commit
gfix --amend

# Fix typo in last commit message
gfix --typo
```

### **🚀 Releasing Code**
```bash
# Prepare for release (checks and validation)
grelease --prepare

# Create patch release
grelease --patch

# Create minor release
grelease --minor

# Create specific version
grelease 1.2.3
```

## 🖥️ Platform-Specific Integration

### **🪟 Windows Setup**

#### **Option 1: PowerShell (Recommended)**
```powershell
# Clone and setup
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link

# Test installation
gstatus
glist
```

#### **Option 2: Command Prompt**
```cmd
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link

REM Test installation
gstatus
glist
```

#### **Windows Troubleshooting**
```powershell
# If commands not found, check npm global path
npm config get prefix
# Add the returned path\node_modules\.bin to your PATH

# Alternative: Use full path
& "C:\Users\YourName\AppData\Roaming\npm\gstatus.cmd"
```

### **🍎 macOS Setup**

#### **Using Terminal**
```bash
# Install prerequisites (if needed)
# Install Node.js from nodejs.org or use Homebrew:
brew install node git

# Clone and setup
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link

# Test installation
gstatus
glist
```

#### **macOS-specific Tips**
```bash
# If permission issues
sudo npm link

# Check npm global directory
npm config get prefix
# Usually: /usr/local or /opt/homebrew

# Add to PATH in ~/.zshrc or ~/.bash_profile
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### **🐧 Linux Setup**

#### **Ubuntu/Debian**
```bash
# Install prerequisites
sudo apt update
sudo apt install nodejs npm git

# Clone and setup
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link

# Test installation
gstatus
glist
```

#### **CentOS/RHEL/Fedora**
```bash
# Install prerequisites
sudo dnf install nodejs npm git  # Fedora
# OR
sudo yum install nodejs npm git   # CentOS/RHEL

# Clone and setup (same as Ubuntu)
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link
```

#### **Arch Linux**
```bash
# Install prerequisites
sudo pacman -S nodejs npm git

# Setup (same process)
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link
```

### **🔄 WSL (Windows Subsystem for Linux)**

#### **WSL2 Setup**
```bash
# Inside WSL terminal
# Install Node.js (if not present)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone and setup
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build
npm link

# Test installation
gstatus
glist
```

#### **WSL Integration Tips**
```bash
# Access Windows files from WSL
cd /mnt/c/Users/YourName/Documents/projects
gstatus  # Works on Windows projects too!

# Add Windows PATH integration (optional)
echo 'export PATH="$PATH:/mnt/c/Windows/System32"' >> ~/.bashrc
```

## 🔗 IDE & Editor Integration

### **VS Code Integration**

#### **Local Installation**
Add to your project's `.vscode/settings.json`:
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp-server/dist/index.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

#### **Docker Integration**
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/app/workspace", "-w", "/app/workspace", "0xshariq/github-mcp-server:latest", "node", "dist/index.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

#### **Global VS Code Settings**
Add to `%APPDATA%/Code/User/settings.json` (Windows) or `~/.config/Code/User/settings.json` (Linux/macOS):
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "gms",
      "args": [],
      "env": {},
      "disabled": false
    }
  }
}
```

### **Terminal Integration**

#### **Bash/Zsh (Linux/macOS/WSL)**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
# GitHub MCP Server aliases
alias gmcp='gms'
alias ghelp='glist'
alias gworkflow='gflow'

# Quick git workflows
alias gdev='gfresh --safe && gbranch'
alias grelease='gflow "Release version $(date +%Y%m%d)"'
```

#### **PowerShell (Windows)**
Add to PowerShell profile (`$PROFILE`):
```powershell
# GitHub MCP Server aliases
Set-Alias gmcp gms
Set-Alias ghelp glist

# Quick functions
function gdev { gfresh --safe; gbranch }
function grelease { gflow "Release version $(Get-Date -Format 'yyyyMMdd')" }
```

## 🔧 Global vs Local Usage

### **Global Usage (After npm link)**
```bash
# Works from any directory on your system
cd ~/any-project
gstatus                     # ✅ Global command
gflow "Fix bug"            # ✅ Global workflow
```

### **Local Usage (Project-specific)**
```bash
# Inside the github-mcp-server directory only
cd /path/to/github-mcp-server
npm run mcp git-status     # ✅ Local command
node mcp-cli.js git-status # ✅ Direct execution
```

### **Docker Usage (Platform Independent)**
```bash
# Works anywhere Docker is installed
docker run -it --rm -v $(pwd):/app/workspace -w /app/workspace 0xshariq/github-mcp-server:latest gstatus
```

### **📍 Important: Where to run npm link**
- **✅ Run `npm link` INSIDE** the `github-mcp-server` project directory
- **❌ Do NOT run** `npm link` in other project directories
- **🎯 Purpose:** Makes all 23 aliases (`gstatus`, `gadd`, `gcommit`, etc.) available globally
- **📍 Location:** Must be executed from `/path/to/github-mcp-server/` directory

### **🔄 After npm link, you can use aliases from ANY directory:**
```bash
cd ~/my-project              # Navigate to any Git repository
gstatus                      # ✅ Works from any location
gadd                         # ✅ Works from any location  
gcommit "Fix bug"           # ✅ Works from any location
glist                       # ✅ Works from any location
```

### **🔧 Troubleshooting npm link**
```bash
# If aliases don't work, try these steps:

# 1. Check if npm link was successful
which gstatus               # Should show path to global command

# 2. If command not found, re-run npm link in correct location
cd /path/to/github-mcp-server
npm link

# 3. Check your PATH includes npm global bin directory
npm config get prefix      # Shows npm global directory
echo $PATH                 # Should include npm global bin path

# 4. Test installation
glist                      # Should show tool explorer
gms git-status            # Should show repository status
```

## ⚡ GMS (Short Command)

After installation, use the ultra-short `gms` command:

```bash
gms git-status
gms git-add-all
gms git-commit "Your message"
gms git-push
```

## 🔥 All Aliases (Built-in)

**⚠️ Prerequisites:** Run `npm link` from the `github-mcp-server` directory first (see Installation section above)

After `npm link`, these aliases work immediately from **any Git repository on your system**:

### **📁 Basic Operations**
```bash
gstatus                     # git status
gadd                        # git add all files
gadd file1.js file2.ts      # git add specific files
gcommit "message"           # git commit with message
gpush                       # git push to remote
gpull                       # git pull from remote
```

### **📊 Information & History**
```bash
glog                        # git log (last 10 commits)
glog 5                      # git log (last 5 commits)
gdiff                       # git diff (working directory)
gdiff main                  # git diff comparing with main
glist                       # 🔥 EXPLORE ALL TOOLS - Interactive tool explorer
```

### **🌿 Branch Management**
```bash
gbranch                     # List all branches
gbranch feature-auth        # Create new branch
gcheckout main              # Switch to main branch
gcheckout feature-auth      # Switch to feature branch
```

### **📡 Remote Management**
```bash
gremote                     # List all remotes
gremote-add origin url      # Add remote repository
gremote-remove backup       # Remove remote repository
gremote-set-url origin url  # Change remote URL
```

### **💼 Advanced Operations**
```bash
gstash                      # Stash current changes
gstash "Work in progress"   # Stash with message
gpop                        # Apply most recent stash
greset                      # Mixed reset to HEAD
greset soft HEAD~1          # Soft reset to previous commit
gclone https://github.com/user/repo.git  # Clone repository
```

### **⚡ Workflow Combinations**
```bash
# Core Workflows
gflow "message"             # gadd + gcommit + gpush (complete workflow)
gquick "message"            # gadd + gcommit (quick commit without push)
gsync                       # gpull + gstatus (sync and check)

# Developer Workflows (NEW!)
gdev                        # Start dev session (status + pull + branch list)
gdev feature-name           # Create new feature branch from main
gdev --continue             # Continue work (restore stash + status)
gdev --sync                 # Sync current branch with main

gsave                       # Quick save with auto timestamp
gsave "description"         # Quick save with custom message
gsave --push                # Save and push immediately
gsave --wip                 # Save as work-in-progress
gsave --backup              # Create backup commit

gfix "description"          # Quick fix commit
gfix --hotfix "message"     # Create hotfix branch and apply fix
gfix --amend                # Amend last commit with current changes
gfix --typo                 # Fix typo in last commit message

grelease 1.2.3             # Create versioned release with tag
grelease --patch            # Auto increment patch version
grelease --minor            # Auto increment minor version
grelease --major            # Auto increment major version
grelease --prepare          # Check release readiness

# Refresh Workflows
gfresh                      # gpull + greset + gstatus (fresh start)
gfresh --safe               # gpull + gstash + gpull + gstatus (safe refresh)
gfresh --hard               # gpull + hard reset + gstatus (DANGEROUS!)
gfresh --branch <name>      # Fresh start on new branch from main
```

## 🔍 GLIST - Tool Explorer & Discovery

The **`glist`** command is your **comprehensive tool discovery system**. It's an enhanced, interactive way to explore all 29 Git operations with detailed information, examples, and usage patterns.

### **🚀 What makes glist special:**
- **📊 Complete Overview** - Shows all 29 operations + 11 workflow combinations
- **📁 Organized by Categories** - File ops, branch management, remote operations, etc.
- **💡 Real Examples** - Copy-paste ready commands for each tool
- **⚡ Multiple Access Methods** - See all ways to use each operation
- **🎯 Smart Help System** - Built-in guidance and pro tips

### **🔥 GLIST Usage Examples:**

#### **📋 Basic Tool Discovery:**
```bash
glist                       # Show complete tool catalog with examples
glist --simple             # Quick list without detailed examples  
glist --help               # Show advanced usage options
glist --category "File Operations"  # Show specific category only
```

#### **📊 What glist shows you:**
```bash
🚀 GLIST - GitHub MCP Server Tool Explorer

📊 Total Available: 29 Git operations + 11 workflow combinations

📁 File Operations
   Manage staging area and file tracking

   git-add-all       (gadd)                   - Add all modified files to staging
                     Example: gadd

   git-add           (gadd file.js)           - Add specific files to staging  
                     Example: gadd package.json src/index.ts

📁 Information & History
   Repository status, history, and comparison tools

   git-status        (gstatus)                - Show repository status
                     Example: gstatus

   git-log           (glog)                   - Display commit history
                     Example: glog 5

⚡ Usage Methods:
   🔥 Ultra-fast:  gms git-status
   🚀 Aliases:     gstatus
   📋 Full:        npm run mcp git-status
```

### **🎯 When to use glist:**
- **🆕 Getting Started** - Learn what operations are available
- **🤔 Forgot a Command** - Quick reference for syntax and examples
- **📚 Learning Git** - See organized breakdown of Git workflows
- **🔍 Discovery** - Find the right tool for your current task
- **💡 Optimization** - Learn about workflow shortcuts like `gflow`

### **💎 Pro glist Tips:**
```bash
# Quick reference while working
gstatus && glist            # Check status, then see available options

# Learn category-specific operations  
glist --category "Remote Management"     # Focus on remote operations
glist --category "Workflow Shortcuts"   # Learn powerful combinations

# Integration with other tools
glist | grep -i "commit"    # Find all commit-related operations
glist --simple | wc -l      # Count total available tools
```

## 📋 NPM Run MCP Usage

Use `npm run mcp` command for all operations:

### **File Operations**
```bash
npm run mcp git-status
npm run mcp git-add-all
npm run mcp git-add package.json README.md
npm run mcp git-remove unwanted-file.txt
npm run mcp git-remove-all
```

### **Commit & Sync**
```bash
npm run mcp git-commit "Fix authentication bug"
npm run mcp git-push
npm run mcp git-pull
```

### **Branch Management**
```bash
npm run mcp git-branch
npm run mcp git-branch feature-auth
npm run mcp git-checkout main
npm run mcp git-checkout feature-auth --create
```

### **Information & History**
```bash
npm run mcp git-log
npm run mcp git-log 5
npm run mcp git-diff
npm run mcp git-diff main
```

### **Remote Management**
```bash
npm run mcp git-remote-list
npm run mcp git-remote-add origin https://github.com/user/repo.git
npm run mcp git-remote-remove backup
npm run mcp git-remote-set-url origin https://github.com/newuser/repo.git
```

### **Advanced Operations**
```bash
npm run mcp git-stash
npm run mcp git-stash "Work in progress"
npm run mcp git-stash-pop
npm run mcp git-reset
npm run mcp git-reset soft HEAD~1
npm run mcp git-clone https://github.com/user/repo.git
npm run mcp git-clone https://github.com/user/repo.git my-project
```

## 🔧 VS Code Integration

Add to your project's `.vscode/settings.json`:
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp-server/dist/index.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

Then use in Copilot Chat:
```
@mcp git-status
@mcp git-add-all
@mcp git-commit {"message": "Add new feature"}
@mcp git-push
```

## 🎮 Common Workflows

### **⚡ Quick Commit & Push**
```bash
# Using aliases (fastest)
gstatus
gadd
gcommit "Fix authentication bug"
gpush

# Or use the workflow alias
gflow "Fix authentication bug"
```

### **👨‍💻 Daily Developer Workflows (NEW!)**

#### **Starting Your Day**
```bash
gdev                        # Check status, pull latest, show branches
# Or create new feature
gdev feature-login          # Create and switch to new feature branch
```

#### **During Development**
```bash
gsave                       # Quick save with timestamp
gsave "Add login form"      # Save with description
gsave --wip                 # Save work-in-progress
```

#### **Quick Fixes**
```bash
gfix "Fix typo in header"   # Quick fix commit
gfix --amend                # Add to last commit
gfix --hotfix "Fix crash"   # Emergency hotfix branch
```

#### **End of Day**
```bash
gsave --push                # Save and push work
# Or if ready for review
gflow "Complete login feature"
```

### **🚀 Release Workflows (NEW!)**
```bash
grelease --prepare          # Check if ready for release
grelease --patch            # Create patch release (1.0.0 -> 1.0.1)
grelease 2.0.0             # Create specific version release
```

### **🔄 Branch Management**
```bash
gdev feature-auth           # Create new feature branch
gdev --sync                 # Sync current branch with main
gfresh --branch hotfix      # Fresh hotfix branch from main
```

### **Feature Branch Development**
```bash
gbranch feature-auth        # Create new branch
gcheckout feature-auth      # Switch to branch
# ... make changes ...
gadd
gcommit "Add authentication feature"
gpush
gcheckout main              # Switch back to main
```

### **Emergency Stash & Fix**
```bash
gstash "Work in progress"   # Save current work
gcheckout main              # Switch to main
# ... fix urgent issue ...
gflow "Hotfix: urgent bug"  # Add, commit, push
gcheckout feature-branch    # Return to work
gpop                        # Restore stashed work
```

## 🏗️ Project Structure & Architecture

**GitHub MCP Server** is organized for clarity and progressive learning:

```
github-mcp-server/
├── src/
│   ├── index.ts              # MCP server (29 tool registrations, schema definitions)
│   └── github.ts             # Git operations engine (all 29 implementations)
├── bin/
│   ├── basic/                # 📁 17 Essential Git Operations
│   │   ├── README.md         # Comprehensive basic operations guide
│   │   ├── gadd.js           # Add files (git add)
│   │   ├── gcommit.js        # Create commits (git commit)
│   │   ├── gpush.js          # Push changes (git push)
│   │   ├── gpull.js          # Pull changes (git pull)
│   │   ├── gstatus.js        # Repository status (git status)
│   │   ├── gbranch.js        # Branch management (git branch)
│   │   ├── gcheckout.js      # Branch switching (git checkout)
│   │   ├── glog.js           # Commit history (git log)
│   │   ├── gdiff.js          # Show differences (git diff)
│   │   ├── gstash.js         # Stash operations (git stash)
│   │   ├── gpop.js           # Apply stash (git stash pop)
│   │   ├── greset.js         # Reset operations (git reset)
│   │   ├── gclone.js         # Clone repositories (git clone)
│   │   ├── gremote.js        # List remotes (git remote)
│   │   ├── gremote-add.js    # Add remote (git remote add)
│   │   ├── gremote-remove.js # Remove remote (git remote remove)
│   │   └── gremote-set-url.js # Update remote URL (git remote set-url)
│   └── advanced/             # 🚀 13 Advanced Workflows & Automation
│       ├── README.md         # Comprehensive advanced workflows guide
│       ├── gflow.js          # Complete workflow (add→commit→push)
│       ├── gquick.js         # Quick commit workflow
│       ├── gsync.js          # Sync workflow (pull→push)
│       ├── gdev.js           # Development session management
│       ├── gworkflow.js      # Professional workflow combinations
│       ├── gfix.js           # Smart fix and patch workflows
│       ├── gfresh.js         # Fresh start workflows
│       ├── gbackup.js        # Backup and safety operations
│       ├── gclean.js         # Repository cleanup and optimization
│       ├── gsave.js          # Save and preserve workflows
│       ├── glist.js          # Tool discovery and help system
│       ├── grelease.js       # Release management workflows
│       └── common.js         # Shared utilities and helpers
├── mcp-cli.js               # Enhanced CLI wrapper (organized by structure)
├── package.json             # Project configuration & npm scripts
├── tsconfig.json            # TypeScript configuration
├── README.md                # This comprehensive guide
├── QUICK_REFERENCES.md      # Copy-paste command reference
├── DOCKER.md                # Docker setup and deployment guide
└── DEPLOY.md                # Production deployment guide
```

### 📖 **Documentation Structure**

- **[bin/basic/README.md](bin/basic/README.md)** - Complete guide to 17 essential Git operations
- **[bin/advanced/README.md](bin/advanced/README.md)** - Comprehensive advanced workflows documentation  
- **[QUICK_REFERENCES.md](QUICK_REFERENCES.md)** - Copy-paste commands for quick reference
- **[DOCKER.md](DOCKER.md)** - Docker setup, deployment, and containerization
- **[DEPLOY.md](DEPLOY.md)** - Production deployment and hosting strategies

### 🔧 **Technical Architecture**

#### **📡 MCP Server Core (src/index.ts)**
- **29 Tool Registrations** with complete JSON schemas
- **Enhanced Metadata** with operation tracking and performance monitoring
- **Input Validation** using Zod schemas for type safety
- **Error Handling Pipeline** with timeout protection and meaningful messages
- **Cross-platform Compatibility** with environment normalization

#### **⚙️ Git Operations Engine (src/github.ts)**
- **Comprehensive Implementation** of all 29 Git operations
- **Security Features** - Command injection prevention and input sanitization
- **Enhanced Error Handling** with context-aware messaging for common scenarios
- **Performance Monitoring** - Operation duration tracking and logging
- **Safety Checks** - Repository validation and file existence verification

#### **🖥️ Enhanced CLI System**
- **Smart Organization** - Tools categorized by basic vs advanced operations
- **Directory-Aware Help** - References to specific README files for detailed guidance
- **Progressive Learning** - Clear path from basic to advanced operations
- **Tool Discovery** - Enhanced `glist` command with category filtering

## 🛡️ Error Handling & Safety

- **🔍 Repository Validation**: Ensures directory is a valid Git repository
- **📁 File Existence Checks**: Validates files exist before Git operations
- **⏱️ Timeout Protection**: 30-second timeout for operations
- **🚫 Input Sanitization**: Prevents command injection
- **📝 Detailed Error Messages**: Clear, actionable error descriptions

## 🎯 Best Practices

### **For Daily Development:**
- **Start your day**: `gdev` to check status and sync
- **Frequent saves**: `gsave` for quick checkpoints during development  
- **Feature branches**: `gdev feature-name` for new features
- **Quick fixes**: `gfix "description"` for small bug fixes
- **End of day**: `gsave --push` or `gflow "message"` to share work

### **For Team Collaboration:**
- **Stay synced**: `gdev --sync` to keep your branch updated with main
- **Clean history**: Use `gfix --amend` for small fixes to recent commits
- **Proper releases**: `grelease --patch` for version management
- **Emergency fixes**: `gfix --hotfix "message"` for urgent issues

### **For Code Quality:**
- Check status before operations: `gstatus`
- Use descriptive commit messages with `gcommit` and `gflow`
- **Use `glist` for discovery** - Explore all available tools with examples
- **Use `grelease --prepare`** to validate before releases

### **For Learning & Productivity:**
- **Use `glist --category "Workflow Shortcuts"`** to learn powerful combinations
- **Practice with `gsave --wip`** for experimental changes
- **Use `gfresh` workflows** to maintain clean working directory
- **Use `gdev --continue`** to restore and continue previous work

## 📚 Additional Resources

### **📖 Documentation**
- **[QUICK_REFERENCES.md](QUICK_REFERENCES.md)** - Copy-paste commands and workflows
- **[DOCKER.md](DOCKER.md)** - Complete Docker setup and usage guide
- **[DEPLOY.md](DEPLOY.md)** - Production deployment and hosting guide

### **🔧 Source Code**
- **[src/index.ts](src/index.ts)** - MCP server implementation
- **[src/github.ts](src/github.ts)** - Git operations implementation

## License
ISC License

## Author
Created for use with AI assistants that support the Model Context Protocol.
