# Advanced Git Operations

This directory contains sophisticated Git workflows, automation scripts, and specialized commands for complex development scenarios. These tools combine multiple Git operations into powerful workflows.

## 🚀 Files in this directory (13 operations):

### 🔄 Workflow Combinations
- **`gflow.js`** - Complete git flow: add → commit → push in one command
  ```bash
  gflow "implement user authentication"  # Stages all, commits, and pushes
  ```
- **`gquick.js`** - Quick commit workflow: add all → commit (no push)
  ```bash
  gquick "fix typo in header"           # Quick commit without push
  ```
- **`gsync.js`** - Sync workflow: pull → push to stay updated
  ```bash
  gsync                                 # Pull latest, then push local commits
  ```

### 🛠️ Development Workflows
- **`gdev.js`** - Development session management and smart workflows
  ```bash
  gdev                                  # Check status and sync with latest
  gdev feature-auth                     # Start new feature branch workflow
  gdev --continue                       # Resume previous work session
  gdev --sync                          # Advanced team synchronization
  ```
- **`gworkflow.js`** - Complex professional workflow combinations
  ```bash
  gworkflow feature auth-system         # Complete feature branch workflow
  gworkflow hotfix security-patch       # Emergency hotfix with backups
  gworkflow release 1.2.3              # Release preparation workflow
  gworkflow review-prep                 # Prepare branch for code review
  ```
- **`gfix.js`** - Smart fix and patch workflows
  ```bash
  gfix "correct variable name"          # Quick fix with auto-commit
  gfix --hotfix "security patch"        # Create hotfix branch workflow
  gfix --amend                         # Amend last commit safely
  gfix --typo                          # Fix typo in last commit message
  ```
- **`gfresh.js`** - Fresh start and cleanup workflows
  ```bash
  gfresh                               # Pull + reset + status (fresh start)
  gfresh --safe                        # Safe refresh with stash protection
  gfresh --branch new-feature          # Fresh start on new branch
  ```

### 🛡️ Maintenance & Safety
- **`gbackup.js`** - Comprehensive backup and safety operations
  ```bash
  gbackup                              # Smart backup (auto-choose strategy)
  gbackup --emergency                  # Complete backup: branch + tag + remote
  gbackup --branch                     # Create timestamped backup branch
  gbackup --tag                        # Create timestamped backup tag
  gbackup --list                       # List all existing backups
  gbackup --restore                    # Interactive restore from backup
  ```
- **`gclean.js`** - Repository cleanup and optimization
  ```bash
  gclean                               # Interactive repository cleanup
  gclean --branches                    # Clean merged and stale branches
  gclean --all --backup               # Complete cleanup with safety backup
  gclean --optimize                    # Repository optimization + garbage collection
  gclean --stats                       # Repository health statistics
  ```
- **`gsave.js`** - Smart save and preservation workflows
  ```bash
  gsave                                # Quick save during development
  gsave "implementing OAuth"           # Save with description
  gsave --wip                         # Save work-in-progress state
  gsave --push                        # Save and push to backup
  ```

### 📊 Analysis & Discovery
- **`glist.js`** - Advanced tool discovery and help system
  ```bash
  glist                                # Show all available tools with categories
  glist --category "Workflow"         # Show specific category tools
  glist --examples                     # Show usage examples for all tools
  glist --basic                        # Show only basic operations
  glist --advanced                     # Show only advanced operations
  ```
- **`grelease.js`** - Release management and version workflows
  ```bash
  grelease --prepare                   # Validate and prepare for release
  grelease --patch                     # Create patch version (1.0.0 → 1.0.1)
  grelease --minor                     # Create minor version (1.0.0 → 1.1.0)
  grelease --major                     # Create major version (1.0.0 → 2.0.0)
  grelease 1.2.3                      # Create specific version
  ```

### 🔧 Shared Infrastructure
- **`common.js`** - Shared utilities and helper functions
  - Error handling and validation
  - Progress tracking and logging
  - Safety checks and confirmations
  - Cross-platform compatibility utilities

## 🎯 Advanced Usage Patterns

### 🌅 Starting Development Session
```bash
gdev                                    # Check status, sync with latest
gdev feature-user-profile              # Start new feature with branch setup
gbackup --branch                       # Create safety backup before major work
```

### 💾 During Development
```bash
gsave "progress on user auth"          # Save work in progress
gfix "typo in component name"          # Quick fixes with smart commit
gworkflow review-prep                  # Prepare for code review
```

### 🚀 Releasing and Deployment
```bash
gclean --optimize                      # Clean and optimize repository
grelease --prepare                     # Validate release readiness
gbackup --emergency                    # Create comprehensive backup
grelease --minor                       # Create minor version release
```

### 🔧 Emergency Scenarios
```bash
gbackup --emergency                    # Full backup before risky operations
gfix --hotfix "critical security fix"  # Emergency hotfix workflow
gfresh --safe                         # Safe repository refresh
gbackup --restore                     # Restore from backup if needed
```

### 🧹 Repository Maintenance
```bash
gclean --stats                        # Check repository health
gclean --branches                     # Clean old/merged branches
gclean --all --backup                # Complete cleanup with backup
gbackup --list                       # Review available backups
```

## 🏆 Professional Development Features

### ✨ **Enhanced Productivity**
- Multi-step workflows in single commands
- Smart context detection and handling
- Automatic safety checks and validations
- Progress tracking and status reporting

### 🔄 **Workflow Automation**
- Feature branch creation and management
- Release preparation and version management
- Emergency hotfix procedures
- Team synchronization workflows

### 🛡️ **Safety & Recovery**
- Comprehensive backup strategies
- Emergency recovery procedures
- Safe operation modes with rollback
- Repository health monitoring

### 🚀 **Team Collaboration**
- Review preparation workflows
- Release management procedures
- Branch cleanup and maintenance
- Advanced synchronization strategies

## 📈 Progression from Basic

These advanced tools build upon the [basic operations](../basic/README.md) to create sophisticated workflows:

1. **Master basic operations first** - Understand `gadd`, `gcommit`, `gpush`, etc.
2. **Learn workflow combinations** - Start with `gflow`, `gquick`, `gsync`
3. **Explore development tools** - Use `gdev`, `gsave`, `gfix` for daily work
4. **Add safety practices** - Implement `gbackup`, `gclean` for maintenance
5. **Master professional workflows** - Use `gworkflow`, `grelease` for production

Perfect for experienced developers who want to streamline complex Git workflows and implement professional development practices.
