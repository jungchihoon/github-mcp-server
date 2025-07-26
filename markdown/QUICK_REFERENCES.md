# GitHub MCP Server - Quick References

The **fastest** way to Git operations through 20 MCP tools with clean aliases.

## 🎯 About

**Quick reference guide** for GitHub MCP Server - covers all aliases, npm commands, and common workflows.

## ⚡ GMS (Ultra-Short Command)

**One command to rule them all:**
```bash
gms [git-operation] [args...]
```

### **Examples:**
```bash
gms git-status
gms git-add-all
gms git-commit "Fix bug"
gms git-push
```

## 🚀 All Aliases (Copy & Paste Ready)

### **📁 File Operations**
```bash
gstatus                     # Show repository status
gadd                        # Add all files to staging
gadd file1.js file2.ts      # Add specific files only
```

### **💾 Commit & Push**
```bash
gcommit "message"           # Commit with message
gpush                       # Push to remote
gpull                       # Pull from remote
```

### **📊 Information**
```bash
glog                        # Show last 10 commits
glog 5                      # Show last 5 commits  
gdiff                       # Show working directory changes
gdiff main                  # Show diff compared to main
glist                       # 🔥 TOOL EXPLORER - Comprehensive tool discovery
```

### **🌿 Branch Management**
```bash
gbranch                     # List all branches
gbranch feature-auth        # Create new branch
gcheckout main              # Switch to main
gcheckout feature-auth      # Switch to feature-auth
```

### **📡 Remote Management**
```bash
gremote                     # List all remotes
gremote-add origin url      # Add new remote
gremote-remove backup       # Remove remote
gremote-set-url origin url  # Change remote URL
```

### **💼 Advanced Operations**
```bash
gstash                      # Stash current changes
gstash "WIP message"        # Stash with custom message
gpop                        # Apply most recent stash
greset                      # Reset to HEAD (mixed)
greset soft HEAD~1          # Soft reset to previous commit
gclone https://repo.git     # Clone repository
```

### **⚡ Workflow Shortcuts**
```bash
gflow "message"             # gadd + gcommit + gpush
gquick "message"            # gadd + gcommit (no push)
gsync                       # gpull + gstatus
```

## 🔍 GLIST - Advanced Tool Explorer

**The ultimate discovery tool** for exploring all Git operations with examples and smart categorization.

### **🚀 Enhanced glist Features:**
```bash
glist                           # Complete tool catalog with examples
glist --simple                  # Clean list without examples
glist --help                    # Advanced usage guide  
glist --category "File Operations"  # Show specific category only
```

### **📊 What glist reveals:**
- **20 Git Operations** organized by functionality
- **3 Workflow Shortcuts** for common patterns
- **Real Examples** for each command
- **Alias Mappings** showing fastest access methods
- **Pro Tips** for efficient Git workflows

### **🎯 glist Output Example:**
```
🚀 GLIST - GitHub MCP Server Tool Explorer

📊 Total Available: 20 Git operations + 3 workflow combinations

📁 File Operations
   Manage staging area and file tracking

   git-add-all       (gadd)     - Add all modified files to staging
                     Example: gadd

📁 Information & History  
   Repository status, history, and comparison tools

   git-status        (gstatus)  - Show repository status
                     Example: gstatus

⚡ Usage Methods:
   🔥 Ultra-fast:  gms git-status
   🚀 Aliases:     gstatus  
   📋 Full:        npm run mcp git-status
```

### **💡 Smart glist Usage:**
```bash
# Discovery workflow
gstatus                         # Check current state
glist                          # See all available options
glist --category "Branch Management"  # Focus on specific needs

# Learning and reference
glist | grep -i "remote"       # Find remote-related tools
glist --simple | wc -l         # Count total tools available
glist --help                   # Advanced features guide
```

## 📋 NPM Run Commands (Full Format)

### **Basic Operations**
```bash
npm run mcp git-status
npm run mcp git-add-all
npm run mcp git-add package.json README.md
npm run mcp git-commit "Your commit message"
npm run mcp git-push
npm run mcp git-pull
```

### **Branch Operations**
```bash
npm run mcp git-branch
npm run mcp git-branch feature-name
npm run mcp git-checkout main
npm run mcp git-checkout feature-name --create
```

### **Information & History**
```bash
npm run mcp git-log
npm run mcp git-log 15
npm run mcp git-diff
npm run mcp git-diff main develop
```

### **Remote Operations**
```bash
npm run mcp git-remote-list
npm run mcp git-remote-add origin https://github.com/user/repo.git
npm run mcp git-remote-remove backup
npm run mcp git-remote-set-url origin https://new-url.git
```

### **Advanced Operations**
```bash
npm run mcp git-stash
npm run mcp git-stash "Work in progress"
npm run mcp git-stash-pop
npm run mcp git-reset
npm run mcp git-reset soft HEAD~1
npm run mcp git-reset hard HEAD~2
npm run mcp git-clone https://github.com/user/repo.git
npm run mcp git-clone https://github.com/user/repo.git custom-folder
npm run mcp git-remove unwanted-file.txt
npm run mcp git-remove-all
```

## 🎮 Common Workflows (Copy & Use)

### **🚀 Quick Daily Workflow**
```bash
# Check status → Add all → Commit → Push
gstatus
gadd
gcommit "Implement user authentication"
gpush

# OR use single command:
gflow "Implement user authentication"
```

### **🌿 Feature Branch Development**
```bash
# Create and switch to feature branch
gbranch feature-login
gcheckout feature-login

# Work on feature...
gstatus
gadd
gcommit "Add login form"
gcommit "Add validation"
gcommit "Add tests"

# Push feature branch
gpush

# Switch back to main
gcheckout main
```

### **🔄 Sync with Remote**
```bash
# Pull latest and check status
gsync

# OR manually:
gpull
gstatus
```

### **💼 Emergency Stash & Switch**
```bash
# Save current work
gstash "WIP: refactoring auth module"

# Switch to main for hotfix
gcheckout main
gflow "Hotfix: critical security issue"

# Return to work
gcheckout feature-branch
gpop
```

### **📡 Remote Management Setup**
```bash
# Clone and setup remotes
gclone https://github.com/original/repo.git
cd repo
gremote-add upstream https://github.com/upstream/repo.git
gremote                     # Verify remotes
```

### **🔍 Investigation & History**
```bash
# Check what changed
gstatus
gdiff

# Check recent commits
glog 5

# Compare branches
gdiff main feature-branch

# See all available tools
glist
```

### **🧹 Cleanup & Reset**
```bash
# Remove unwanted files from staging
git-remove unwanted.txt

# Remove all from staging
git-remove-all

# Reset to previous commit (keep changes)
greset soft HEAD~1

# Hard reset (lose changes)
greset hard HEAD~1
```

## 🛠️ Installation Quick Start

```bash
# 1. Clone and setup (run in terminal)
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server
npm install
npm run build

# 2. Link globally (IMPORTANT: run this INSIDE github-mcp-server directory)
npm link

# 3. Now aliases work from ANY directory
cd ~/any-git-project
gstatus                     # ✅ Works globally
glist                       # ✅ Works globally
```

**📍 Key Point:** Run `npm link` INSIDE the `github-mcp-server` directory, then use aliases from anywhere!

**Test installation:**
```bash
gms git-status              # Test ultra-short command
glist                       # Test tool explorer
which gstatus              # Verify global installation
```

## 💡 Pro Tips

### **Speed Tips:**
- **Use `gms`** for shortest commands: `gms git-status`
- **Use workflow aliases:** `gflow` instead of gadd + gcommit + gpush
- **Use `glist`** to discover tools with examples and categories
- **Chain operations:** `gstatus && gadd && gcommit "message" && gpush`

### **Discovery Tips:**
- **Use `glist`** when unsure what tool to use
- **Use `glist --category "Remote Management"`** for specific workflows
- **Use `glist --simple`** for quick reference without examples
- **Bookmark `glist`** as your primary discovery tool

### **Safety Tips:**
- **Always `gstatus`** before major operations
- **Use `gstash`** before switching branches
- **Use `gdiff`** to review changes before commit
- **Use `glog`** to understand recent history
- **Use `glist` when exploring** new operations safely

### **Workflow Tips:**
- **Feature branches:** `gbranch feature-name` → work → `gflow`
- **Daily sync:** `gsync` at start of day
- **Emergency save:** `gstash "WIP"` + `gcheckout main`
- **Remote setup:** `gremote-add upstream url` for forks

## 🎯 VS Code Integration

Add to `.vscode/settings.json`:
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "node",
      "args": ["/path/to/github-mcp-server/dist/index.js"]
    }
  }
}
```

Use in Copilot Chat:
```
@mcp git-status
@mcp git-add-all
@mcp git-commit {"message": "Add feature"}
```

## 📊 Command Comparison

| **Task** | **Alias** | **NPM Command** | **Description** |
|----------|-----------|----------------|----------------|
| Status | `gstatus` | `npm run mcp git-status` | Show repository status |
| Add all | `gadd` | `npm run mcp git-add-all` | Add all files to staging |
| Commit | `gcommit "msg"` | `npm run mcp git-commit "msg"` | Commit with message |
| Push | `gpush` | `npm run mcp git-push` | Push to remote |
| Full workflow | `gflow "msg"` | N/A | Add + Commit + Push |
| List tools | `glist` | N/A | Show all MCP tools |

## 🔥 Most Used Commands

**Top 10 daily operations:**
1. `gstatus` - Check repository status
2. `glist` - **🔥 Explore all available tools with examples**
3. `gadd` - Add all files
4. `gcommit "message"` - Commit changes
5. `gpush` - Push to remote
6. `gflow "message"` - Complete workflow
7. `glog` - Check recent commits
8. `gdiff` - Review changes
9. `gcheckout branch` - Switch branches
10. `gpull` - Pull latest changes

---

**Ready to Git with AI? 🚀**
