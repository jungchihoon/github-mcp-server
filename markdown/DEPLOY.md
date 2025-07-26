# 🚀 Deployment Guide

Simple ways to deploy and use GitHub MCP Server in different environments.

## 🐳 Docker Hub (Ready to Use)

The GitHub MCP Server is available on Docker Hub - no building required!

### 📦 Available Images
- **Latest**: `0xshariq/github-mcp-server:latest`
- **Specific Version**: `0xshariq/github-mcp-server:1.6.1`
- **Size**: ~60MB (optimized Alpine Linux)

### 🔗 Docker Hub Link
🌐 https://hub.docker.com/r/0xshariq/github-mcp-server

## ⚡ Quick Deployment Options

### 1. Try It Right Now (No Setup)
```bash
# Just run it - takes 30 seconds
docker run -it --rm 0xshariq/github-mcp-server:latest

# Inside container, test it:
gstatus                          # Check git status
node mcp-cli.js list            # See all available tools
```

### 2. Use with Your Projects
```bash
# Run with your current directory mounted
docker run -it --rm \
  -v $(pwd):/app/workspace \
  -w /app/workspace \
  0xshariq/github-mcp-server:latest

# Now you can use git commands on your local files
gstatus                          # Shows your local repo status
gflow "Deploy to production"     # Commits and pushes your changes
```

### 3. Set Up for Daily Use
```bash
# Create a handy alias
echo 'alias mcp="docker run -it --rm -v \$(pwd):/app/workspace -w /app/workspace 0xshariq/github-mcp-server:latest"' >> ~/.bashrc
source ~/.bashrc

# Now use anywhere:
cd ~/my-project
mcp gstatus
mcp gflow "Fixed bug #123"
```

## 🏢 Production Deployment

### Docker Compose (Teams/Servers)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mcp-server:
    image: 0xshariq/github-mcp-server:latest
    container_name: github-mcp-server
    restart: unless-stopped
    volumes:
      - ./repositories:/app/workspace
      - ~/.gitconfig:/home/mcp/.gitconfig:ro
      - ~/.ssh:/home/mcp/.ssh:ro
    working_dir: /app/workspace
    stdin_open: true
    tty: true
```

Deploy:
```bash
# Start the service
docker-compose up -d

# Use it
docker-compose exec mcp-server gstatus
docker-compose exec mcp-server gflow "Production deployment"

# Stop when not needed
docker-compose down
```

### Kubernetes (Large Scale)

Simple Kubernetes deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: github-mcp-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: github-mcp-server
  template:
    metadata:
      labels:
        app: github-mcp-server
    spec:
      containers:
      - name: mcp-server
        image: 0xshariq/github-mcp-server:latest
        resources:
          limits:
            memory: "256Mi"
            cpu: "200m"
          requests:
            memory: "128Mi"
            cpu: "100m"
```

Deploy:
```bash
kubectl apply -f mcp-deployment.yaml
kubectl exec -it deployment/github-mcp-server -- gstatus
```

## � Configuration Options

### Environment Variables
```bash
# Set git user info
docker run -it --rm \
  -e GIT_USER_NAME="Your Name" \
  -e GIT_USER_EMAIL="you@email.com" \
  0xshariq/github-mcp-server:latest
```

### Mount Your Git Config
```bash
# Use your personal git settings
docker run -it --rm \
  -v ~/.gitconfig:/home/mcp/.gitconfig:ro \
  -v ~/.ssh:/home/mcp/.ssh:ro \
  0xshariq/github-mcp-server:latest
```

## 🎯 Common Use Cases

### 1. CI/CD Pipelines
```bash
# In your CI script
docker run --rm \
  -v $(pwd):/app/workspace \
  -w /app/workspace \
  0xshariq/github-mcp-server:latest \
  gflow "Automated deployment"
```

### 2. Development Teams
```bash
# Everyone uses the same git tools
docker run -it --rm \
  -v ~/team-project:/app/workspace \
  -w /app/workspace \
  0xshariq/github-mcp-server:latest
```

### 3. Learning Git
```bash
# Safe environment to practice git commands
docker run -it --rm 0xshariq/github-mcp-server:latest
# Inside: git init, gadd, gcommit, etc.
```

### 4. VS Code Integration
Add to `.vscode/settings.json`:
```json
{
  "mcpServers": {
    "github-mcp-server": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/app/workspace", "-w", "/app/workspace", "0xshariq/github-mcp-server:latest", "node", "dist/index.js"]
    }
  }
}
```

## � Troubleshooting

### Image Won't Pull
```bash
# Make sure Docker is running
docker --version

# Try pulling manually
docker pull 0xshariq/github-mcp-server:latest
```

### Permission Issues
```bash
# Fix file permissions (Linux/Mac)
chmod -R 755 your-project-folder

# Or run with your user ID
docker run --user $(id -u):$(id -g) -it --rm 0xshariq/github-mcp-server:latest
```

### Git Authentication
```bash
# For SSH keys
docker run -v ~/.ssh:/home/mcp/.ssh:ro -it --rm 0xshariq/github-mcp-server:latest

# For HTTPS (use personal access tokens)
git config --global credential.helper store
```

## 📊 What's Included

### ✅ Pre-installed Tools
- Node.js 20 (Alpine Linux)
- Git with all standard commands
- SSH client for git operations
- All 20+ MCP git operations
- Enhanced git aliases (gstatus, gadd, gcommit, etc.)

### 🔒 Security Features
- Runs as non-root user (`mcp`)
- Minimal Alpine Linux base
- No unnecessary packages
- Safe git directory configuration

### � Resource Requirements
- **RAM**: 128MB minimum, 256MB recommended
- **CPU**: Very low usage (0.1 CPU cores)
- **Disk**: 60MB for image, minimal runtime usage

## 📖 Next Steps

- ✅ **Got it working?** Check [DOCKER.md](DOCKER.md) for more Docker tips
- ✅ **Need git help?** See [README.md](README.md) for all available commands
- ✅ **Want examples?** Run `node mcp-cli.js list` inside the container

---

🎉 **Ready to deploy!** Choose the option that fits your needs and start using powerful git operations.
