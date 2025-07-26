# Basic Git Operations

This directory contains essential daily Git commands that every developer uses regularly. These are the fundamental building blocks of version control workflows.

## 📁 Files in this directory (15 operations):

### 📝 Core File Operations
- **`gadd.js`** - Add files to staging area
  ```bash
  gadd                    # Add all modified files (git add .)
  gadd file1.js file2.js  # Add specific files
  ```
- **`gstatus.js`** - Check repository status and file states
  ```bash
  gstatus                 # Shows staged, modified, and untracked files
  ```

### 💾 Commit & Sync Operations
- **`gcommit.js`** - Create commits with messages
  ```bash
  gcommit "fix bug in auth"     # Commit staged changes
  gcommit "feat: add new API"   # Conventional commit format
  ```
- **`gpush.js`** - Push changes to remote repository
  ```bash
  gpush                   # Push current branch to origin
  ```
- **`gpull.js`** - Pull changes from remote repository
  ```bash
  gpull                   # Pull and merge latest changes
  ```

### 🌿 Branch Management
- **`gbranch.js`** - List and create branches
  ```bash
  gbranch                 # List all branches
  gbranch feature-auth    # Create new branch
  ```
- **`gcheckout.js`** - Switch between branches
  ```bash
  gcheckout main          # Switch to main branch
  gcheckout -b feature    # Create and switch to new branch
  ```

### 📊 History & Information
- **`glog.js`** - View commit history
  ```bash
  glog                    # Show recent commits (default: 10)
  glog 25                 # Show last 25 commits
  ```
- **`gdiff.js`** - Show differences between commits/files
  ```bash
  gdiff                   # Show unstaged changes
  gdiff main              # Compare with main branch
  gdiff HEAD~1            # Compare with previous commit
  ```

### 💼 Stash Operations
- **`gstash.js`** - Temporarily save uncommitted changes
  ```bash
  gstash                  # Stash current changes
  gstash "work in progress"  # Stash with custom message
  ```
- **`gpop.js`** - Apply most recent stash
  ```bash
  gpop                    # Apply and remove most recent stash
  ```

### 🔄 Reset Operations
- **`greset.js`** - Reset repository to previous state
  ```bash
  greset                  # Reset to HEAD (unstage files)
  greset --hard           # DANGER: Reset and discard changes
  greset HEAD~1           # Reset to previous commit
  ```

### 📂 Repository Operations
- **`ginit.js`** - Initialize a new Git repository
  ```bash
  ginit                   # Initialize current directory as Git repo
  ```
- **`gclone.js`** - Clone repositories from remote URLs
  ```bash
  gclone https://github.com/user/repo.git
  gclone git@github.com:user/repo.git my-folder
  ```

### 📡 Remote Management
- **`gremote.js`** - Comprehensive remote repository management
  ```bash
  gremote                           # List all remotes
  gremote add upstream <url>        # Add new remote
  gremote remove old-remote         # Remove remote
  gremote set-url <url>             # Set URL for origin (default)
  gremote set-url <url> upstream    # Set URL for specific remote
  ```

## 🎯 Common Usage Patterns

### Starting a New Project
```bash
mkdir my-project
cd my-project
ginit                   # Initialize Git repository
gadd                    # Stage initial files
gcommit "initial commit"
gremote add origin <url>
gpush
```

### Daily Development Workflow
```bash
gstatus                 # Check what's changed
gadd                    # Stage all changes
gcommit "implement feature X"  # Commit with message
gpush                   # Push to remote
```

### Working with Branches
```bash
gbranch feature-login   # Create feature branch
gcheckout feature-login # Switch to feature branch
# ... make changes ...
gadd && gcommit "add login form"
gpush
```

### Remote Repository Management
```bash
gremote                               # List current remotes
gremote add upstream <upstream-url>   # Add upstream for forks
gremote set-url <new-url>             # Update origin URL
```

### Checking History and Changes
```bash
glog                    # Recent commit history
gdiff                   # See what changed
gstatus                 # Current repository state
```

### Temporary Work Management
```bash
gstash "WIP: debugging auth"  # Save work temporarily
gcheckout main               # Switch to main
gpull                        # Get latest changes
gcheckout feature-login      # Back to feature
gpop                         # Restore stashed work
```

## 📚 Learning Path

1. **Start with**: `ginit`, `gstatus`, `gadd`, `gcommit`, `gpush`, `gpull`
2. **Learn branching**: `gbranch`, `gcheckout`
3. **Explore history**: `glog`, `gdiff`
4. **Master remotes**: `gremote` command with subcommands
5. **Advanced**: `gstash`, `greset`, `gclone`

These basic operations form the foundation for all Git workflows. Master these before moving to advanced operations.
