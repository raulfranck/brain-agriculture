# 🌾 Brain Agriculture

Aplicação full-stack para cadastro e gestão de produtores rurais, fazendas e safras.

---

## 📦 Estrutura do Projeto

```
brain-agriculture/
├── apps/
│   ├── backend/      # API NestJS + TypeORM + PostgreSQL
│   └── frontend/     # React + Vite + Redux Toolkit
├── libs/             # Tipos e utilitários compartilhados
├── docker-compose.yml
├── package.json      # Scripts e workspaces (pnpm)
├── step-by-step.md   # Guia de implementação
└── ...
```

---

## 🚀 Rodando o Projeto

### 1. Pré-requisitos
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 2. Instalação das dependências
```sh
pnpm install
```

### 3. Configuração de variáveis de ambiente
- Copie o arquivo `.env.example` de cada app para `.env` e ajuste se necessário.
- Exemplo para o backend (`apps/backend/.env`):
  ```ini
  # Para rodar localmente
  DB_HOST=localhost
  DB_PORT=5433
  DB_USER=postgres
  DB_PASS=postgres
  DB_NAME=brain_agriculture
  ```

### 4. Subindo o banco de dados (Postgres)
```sh
docker-compose up -d postgres
```

### 5. Gerando e rodando as migrations
> **Importante:** Sempre gere e rode as migrations para criar as tabelas no banco.

```sh
pnpm migration:generate   # Gera a migration inicial (ou novas, se alterar entidades)
pnpm migration:run        # Aplica as migrations no banco
```

### 6. Subindo toda a stack (backend, frontend e banco)
```sh
docker-compose up --build
```
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Swagger: http://localhost:3000/api/docs

### 7. Rodando localmente (sem Docker)
- **Backend:**
  ```sh
  cd apps/backend
  pnpm start:dev
  ```
- **Frontend:**
  ```sh
  cd apps/frontend
  pnpm dev
  ```

---

## 🛠️ Scripts Úteis

### Banco de Dados
- `pnpm migration:generate` — Gera uma nova migration baseada nas entidades
- `pnpm migration:run` — Aplica as migrations no banco
- `pnpm migration:revert` — Reverte a última migration

### Docker
- `docker-compose up -d` — Sobe todos os serviços em background
- `docker-compose logs -f backend` — Monitora logs do backend

### Testes
- `cd apps/backend && pnpm test` — Testes unitários
- `cd apps/backend && pnpm test:watch` — Testes unitários em modo watch
- `cd apps/backend && pnpm test:cov` — Testes com cobertura
- `cd apps/backend && pnpm test:e2e` — Testes de integração (E2E)
- `cd apps/backend && pnpm test:debug` — Debug de testes

---

## 🧪 Executando Testes

### Configuração de Ambiente para Testes
Para os testes E2E, configure um banco de dados separado:

```bash
# Crie um banco específico para testes
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE brain_agriculture_test;"
```

### Executando os Testes

```bash
# Navegar para o backend
cd apps/backend

# Testes unitários
pnpm test

# Testes com cobertura (meta: 80%)
pnpm test:cov

# Testes de integração (E2E)
pnpm test:e2e

# Testes em modo watch (desenvolvimento)
pnpm test:watch
```

### Relatórios de Cobertura
Os relatórios são gerados em `apps/backend/coverage/`:
- **HTML**: `coverage/lcov-report/index.html`
- **Terminal**: Exibido automaticamente
- **LCOV**: `coverage/lcov.info`

### Métricas de Qualidade
- **Cobertura mínima**: 80% (branches, functions, lines, statements)
- **Timeout**: 30 segundos por teste
- **Ambiente**: Node.js isolado

---

## 🐞 Troubleshooting
- **Banco não conecta?**
  - Verifique se o Postgres está rodando (`docker ps`).
  - Confirme a porta correta (`5433` local, `5432` no container).
  - Confira as variáveis de ambiente do backend.
- **Migrations não aplicam?**
  - Gere e rode as migrations sempre que alterar entidades.
- **Frontend não acessa API?**
  - Verifique a variável `VITE_API_URL` no frontend.
- **Erro de índice corrompido nos métodos PUT?**
  - Execute o script de correção: `chmod +x scripts/fix-db.sh && ./scripts/fix-db.sh`
  - Ou execute manualmente: `docker-compose exec postgres psql -U postgres -d brain_agriculture -c "REINDEX SYSTEM brain_agriculture;"`

---

## 📚 Mais informações
- Documentação técnica: veja o arquivo `PROJECT.md` e o passo-a-passo em `step-by-step.md`.
- Dúvidas ou sugestões? Abra uma issue ou entre em contato. 