#!/bin/bash

# Script para corrigir problemas de índices corrompidos no PostgreSQL
# Execução: chmod +x scripts/fix-db.sh && ./scripts/fix-db.sh

echo "🔧 Iniciando correção do banco de dados PostgreSQL..."

# Verificar se o Docker Compose está rodando
if ! docker-compose ps | grep -q postgres; then
    echo "❌ Erro: Container PostgreSQL não está rodando."
    echo "Execute primeiro: docker-compose up -d postgres"
    exit 1
fi

echo "📊 Status atual dos containers:"
docker-compose ps

echo ""
echo "🗃️ Executando correção de índices corrompidos..."

# Executar o script SQL de correção
docker-compose exec -T postgres psql -U postgres -d brain_agriculture << 'EOF'
-- Correção de índices corrompidos
\echo 'Iniciando correção de índices...'

-- 1. Verificar e reindexar índices corrompidos
\echo 'Reindexando índice problemático...'
REINDEX INDEX CONCURRENTLY pg_publication_rel_prrelid_prpubid_index;

-- 2. Reindexar todos os índices de sistema relacionados à replicação
\echo 'Reindexando sistema...'
REINDEX SYSTEM brain_agriculture;

-- 3. Recriar estatísticas das tabelas
\echo 'Recriando estatísticas...'
ANALYZE producer;
ANALYZE farm;
ANALYZE harvest;
ANALYZE crop;

-- 4. Verificar integridade
\echo 'Verificando integridade das tabelas...'
SELECT 
    schemaname, 
    tablename, 
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

\echo 'Correção concluída!'
EOF

echo ""
echo "✅ Correção de banco executada com sucesso!"
echo ""
echo "🔄 Reiniciando o backend para garantir novas conexões limpas..."
docker-compose restart backend

echo ""
echo "🎉 Processo de correção finalizado!"
echo "Agora você pode testar os métodos PUT de Producer e Farm novamente."
echo ""
echo "📋 Para verificar se está funcionando:"
echo "  - Acesse: http://localhost:3000/api/docs"
echo "  - Teste endpoints PUT /producers/{id} e /farms/{id}"
echo ""
echo "📊 Para monitorar logs:"
echo "  docker-compose logs -f backend" 