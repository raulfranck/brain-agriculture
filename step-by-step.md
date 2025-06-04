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
- [ ] Implementar repositórios, services e controllers básicos
- [ ] Configurar Swagger (`/api/docs`)
- [ ] Adicionar logger estruturado (`nestjs-pino`)
- [x] Implementar health-check (`/health`)

## 5. Frontend – Setup Inicial e Atomic Design

- [ ] Configurar estrutura baseada em atomic design
- [ ] Instalar Redux Toolkit, RTK Query, Styled-Components, etc.
- [ ] Configurar camada de serviços para comunicação com backend
- [ ] Adicionar tipagem compartilhada via `libs/types`
- [ ] Configurar variáveis de ambiente para URL do backend

## 6. Implementação das Regras de Negócio

- [ ] Implementar entidades, DTOs, validações (`class-validator`)
- [ ] Validar CPF/CNPJ com funções reutilizáveis
- [ ] Implementar regra: `areaAgricultável + areaVegetação ≤ areaTotal`
- [ ] Criar endpoints RESTful para CRUD de produtores e fazendas

## 7. Testes

- [ ] Configurar Jest em ambos os apps
- [ ] Escrever testes unitários para services e regras de negócio (backend)
- [ ] Escrever testes de integração para endpoints (backend)
- [ ] Escrever testes unitários para componentes e hooks (frontend)
- [ ] Garantir cobertura mínima de 80%

## 8. Observabilidade e Qualidade

- [ ] Configurar ESLint, Prettier, Husky e lint-staged
- [ ] Adicionar Prometheus metrics no backend (`/metrics`)
- [ ] Adicionar badge de status do CI no README

## 9. Dashboard e Funcionalidades Avançadas

- [ ] Implementar dashboard analítico no frontend
- [ ] Criar gráficos de pizza (estado, cultura, uso do solo)
- [ ] Exibir totais de fazendas e hectares

## 10. Documentação e Extras

- [ ] Documentar endpoints no Swagger
- [ ] Criar README detalhado com instruções de uso e desenvolvimento
- [ ] Adicionar seeds de dados para testes manuais
- [ ] Criar diagrama de entidades (ex: dbdiagram.io)
