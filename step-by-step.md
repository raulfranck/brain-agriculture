# 🛠️ Passo a Passo – Brain Agriculture

## 1. Estrutura Inicial do Monorepo

- [x] Criar a estrutura de diretórios:
  - `apps/backend`
  - `apps/frontend`
  - `libs/types` (tipos compartilhados)
  - `libs/common` (utils, validações, etc)
- [x] Inicializar o monorepo com `pnpm` ou `yarn workspaces`
- [x] Configurar workspaces no `package.json` raiz

## 2. Criação e Teste dos Projetos Base

- [x] Inicializar projeto NestJS em `apps/backend`
- [x] Inicializar projeto React + Vite em `apps/frontend`
- [x] Rodar ambos localmente (sem docker) e garantir que:
  - Backend responde em `/health` ou endpoint simples
  - Frontend consome endpoint do backend (ex: health-check)
  - Configurar CORS no backend para permitir acesso do frontend

## 3. Configuração de Infraestrutura com Docker

- [x] Criar `Dockerfile` para backend e frontend
- [x] Criar `docker-compose.yml` para orquestrar backend, frontend e postgres
- [x] Adicionar `.env.example` na raiz e em cada app
- [x] Configurar variáveis de ambiente essenciais (DB, PORT, etc)
- [x] Subir stack com `docker-compose` e garantir que:
  - Backend, frontend e banco estão acessíveis
  - Comunicação entre frontend e backend funciona via containers

## 4. Backend – Setup Modular e Domínio

- [x] Estruturar módulos: `modules/producer`, `modules/farm`, etc.
- [x] Instalar e configurar TypeORM com PostgreSQL
- [x] Configurar `@nestjs/config` para variáveis de ambiente
- [x] Criar entidades iniciais (`Producer`, `Farm`, etc) e migrations
- [x] Implementar repositórios, services e controllers básicos
- [x] Configurar Swagger (`/api/docs`)
- [x] Adicionar logger estruturado (`nestjs-pino`)
- [x] Implementar health-check (`/health`)
- [x] Criar Entidades inicias (`Cultura`, `Safra`)

## 5. Frontend – Setup Inicial e Atomic Design

- [x] Configurar estrutura baseada em atomic design
- [x] Instalar Redux Toolkit, RTK Query, Styled-Components, etc.
- [x] Configurar camada de serviços para comunicação com backend
- [x] Adicionar tipagem compartilhada via `libs/types`
- [x] Configurar variáveis de ambiente para URL do backend
- [x] Consumir endpoints backend - Criar Productor - Farm - Garantir comunicação total com backend
- [x] ✅ **CORRIGIDO**: Endpoints PUT para Producers e Farms funcionais
- [x] ✅ **CORRIGIDO**: Campos city, state, producerId adicionados à entidade Farm
- [x] ✅ **CORRIGIDO**: Validação CPF/CNPJ implementada
- [x] ✅ **CORRIGIDO**: Regra de negócio área agricultável + vegetação ≤ área total
- [x] Criar CRUD para Safra e Cultura
- [x] ✅ **IMPLEMENTADO**: Dashboard analítico no frontend
- [x] ✅ **IMPLEMENTADO**: Gráficos de pizza (estado, cultura, uso do solo)
- [x] ✅ **IMPLEMENTADO**: Exibir totais de fazendas e hectares
- [x] ✅ **CORRIGIDO**: Cálculo correto da distribuição por cultura
- [x] ✅ **IMPLEMENTADO**: Filtro por produtor no dashboard

## 5.1. Melhorias de UX/UI

- [x] ✅ **MELHORIA**: Máscara dinâmica para campos CPF/CNPJ
- [x] ✅ **MELHORIA**: Seletor de tipo de pessoa (PF/PJ) para CPF/CNPJ
- [x] ✅ **MELHORIA**: Validação para impedir números negativos em hectares
- [x] ✅ **MELHORIA**: Exclusão em cascata (produtor → fazendas)
- [x] ✅ **MELHORIA**: Sistema de toasts para feedback (sucesso/erro)
- [x] ✅ **MELHORIA**: Modal de confirmação para exclusões
- [x] ✅ **MELHORIA**: Mensagem específica sobre exclusão em cascata
- [x] ✅ **MELHORIA**: Validação para impedir exclusão de cultura em uso
- [x] ✅ **MELHORIA**: Substituição completa de alert() por toasts
- [x] ✅ **MELHORIA**: Substituição completa de window.confirm() por modais
- [x] ✅ **MELHORIA**: Feedback visual para todas as operações CRUD
- [x] ✅ **MELHORIA**: Mensagens de erro contextuais para exclusão de cultura em uso
- [x] ✅ **MELHORIA**: Toasts de sucesso para criação/edição/exclusão de todas as entidades
- [x] ✅ **MELHORIA**: Correção da validação CNPJ conforme algoritmo oficial

## 6. Implementação das Regras de Negócio

- [x] Implementar entidades, DTOs, validações (`class-validator`)
- [x] Validar CPF/CNPJ com funções reutilizáveis
- [x] Implementar regra: `areaAgricultável + areaVegetação ≤ areaTotal`
- [x] Criar endpoints RESTful para CRUD de produtores e fazendas

## 7. Testes

- [x] Configurar Jest em ambos os apps
- [x] Escrever testes unitários para services e regras de negócio (backend)
- [x] Escrever testes de integração para endpoints (backend)
- [ ] Escrever testes unitários para componentes e hooks (frontend)
- [ ] Garantir cobertura mínima de 80%

## 8. Observabilidade e Qualidade

- [ ] Configurar ESLint, Prettier, Husky e lint-staged
- [ ] Adicionar Prometheus metrics no backend (`/metrics`)
- [ ] Adicionar badge de status do CI no README

## 10. Documentação e Extras

- [x] Documentar endpoints no Swagger
- [ ] Criar README detalhado com instruções de uso e desenvolvimento
- [ ] Criar diagrama de entidades (ex: dbdiagram.io)
