# Dockerfile for AUDIRA NetOps Background Worker
FROM node:20-alpine AS build

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @audira/worker run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/worker ./apps/worker
COPY package.json pnpm-workspace.yaml ./

CMD ["node", "apps/worker/dist/index.js"]
