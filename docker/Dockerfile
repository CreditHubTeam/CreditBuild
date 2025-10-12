# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install wget for healthcheck
RUN apk add --no-cache wget

COPY --from=builder /app ./

# Create entrypoint script inline to avoid file copy issues
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "🚀 Starting CreditBuild Application..."' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Wait for database to be ready' >> /app/entrypoint.sh && \
    echo 'echo "⏳ Waiting for database to be ready..."' >> /app/entrypoint.sh && \
    echo 'until npx prisma db push --accept-data-loss 2>/dev/null; do' >> /app/entrypoint.sh && \
    echo '  echo "Database is unavailable - sleeping"' >> /app/entrypoint.sh && \
    echo '  sleep 2' >> /app/entrypoint.sh && \
    echo 'done' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "📊 Database is ready!"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Always run seed for development' >> /app/entrypoint.sh && \
    echo 'echo "🌱 Running database seed..."' >> /app/entrypoint.sh && \
    echo 'npm run db:seed' >> /app/entrypoint.sh && \
    echo 'echo "✅ Database setup completed!"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "🌐 Starting Next.js server..."' >> /app/entrypoint.sh && \
    echo 'exec npm start' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 3000
CMD ["/app/entrypoint.sh"]
