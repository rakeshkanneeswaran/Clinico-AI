# --- Base image ---
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY pnpm-lock.yaml* package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build Prisma Client
RUN cd app/data-core/db && npx prisma generate

# Build the Next.js app
RUN pnpm build

# --- Production image ---
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only needed build artifacts from base image
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
