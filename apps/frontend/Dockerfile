# Dockerfile para frontend React+Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../pnpm-workspace.yaml ../../package.json ../../pnpm-lock.yaml ./
COPY ../../apps/frontend/package.json ./apps/frontend/
COPY ../../libs ./libs
COPY ../../apps/frontend ./apps/frontend
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm --filter frontend build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/frontend/dist ./dist
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"] 