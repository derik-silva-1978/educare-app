#!/bin/sh
set -e

echo "=== Educare Backend Startup ==="
echo "Environment: $NODE_ENV"
echo "Database Host: $DB_HOST"

echo ">>> Running database migrations..."
npx sequelize-cli db:migrate --env production 2>&1 || {
  echo "WARNING: Migrations failed or already applied, continuing..."
}

echo ">>> Running database seeders..."
npx sequelize-cli db:seed:all --env production 2>&1 || {
  echo "WARNING: Seeders failed or already applied, continuing..."
}

echo ">>> Starting server..."
exec node src/server.js
