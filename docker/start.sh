#!/bin/sh
set -e

echo "=== Educare Backend Startup ==="
echo "Environment: $NODE_ENV"
echo "Database Host: $DB_HOST"
echo "Database Name: $DB_DATABASE"
echo "Database User: $DB_USERNAME"

echo ">>> Waiting for PostgreSQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USERNAME" -d "$DB_DATABASE" 2>/dev/null; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: PostgreSQL not ready after $MAX_RETRIES attempts. Trying migrations anyway..."
    break
  fi
  echo "  Waiting for PostgreSQL... attempt $RETRY_COUNT/$MAX_RETRIES"
  sleep 2
done

if [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; then
  echo ">>> PostgreSQL is ready!"
fi

echo ">>> Running database migrations..."
npx sequelize-cli db:migrate --env production 2>&1
MIGRATION_EXIT=$?
if [ $MIGRATION_EXIT -ne 0 ]; then
  echo "WARNING: Migration exit code $MIGRATION_EXIT — some migrations may have failed."
  echo "Check /api/admin/run-migrations endpoint to retry manually."
else
  echo ">>> Migrations completed successfully."
fi

echo ">>> Seeding subscription plans (if empty)..."
node src/database/seed-plans.js 2>&1 || {
  echo "WARNING: Plan seeding failed, continuing..."
}

echo ">>> Starting server..."
exec node src/server.js
