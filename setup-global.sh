#!/bin/bash

# GitHub MCP Server - Global Setup Script
# This script sets up the MCP server for global usage

echo "🚀 Setting up GitHub MCP Server for global access..."

# Ensure we're in the correct directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Build the project first
echo "📦 Building the MCP server..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

# Create global npm link
echo "🔗 Creating global npm link..."
npm link

if [ $? -eq 0 ]; then
    echo "✅ Global link created successfully!"
    echo ""
    echo "🎉 Setup complete! You can now use the MCP server from anywhere:"
    echo ""
    echo "   github-mcp-server git-status"
    echo "   github-mcp-server git-add-all"
    echo "   github-mcp-server git-commit \"Your message\""
    echo "   github-mcp-server git-push"
    echo ""
    echo "📝 To test it, navigate to any Git repository and run:"
    echo "   github-mcp-server git-status"
    echo ""
else
    echo "❌ Failed to create global link. You may need to run with sudo:"
    echo "   sudo npm link"
fi

echo ""
echo "⚡ Available CLI Aliases (ready to use after npm link):"
echo ""
echo "📋 Basic Git Operations:"
echo "   gstatus                  # Check repository status"
echo "   gadd                     # Add all modified files"
echo "   gcommit \"message\"       # Commit staged changes"
echo "   gpush                    # Push to remote repository"
echo "   gpull                    # Pull from remote repository"
echo ""
echo "🔄 Workflow Combinations:"
echo "   gflow \"message\"         # Complete workflow: add→commit→push"
echo "   gquick \"message\"        # Quick commit without push"
echo "   gsync                    # Sync with remote (pull→push)"
echo "   gfresh                   # Fresh start workflow"
echo ""
echo "🌿 Branch Management:"
echo "   gbranch [name]           # List or create branches"
echo "   gcheckout <name>         # Switch branches"
echo ""
echo "📝 Information & History:"
echo "   glog [count]             # Show commit history"
echo "   gdiff [target]           # Show differences"
echo ""
echo "💼 Stash Operations:"
echo "   gstash [message]         # Stash current changes"
echo "   gpop                     # Apply most recent stash"
echo ""
echo "� Advanced Operations:"
echo "   greset [mode] [target]   # Reset repository state"
echo "   gclone <url> [dir]       # Clone repository"
echo ""
echo "📡 Remote Management:"
echo "   gremote                  # List remote repositories"
echo "   gremote-add <name> <url> # Add remote repository"
echo "   gremote-remove <name>    # Remove remote repository"
echo "   gremote-set-url <name> <url> # Change remote URL"
echo ""
echo "🚀 Developer Workflows:"
echo "   gdev [feature-name]      # Developer session management"
echo "   gsave [\"description\"]   # Quick save workflows"
echo "   gfix \"description\"      # Quick fix workflows"
echo "   grelease [version]       # Release management"
echo ""
echo "🔥 Advanced Workflows:"
echo "   gworkflow <type> <name>  # Professional workflow automation"
echo "   gbackup [strategy]       # Comprehensive backup workflows"
echo "   gclean [operation]       # Repository cleanup and maintenance"

echo ""
echo "🌟 Your GitHub MCP Server is now ready for global use!"
echo "📖 Check the README.md for more usage examples and integration options."
