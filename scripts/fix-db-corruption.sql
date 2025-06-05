-- Script para corrigir corrupção de índices no PostgreSQL
-- Execução: docker-compose exec postgres psql -U postgres -d brain_agriculture -f /scripts/fix-db-corruption.sql

-- 1. Verificar e reindexar índices corrompidos
REINDEX INDEX pg_publication_rel_prrelid_prpubid_index;

-- 2. Reindexar todos os índices de sistema relacionados à replicação
REINDEX SYSTEM brain_agriculture;

-- 3. Verificar integridade das tabelas principais
SELECT 
    schemaname, 
    tablename, 
    attname, 
    n_distinct, 
    correlation 
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('producer', 'farm', 'harvest', 'crop');

-- 4. Recriar estatísticas das tabelas
ANALYZE producer;
ANALYZE farm;
ANALYZE harvest;
ANALYZE crop;

-- 5. Verificar se há bloqueios ativos
SELECT 
    pid,
    state,
    query,
    query_start,
    state_change
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT ILIKE '%pg_stat_activity%';

-- 6. Verificar tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

\echo 'Correção de índices concluída. Verifique se há erros acima.' 