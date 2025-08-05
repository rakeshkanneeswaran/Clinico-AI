# Use an official Python runtime as the base image
FROM python:3.11-slim-bullseye as builder


# Set the working directory in the container
WORKDIR /app


# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install  -r requirements.txt


COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000


CMD ["python", "src/main.py"]