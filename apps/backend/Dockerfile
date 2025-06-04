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
COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/apps/backend/package.json ./
COPY --from=builder /repo/node_modules ../../node_modules
COPY --from=builder /repo/apps/backend/node_modules ./node_modules
COPY apps/backend/entrypoint.sh ./
RUN chmod +x entrypoint.sh
RUN npm install -g pnpm
ENV NODE_ENV=production
EXPOSE 3000
CMD ["./entrypoint.sh"] 