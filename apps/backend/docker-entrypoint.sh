#!/bin/sh
set -e

echo "Aguardando o Postgres subir..."
sleep 10

# Sempre builda antes de rodar as migrations
docker build

# Gera a migration inicial se não houver nenhuma migration compilada
if [ -z "$(ls -A dist/migrations 2>/dev/null)" ]; then
  echo "Nenhuma migration encontrada, gerando migration inicial..."
  pnpm typeorm migration:generate ./src/migrations/InitSchema -d ./dist/data-source.js
fi

# Roda as migrations
pnpm typeorm migration:run -d ./dist/data-source.js

# Inicia o app
exec node dist/main.js 