# Dockerfile robusto para backend NestJS em monorepo pnpm
FROM node:20-alpine AS builder
WORKDIR /repo
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter backend build

FROM node:20-alpine AS runner
WORKDIR /repo/apps/backend
RUN npm install -g pnpm
COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/apps/backend/package.json ./
COPY --from=builder /repo/node_modules ../../node_modules
COPY --from=builder /repo/apps/backend/node_modules ./node_modules
COPY --from=builder /repo/apps/backend/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder /repo/apps/backend/tsconfig.json ./tsconfig.json
COPY --from=builder /repo/apps/backend/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /repo/apps/backend/nest-cli.json ./nest-cli.json
RUN chmod +x ./docker-entrypoint.sh
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"] 