# Dockerfile for AUDIRA NetOps AI Backend (Node.js API + WebSockets)
FROM node:20-alpine AS build

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @audira/api run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api ./apps/api
COPY package.json pnpm-workspace.yaml ./

EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]
