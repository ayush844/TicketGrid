# ---------- BUILDER ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files (monorepo)
COPY package.json package-lock.json ./

# Copy API package.json
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm install
RUN npm install --prefix apps/api

# Copy API source
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Generate Prisma client (VERY IMPORTANT)
RUN npx prisma generate

# Build TS → JS
RUN npm run build

# ---------- RUNNER ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/api/node_modules ./node_modules

# Copy built code
COPY --from=builder /app/apps/api/dist ./dist

# Copy prisma schema (optional but good)
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/server.js"]