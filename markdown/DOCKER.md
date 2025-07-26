# 🐳 Docker Setup Guide

The easiest way to use GitHub MCP Server is with Docker! No need to install Node.js or worry about dependencies.

## 🚀 Quick Start (1 minute setup)

### Option 1: Use Ready-Made Image (Easiest)
```bash
# Pull the image from Docker Hub
docker pull 0xshariq/github-mcp-server:latest

# Run it immediately
docker run -it --rm 0xshariq/github-mcp-server:latest

# You're ready to go! Try these commands:
node mcp-cli.js list
```

### Option 2: Run with Your Projects
```bash
# Run with access to your local git repositories
docker run -it --rm \
  -v $(pwd):/app/workspace \
  0xshariq/github-mcp-server:latest

# Now you can work with git repos in your current directory
```

## 🎯 What You Get

### ✅ Pre-installed & Ready
- ✅ Node.js 20 Alpine Linux
- ✅ Git & SSH tools
- ✅ All 20+ Git aliases (`gstatus`, `gadd`, `gcommit`, etc.)
- ✅ MCP server ready to use
- ✅ Security hardened (non-root user)

### 🔧 Available Commands Inside Container
```bash
# MCP commands
node mcp-cli.js list              # See all available tools
node mcp-cli.js git-status        # Check git status
node mcp-cli.js git-add-all       # Add all files

# Direct aliases (faster)
gstatus                          # Git status
gadd                             # Add all files  
gcommit "Your message"           # Commit with message
gpush                            # Push to remote
gflow "Complete workflow"        # Add + commit + push
```

## 📁 Working with Your Files

### Mount Your Project Directory
```bash
# Work with files in your current directory
docker run -it --rm \
  -v $(pwd):/app/workspace \
  -w /app/workspace \
  0xshariq/github-mcp-server:latest

# Now git commands work on your local files
cd /app/workspace
gstatus                          # Shows your local git status
```

### Mount Your Git Config (Optional)
```bash
# Use your personal git settings
docker run -it --rm \
  -v $(pwd):/app/workspace \
  -v ~/.gitconfig:/home/mcp/.gitconfig:ro \
  -v ~/.ssh:/home/mcp/.ssh:ro \
  -w /app/workspace \
  0xshariq/github-mcp-server:latest
```

## 🔄 Docker Compose (For Regular Use)

Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  github-mcp-server:
    image: 0xshariq/github-mcp-server:latest
    container_name: mcp-server
    volumes:
      - ./:/app/workspace
      - ~/.gitconfig:/home/mcp/.gitconfig:ro
      - ~/.ssh:/home/mcp/.ssh:ro
    working_dir: /app/workspace
    stdin_open: true
    tty: true
```

Then use it:
```bash
# Start the container
docker-compose up -d

# Run commands
docker-compose exec github-mcp-server gstatus
docker-compose exec github-mcp-server gflow "Your commit message"

# Stop when done
docker-compose down
```

## 🛠️ Build Your Own (Advanced)

If you want to modify the Docker image:

```bash
# Clone the repo
git clone https://github.com/0xshariq/github-mcp-server.git
cd github-mcp-server

# Build your own image
docker build -t my-mcp-server .

# Run your custom image
docker run -it --rm my-mcp-server
```

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check if image exists
docker images | grep github-mcp-server

# Check container logs
docker logs [container-name]

# Try pulling latest image
docker pull 0xshariq/github-mcp-server:latest
```

### Git Commands Not Working
```bash
# Make sure you're in a git repository
cd /app/workspace
git init                         # Initialize if needed

# Check git configuration
git config --list
```

### Permission Issues
```bash
# The container runs as non-root user 'mcp'
# Make sure mounted files are readable
chmod -R 755 your-project-folder
```

## 💡 Pro Tips

### Daily Development Workflow
```bash
# Create an alias for easy access
alias mcp='docker run -it --rm -v $(pwd):/app/workspace -w /app/workspace 0xshariq/github-mcp-server:latest'

# Now you can use it anywhere:
cd ~/my-project
mcp gstatus
mcp gflow "Add new feature"
```

### VS Code Integration
Add to your `.vscode/settings.json`:
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

## 📖 Next Steps

- ✅ Got Docker working? Check out [DEPLOY.md](DEPLOY.md) for production deployment
- ✅ Want to see all commands? Run `node mcp-cli.js list` inside the container  
- ✅ Need help with git workflows? Check the main [README.md](README.md)

---

🎉 **That's it!** You now have a fully working GitHub MCP Server in Docker!
