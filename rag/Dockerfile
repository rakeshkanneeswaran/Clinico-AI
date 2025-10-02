# ------------------------------
# 1️⃣ Base Image
# ------------------------------
FROM node:20-alpine AS base

# Set working directory inside the container
WORKDIR /app

# ------------------------------
# 2️⃣ Install PNPM
# ------------------------------
RUN npm install -g pnpm

# ------------------------------
# 3️⃣ Copy Package Files and Install Dependencies
# ------------------------------
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (using frozen-lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# ------------------------------
# 4️⃣ Copy Source Code and Build
# ------------------------------
COPY . .

# Build the project
RUN pnpm run build

# ------------------------------
# 5️⃣ Production Image
# ------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Install PNPM in production image
RUN npm install -g pnpm

# Copy built files from the previous stage
COPY --from=base /app /app

# Expose Fastify’s default port
EXPOSE 3001

# ------------------------------
# 6️⃣ Set Environment Variables (runtime-injected)
# ------------------------------
# You’ll pass these via `docker run -e ...` instead of hardcoding them
# ENV SUPABASE_URL=
# ENV SUPABASE_ANON_KEY=
# ENV CLINICO_AI_API_KEY=
# ENV HUGGINGFACE_API_KEY=
# ENV database_password=

# ------------------------------
# 7️⃣ Start Application
# ------------------------------
CMD ["pnpm", "run", "start"]
