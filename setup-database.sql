-- ========================================
-- FAST BI IGREEN V2 - SETUP DO BANCO
-- ========================================

-- 1. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para tabela USUARIOS (autenticação)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON USUARIOS(EMAIL);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON USUARIOS(ATIVO);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_id ON USUARIOS(EMPRESA_ID);

-- Índices para tabela CLIENTES
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON CLIENTES(ATIVO);
CREATE INDEX IF NOT EXISTS idx_clientes_data_cadastro ON CLIENTES(DATA_CADASTRO);
CREATE INDEX IF NOT EXISTS idx_clientes_uf_id ON CLIENTES(UF_ID);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON CLIENTES(NOME);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON CLIENTES(EMAIL);

-- Índices para tabela RCB_CLIENTES (receitas)
CREATE INDEX IF NOT EXISTS idx_rcb_clientes_status ON RCB_CLIENTES(STATUS);
CREATE INDEX IF NOT EXISTS idx_rcb_clientes_data_competencia ON RCB_CLIENTES(DATA_COMPETENCIA);
CREATE INDEX IF NOT EXISTS idx_rcb_clientes_cliente_id ON RCB_CLIENTES(CLIENTE_ID);
CREATE INDEX IF NOT EXISTS idx_rcb_clientes_valor ON RCB_CLIENTES(VALOR_RCB);

-- Índices para tabela historico_kwh
CREATE INDEX IF NOT EXISTS idx_historico_kwh_data ON historico_kwh(DATA);
CREATE INDEX IF NOT EXISTS idx_historico_kwh_cliente_id ON historico_kwh(CLIENTE_ID);

-- Índices para tabela HISTORICO_LOGIN
CREATE INDEX IF NOT EXISTS idx_historico_login_usuario_id ON HISTORICO_LOGIN(USUARIO_ID);
CREATE INDEX IF NOT EXISTS idx_historico_login_data ON HISTORICO_LOGIN(DATA_LOGIN);

-- 2. VIEWS OTIMIZADAS PARA O DASHBOARD
-- ========================================

-- View para métricas do dashboard
CREATE OR REPLACE VIEW V_DASHBOARD_METRICS AS
SELECT 
    -- Total de clientes ativos
    (SELECT COUNT(*) FROM CLIENTES WHERE ATIVO = true) as total_clientes,
    
    -- Total de energia do ano atual
    (SELECT COALESCE(SUM(KWH), 0) 
     FROM historico_kwh 
     WHERE EXTRACT(YEAR FROM DATA) = EXTRACT(YEAR FROM CURRENT_DATE)) as total_energia_ano,
     
    -- Receita total do ano atual
    (SELECT COALESCE(SUM(VALOR_RCB), 0) 
     FROM RCB_CLIENTES 
     WHERE STATUS = 'PAGO' 
     AND EXTRACT(YEAR FROM DATA_COMPETENCIA) = EXTRACT(YEAR FROM CURRENT_DATE)) as receita_ano,
     
    -- Receita mês atual
    (SELECT COALESCE(SUM(VALOR_RCB), 0) 
     FROM RCB_CLIENTES 
     WHERE STATUS = 'PAGO' 
     AND EXTRACT(YEAR FROM DATA_COMPETENCIA) = EXTRACT(YEAR FROM CURRENT_DATE)
     AND EXTRACT(MONTH FROM DATA_COMPETENCIA) = EXTRACT(MONTH FROM CURRENT_DATE)) as receita_mes_atual,
     
    -- Receita mês anterior
    (SELECT COALESCE(SUM(VALOR_RCB), 0) 
     FROM RCB_CLIENTES 
     WHERE STATUS = 'PAGO' 
     AND EXTRACT(YEAR FROM DATA_COMPETENCIA) = EXTRACT(YEAR FROM CURRENT_DATE)
     AND EXTRACT(MONTH FROM DATA_COMPETENCIA) = EXTRACT(MONTH FROM CURRENT_DATE) - 1) as receita_mes_anterior;

-- View para dados mensais do dashboard
CREATE OR REPLACE VIEW V_DASHBOARD_MONTHLY AS
SELECT 
    TO_CHAR(months.month, 'Mon') as name,
    EXTRACT(MONTH FROM months.month) as month_num,
    COALESCE(SUM(r.VALOR_RCB), 0)::decimal(15,2) as receita,
    COALESCE(SUM(h.KWH), 0)::decimal(15,2) as energia,
    COUNT(DISTINCT r.CLIENTE_ID) as clientes_ativos
FROM generate_series(
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
    DATE_TRUNC('month', CURRENT_DATE),
    INTERVAL '1 month'
) AS months(month)
LEFT JOIN RCB_CLIENTES r ON DATE_TRUNC('month', r.DATA_COMPETENCIA) = months.month 
    AND r.STATUS = 'PAGO'
LEFT JOIN historico_kwh h ON DATE_TRUNC('month', h.DATA) = months.month
GROUP BY months.month
ORDER BY months.month;

-- View para distribuição regional
CREATE OR REPLACE VIEW V_DASHBOARD_REGIONAL AS
SELECT 
    u.UF,
    COUNT(*) as total_clientes,
    COALESCE(SUM(r.VALOR_RCB), 0)::decimal(15,2) as receita_total,
    COALESCE(AVG(r.VALOR_RCB), 0)::decimal(10,2) as receita_media
FROM CLIENTES c
JOIN UF u ON c.UF_ID = u.ID
LEFT JOIN RCB_CLIENTES r ON c.ID = r.CLIENTE_ID 
    AND r.STATUS = 'PAGO'
    AND EXTRACT(YEAR FROM r.DATA_COMPETENCIA) = EXTRACT(YEAR FROM CURRENT_DATE)
WHERE c.ATIVO = true
GROUP BY u.UF
ORDER BY total_clientes DESC;

-- 3. FUNÇÕES AUXILIARES
-- ========================================

-- Função para calcular crescimento percentual
CREATE OR REPLACE FUNCTION calcular_crescimento(valor_atual DECIMAL, valor_anterior DECIMAL)
RETURNS DECIMAL AS $
BEGIN
    IF valor_anterior IS NULL OR valor_anterior = 0 THEN
        RETURN CASE WHEN valor_atual > 0 THEN 100.0 ELSE 0.0 END;
    END IF;
    
    RETURN ROUND(((valor_atual - valor_anterior) / valor_anterior * 100), 2);
END;
$ LANGUAGE plpgsql;

-- Função para obter métricas de performance do sistema
CREATE OR REPLACE FUNCTION get_dashboard_performance()
RETURNS TABLE(
    metric_name VARCHAR,
    metric_value DECIMAL,
    period_comparison DECIMAL
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        'clientes_novos_mes'::VARCHAR as metric_name,
        COUNT(*)::DECIMAL as metric_value,
        calcular_crescimento(
            COUNT(*)::DECIMAL,
            (SELECT COUNT(*) FROM CLIENTES 
             WHERE ATIVO = true 
             AND EXTRACT(YEAR FROM DATA_CADASTRO) = EXTRACT(YEAR FROM CURRENT_DATE)
             AND EXTRACT(MONTH FROM DATA_CADASTRO) = EXTRACT(MONTH FROM CURRENT_DATE) - 1)::DECIMAL
        ) as period_comparison
    FROM CLIENTES 
    WHERE ATIVO = true 
    AND EXTRACT(YEAR FROM DATA_CADASTRO) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM DATA_CADASTRO) = EXTRACT(MONTH FROM CURRENT_DATE)
    
    UNION ALL
    
    SELECT 
        'receita_media_cliente'::VARCHAR,
        COALESCE(AVG(VALOR_RCB), 0)::DECIMAL,
        0::DECIMAL
    FROM RCB_CLIENTES 
    WHERE STATUS = 'PAGO' 
    AND EXTRACT(YEAR FROM DATA_COMPETENCIA) = EXTRACT(YEAR FROM CURRENT_DATE);
END;
$ LANGUAGE plpgsql;

-- 4. PROCEDIMENTOS PARA DASHBOARD
-- ========================================

-- Procedure para atualizar cache de métricas
CREATE OR REPLACE FUNCTION refresh_dashboard_cache()
RETURNS VOID AS $
BEGIN
    -- Atualizar estatísticas das tabelas principais
    ANALYZE CLIENTES;
    ANALYZE RCB_CLIENTES;
    ANALYZE historico_kwh;
    ANALYZE USUARIOS;
    
    -- Log da atualização
    INSERT INTO ANALYTICS (
        TIPO, 
        DADOS, 
        DATA_CRIACAO
    ) VALUES (
        'CACHE_REFRESH',
        '{"action": "dashboard_cache_refresh", "timestamp": "' || NOW() || '"}',
        NOW()
    );
END;
$ LANGUAGE plpgsql;

-- 5. TRIGGERS PARA AUDITORIA
-- ========================================

-- Tabela para logs de auditoria específicos do BI
CREATE TABLE IF NOT EXISTS FAST_BI_AUDIT_LOG (
    ID SERIAL PRIMARY KEY,
    TABLE_NAME VARCHAR(50) NOT NULL,
    OPERATION VARCHAR(10) NOT NULL,
    USER_ID INTEGER,
    OLD_DATA JSONB,
    NEW_DATA JSONB,
    CREATED_AT TIMESTAMP DEFAULT NOW(),
    IP_ADDRESS INET
);

-- Função de trigger para auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO FAST_BI_AUDIT_LOG (TABLE_NAME, OPERATION, OLD_DATA, CREATED_AT)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO FAST_BI_AUDIT_LOG (TABLE_NAME, OPERATION, OLD_DATA, NEW_DATA, CREATED_AT)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO FAST_BI_AUDIT_LOG (TABLE_NAME, OPERATION, NEW_DATA, CREATED_AT)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$ LANGUAGE plpgsql;

-- Aplicar triggers nas tabelas críticas
DROP TRIGGER IF EXISTS audit_clientes ON CLIENTES;
CREATE TRIGGER audit_clientes
    AFTER INSERT OR UPDATE OR DELETE ON CLIENTES
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_usuarios ON USUARIOS;
CREATE TRIGGER audit_usuarios
    AFTER INSERT OR UPDATE OR DELETE ON USUARIOS
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- 6. QUERIES OTIMIZADAS PARA RELATÓRIOS
-- ========================================

-- Query para top clientes por receita
CREATE OR REPLACE VIEW V_TOP_CLIENTES_RECEITA AS
SELECT 
    c.ID,
    c.NOME,
    c.EMAIL,
    u.UF as estado,
    COUNT(r.ID) as total_transacoes,
    COALESCE(SUM(r.VALOR_RCB), 0)::decimal(15,2) as receita_total,
    COALESCE(AVG(r.VALOR_RCB), 0)::decimal(10,2) as receita_media,
    MAX(r.DATA_COMPETENCIA) as ultima_transacao
FROM CLIENTES c
JOIN UF u ON c.UF_ID = u.ID
LEFT JOIN RCB_CLIENTES r ON c.ID = r.CLIENTE_ID AND r.STATUS = 'PAGO'
WHERE c.ATIVO = true
GROUP BY c.ID, c.NOME, c.EMAIL, u.UF
HAVING COUNT(r.ID) > 0
ORDER BY receita_total DESC;

-- Query para análise de tendências mensais
CREATE OR REPLACE VIEW V_TENDENCIAS_MENSAIS AS
SELECT 
    DATE_TRUNC('month', DATA_COMPETENCIA) as mes,
    COUNT(DISTINCT CLIENTE_ID) as clientes_unicos,
    COUNT(*) as total_transacoes,
    SUM(VALOR_RCB)::decimal(15,2) as receita_total,
    AVG(VALOR_RCB)::decimal(10,2) as receita_media,
    MIN(VALOR_RCB)::decimal(10,2) as menor_transacao,
    MAX(VALOR_RCB)::decimal(10,2) as maior_transacao
FROM RCB_CLIENTES 
WHERE STATUS = 'PAGO'
    AND DATA_COMPETENCIA >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY DATE_TRUNC('month', DATA_COMPETENCIA)
ORDER BY mes DESC;

-- 7. MAINTENANCE E PERFORMANCE
-- ========================================

-- Script para limpeza de dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $
BEGIN
    -- Limpar logs de auditoria com mais de 6 meses
    DELETE FROM FAST_BI_AUDIT_LOG 
    WHERE CREATED_AT < NOW() - INTERVAL '6 months';
    
    -- Limpar histórico de login com mais de 1 ano
    DELETE FROM HISTORICO_LOGIN 
    WHERE DATA_LOGIN < NOW() - INTERVAL '1 year';
    
    -- Inserir log da limpeza
    INSERT INTO ANALYTICS (TIPO, DADOS, DATA_CRIACAO) 
    VALUES ('CLEANUP', 
            '{"action": "old_data_cleanup", "timestamp": "' || NOW() || '"}', 
            NOW());
END;
$ LANGUAGE plpgsql;

-- Criar job de limpeza automática (se suportado pelo PostgreSQL)
-- SELECT cron.schedule('cleanup-job', '0 2 * * 0', 'SELECT cleanup_old_data();');

-- 8. CONFIGURAÇÕES DE SEGURANÇA
-- ========================================

-- Configurar timeout de sessão
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30min';
ALTER SYSTEM SET statement_timeout = '60s';

-- 9. DADOS INICIAIS PARA TESTE
-- ========================================

-- Inserir usuário admin padrão (apenas se não existir)
DO $
BEGIN
    IF NOT EXISTS (SELECT 1 FROM USUARIOS WHERE EMAIL = 'admin@igreen.com') THEN
        INSERT INTO USUARIOS (
            NOME, 
            EMAIL, 
            SENHA, 
            TIPO_USUARIO, 
            ATIVO, 
            DATA_CADASTRO
        ) VALUES (
            'Administrador Sistema',
            'admin@igreen.com',
            '$2b$10$K8QZmZHjKjHVKkQZPQGQMe5LzKlZ8LzKlZ8LzKlZ8LzKlZ8LzKlZ8', -- senha: 123456
            'admin',
            true,
            NOW()
        );
        
        -- Log da criação do usuário admin
        INSERT INTO ANALYTICS (TIPO, DADOS, DATA_CRIACAO) 
        VALUES ('USER_CREATED', 
                '{"user": "admin@igreen.com", "type": "system_setup"}', 
                NOW());
    END IF;
END $;

-- 10. VERIFICAÇÃO FINAL
-- ========================================

-- Script para verificar se tudo foi criado corretamente
DO $
DECLARE
    rec RECORD;
    missing_objects TEXT := '';
BEGIN
    -- Verificar views
    FOR rec IN 
        SELECT 'VIEW' as object_type, viewname as object_name 
        FROM pg_views 
        WHERE schemaname = 'public' 
        AND viewname IN ('V_DASHBOARD_METRICS', 'V_DASHBOARD_MONTHLY', 'V_DASHBOARD_REGIONAL')
    LOOP
        RAISE NOTICE 'Verificado: % %', rec.object_type, rec.object_name;
    END LOOP;
    
    -- Verificar funções
    FOR rec IN 
        SELECT 'FUNCTION' as object_type, proname as object_name 
        FROM pg_proc 
        WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND proname IN ('calcular_crescimento', 'get_dashboard_performance', 'refresh_dashboard_cache')
    LOOP
        RAISE NOTICE 'Verificado: % %', rec.object_type, rec.object_name;
    END LOOP;
    
    -- Verificar índices críticos
    FOR rec IN 
        SELECT 'INDEX' as object_type, indexname as object_name 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname LIKE 'idx_%'
    LOOP
        RAISE NOTICE 'Verificado: % %', rec.object_type, rec.object_name;
    END LOOP;
    
    RAISE NOTICE 'Setup do Fast BI concluído com sucesso!';
END $;

-- Finalizar com refresh do cache
SELECT refresh_dashboard_cache();