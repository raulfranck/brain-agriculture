#!/bin/sh
set -e

echo "🔄 Aguardando PostgreSQL estar disponível..."
npx wait-port postgres:5432

echo "🧹 Limpando migrations anteriores..."
PGPASSWORD=$DB_PASS psql -h postgres -U $DB_USER -d $DB_NAME -c "DROP TABLE IF EXISTS migrations CASCADE;" || true

echo "✅ PostgreSQL disponível! Executando migrations..."
pnpm typeorm migration:run

echo "🚀 Iniciando aplicação NestJS..."
node dist/main.js 