# Dockerfile robusto para backend NestJS em monorepo pnpm
FROM node:20-alpine AS builder
WORKDIR /repo
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter backend build

FROM node:20-alpine AS runner
WORKDIR /repo/apps/backend

# Instalar postgresql-client para poder usar psql
RUN apk add --no-cache postgresql-client

# Copiar arquivos do build
COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/apps/backend/package.json ./package.json
COPY --from=builder /repo/node_modules ../../node_modules
COPY --from=builder /repo/apps/backend/node_modules ./node_modules

# Copiar migrations e source files para o data-source funcionar
COPY --from=builder /repo/apps/backend/src/migrations ./src/migrations
COPY --from=builder /repo/apps/backend/src/data-source.js ./src/data-source.js

# Copiar e configurar entrypoint
COPY --from=builder /repo/apps/backend/entrypoint.sh ./entrypoint.sh

# Garantir line endings corretos e permissões
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Instalar pnpm, ts-node e configurar ambiente
RUN npm install -g pnpm ts-node typescript
ENV NODE_ENV=production
EXPOSE 3000

# Usar caminho absoleto para o entrypoint
CMD ["./entrypoint.sh"] 