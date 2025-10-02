# ============================================================
# 🏥 Clinico AI Server — FastAPI Backend (Python 3.11)
# ============================================================

# ------------------------------
# 1️⃣ Base Image
# ------------------------------
FROM python:3.11-slim AS base

# Prevent Python from writing .pyc files and using output buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# ------------------------------
# 2️⃣ Install Poetry and System Dependencies
# ------------------------------
RUN pip install --upgrade pip && \
    pip install poetry

# Copy only dependency files first (for caching)
COPY pyproject.toml poetry.lock* ./

# Install dependencies via Poetry
RUN poetry install

# ------------------------------
# 3️⃣ Copy Source Code
# ------------------------------
COPY . .

# ------------------------------
# 4️⃣ Expose Port and Run App
# ------------------------------
EXPOSE 8000

# Run the FastAPI app with Uvicorn
CMD ["poetry", "run", "python", "main.py"]
