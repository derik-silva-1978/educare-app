#!/bin/sh

echo "=== Educare Backend Startup ==="
echo "Environment: $NODE_ENV"
echo "Database Host: $DB_HOST"
echo "Database Name: $DB_DATABASE"

echo ">>> Waiting for PostgreSQL to be ready..."
RETRIES=0
until pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USERNAME" -d "$DB_DATABASE" >/dev/null 2>&1 || [ "$RETRIES" -ge 30 ]; do
  RETRIES=$((RETRIES + 1))
  echo "  Attempt $RETRIES/30..."
  sleep 2
done

echo ">>> Running database migrations..."
npx sequelize-cli db:migrate --env production 2>&1 || echo "WARNING: Migrations had issues, continuing..."

echo ">>> Seeding subscription plans..."
node src/database/seed-plans.js 2>&1 || echo "WARNING: Seeding had issues, continuing..."

echo ">>> Starting server..."
exec node src/server.js
