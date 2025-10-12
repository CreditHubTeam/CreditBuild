#!/bin/sh

echo "🚀 Starting CreditBuild Application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "📊 Database is ready!"

# Always run seed for development (it has upsert logic to handle existing data)
echo "🌱 Running database seed..."
npm run db:seed
echo "✅ Database setup completed!"

echo "🌐 Starting Next.js server..."
exec npm start