#!/bin/bash

# SafeHome Backend Entrypoint Script
# This script handles Django startup with migrations and optional seeding

set -e  # Exit on any error

echo "🚀 Starting SafeHome Backend..."

# Wait for database to be ready (for Docker Compose)
# Skip if DATABASE_URL is not set or if it's a SQLite database
if [ "$DATABASE_URL" ] && [[ "$DATABASE_URL" != *"sqlite"* ]]; then
    echo "⏳ Waiting for database to be ready..."
    python manage.py wait_for_db --settings=safehome.settings
    echo "✅ Database is ready!"
fi

# Run database migrations
echo "🔄 Running database migrations..."
python manage.py migrate --settings=safehome.settings

# Optional: Run seed script if it exists
if [ -f "scripts/seed.py" ]; then
    echo "🌱 Running seed script..."
    python scripts/seed.py --settings=safehome.settings
else
    echo "ℹ️  No seed script found, skipping..."
fi

# Create superuser if needed (for development)
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "👤 Creating superuser..."
    python manage.py shell --settings=safehome.settings << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
    print("✅ Superuser created successfully!")
else:
    print("ℹ️  Superuser already exists.")
EOF
fi

# Run seed script if SEED_DB is true
if [ "$SEED_DB" = "true" ] && [ -f "scripts/seed.py" ]; then
    echo "🌱 Running seed script..."
    python scripts/seed.py
else
    echo "ℹ️  SEED_DB is not true or seed script not found, skipping..."
fi

# Collect static files (for production)
if [ "$DJANGO_SETTINGS_MODULE" = "safehome.settings.production" ]; then
    echo "📁 Collecting static files..."
    python manage.py collectstatic --noinput --settings=safehome.settings.production
fi

# Start the Django development server
echo "🌟 Starting Django server on 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000 --settings=safehome.settings
