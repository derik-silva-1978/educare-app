#!/bin/sh
set -e

echo "=== Educare Backend Startup ==="
echo "Environment: $NODE_ENV"
echo "Database Host: $DB_HOST"

echo ">>> Running database migrations..."
npx sequelize-cli db:migrate --env production 2>&1 || {
  echo "WARNING: Migrations failed or already applied, continuing..."
}

echo ">>> Seeding subscription plans (if empty)..."
node src/database/seed-plans.js 2>&1 || {
  echo "WARNING: Plan seeding failed, continuing..."
}

echo ">>> Starting server..."
exec node src/server.js
