# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set default Django settings for development
ENV DJANGO_SETTINGS_MODULE=safehome.settings
ENV DJANGO_SECRET_KEY=dev-secret-key-change-in-production
ENV DJANGO_DEBUG=True
ENV DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_USER=safe
ENV MYSQL_PASSWORD=safe_pw
ENV MYSQL_DB=safehome
ENV DJANGO_TIME_ZONE=UTC
ENV DJANGO_USE_TZ=True
ENV DJANGO_LOG_LEVEL=INFO
ENV DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Copy and set entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Run entrypoint script
CMD ["./entrypoint.sh"]
