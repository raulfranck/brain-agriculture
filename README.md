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

- `pnpm migration:generate` — Gera uma nova migration baseada nas entidades
- `pnpm migration:run` — Aplica as migrations no banco
- `pnpm migration:revert` — Reverte a última migration
- `docker-compose up -d` — Sobe todos os serviços em background
- `pnpm test` — Roda os testes unitários

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

---

## 📚 Mais informações
- Documentação técnica: veja o arquivo `PROJECT.md` e o passo-a-passo em `step-by-step.md`.
- Dúvidas ou sugestões? Abra uma issue ou entre em contato. 