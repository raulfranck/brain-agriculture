#!/bin/sh
set -e

echo "🔄 Aguardando PostgreSQL estar disponível..."
npx wait-port postgres:5432

echo "🧹 Resetando banco para estado limpo..."
# Script SQL para reset completo
PGPASSWORD=$DB_PASS psql -h postgres -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 << 'EOF'
-- Desabilitar foreign key checks temporariamente
SET session_replication_role = replica;

-- Limpar todas as tabelas existentes
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Restaurar permissões padrão
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Reabilitar foreign key checks
SET session_replication_role = DEFAULT;
EOF

echo "✅ Banco resetado com sucesso!"

echo "🔄 Executando migrations..."
# Executar migrations usando o arquivo de data-source JavaScript
npx typeorm migration:run -d src/data-source.js

echo "🚀 Iniciando aplicação NestJS..."
node dist/main.js 