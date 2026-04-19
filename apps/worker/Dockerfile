# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only worker package files
COPY apps/worker/package*.json ./

RUN npm install

# Copy worker source only
COPY apps/worker ./

RUN npm run build


# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY apps/worker/package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy built files
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]