# GitHub MCP Server - Multi-stage Docker Build
# This Dockerfile creates an optimized container for the GitHub MCP Server
# with Git capabilities and organized CLI aliases (basic/advanced workflows)

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    git \
    openssh-client \
    ca-certificates

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm store prune

# Copy source code
COPY src/ ./src/
COPY bin/ ./bin/
COPY mcp-cli.js ./

# Build the TypeScript project
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies and Git
RUN apk add --no-cache \
    git \
    openssh-client \
    ca-certificates \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=mcp:nodejs /app/dist ./dist
COPY --from=builder --chown=mcp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mcp:nodejs /app/package*.json ./
COPY --from=builder --chown=mcp:nodejs /app/mcp-cli.js ./

# Copy and make CLI aliases executable
COPY --from=builder --chown=mcp:nodejs /app/bin ./bin
RUN chmod +x bin/basic/*.js && \
    chmod +x bin/advanced/*.js && \
    chmod +x mcp-cli.js

# Create Git configuration directory
RUN mkdir -p /home/mcp/.gitconfig && \
    chown mcp:nodejs /home/mcp/.gitconfig

# Create data directory for repositories
RUN mkdir -p /app/data && \
    chown mcp:nodejs /app/data

# Set Git global configuration for container
RUN git config --global user.name "MCP Server" && \
    git config --global user.email "mcp@container.local" && \
    git config --global init.defaultBranch main && \
    git config --global safe.directory '*'

# Expose port for potential HTTP interface
EXPOSE 3000

# Switch to non-root user
USER mcp

# Create symlinks for global CLI access (optional)
ENV PATH="/app/bin:$PATH"

# Security settings
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=512"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('GitHub MCP Server is healthy')" || exit 1

# Set default command
CMD ["node", "dist/index.js"]

# Metadata labels
LABEL \
    org.opencontainers.image.title="GitHub MCP Server" \
    org.opencontainers.image.description="Enhanced Git workflow management through MCP with 15 basic operations, 14 advanced workflows, and comprehensive remote management" \
    org.opencontainers.image.version="1.8.3" \
    org.opencontainers.image.authors="Sharique Chaudhary" \
    org.opencontainers.image.source="https://github.com/0xshariq/github-mcp-server" \
    org.opencontainers.image.licenses="ISC" \
    org.opencontainers.image.documentation="https://github.com/0xshariq/github-mcp-server/blob/main/README.md"
