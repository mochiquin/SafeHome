# SafeHome 🏠

A modern home services platform focused on privacy protection and security, providing users with a convenient home service booking experience.

## 📋 Project Overview

SafeHome is a full-stack web application designed to connect users with home service providers. The project places special emphasis on data privacy and security, utilizing multi-layer encryption to protect sensitive user information and integrating modern payment solutions.

### 🌟 Core Features

- **User Management**: Registration, login, role management (customer/provider/admin)
- **Service Booking**: Home service listing, online booking, scheduling
- **Payment System**: Stripe integration
- **Privacy Protection**: Encrypted storage of sensitive information, GDPR compliance
- **COVID Safety**: Vaccination status tracking, geographic filtering

## 🛠 Tech Stack

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: MySQL 8.0
- **Authentication**: JWT + HttpOnly Cookie
- **Encryption**: Fernet symmetric encryption + PBKDF2 key derivation
- **Payments**: Stripe API integration

### Frontend
- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query

### Deployment
- **Containerization**: Docker + Docker Compose
- **Database**: MySQL container
- **Reverse Proxy**: Nginx (production)

## 🏗 Project Architecture

```
SafeHome/
├── backend/                 # Django backend
│   ├── accounts/           # User management module
│   ├── services/           # Service management module
│   ├── bookings/           # Booking system module
│   ├── payments/           # Payment processing module
│   ├── covid/              # COVID-related features
│   ├── core/               # Core utilities and middleware
│   └── tests/              # Test files
├── frontend/               # Next.js frontend
│   ├── app/                # App Router structure
│   └── components/         # React components
├── compose/                # Docker configuration
└── tools/                  # Development tools
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (local development)
- Python 3.9+ (local development)

### 1. Clone the Project

```bash
git clone <repository-url>
cd SafeHome
```

### 2. Generate Security Keys

```bash
# Generate Django secret key, Fernet key, and JWT signing key
python tools/generate-keys.py
```

### 3. Configure Environment Variables

```bash
# Copy environment variable template
cp compose/.env.example compose/.env


# Edit .env file and fill in the generated keys and API configuration
# Required variables:
# - DJANGO_SECRET_KEY
# - FERNET_KEY
# - JWT_SIGNING_KEY
# - STRIPE_PUBLISHABLE_KEY
# - STRIPE_SECRET_KEY
```

### 4. Start Services

```bash
# Start all services using Docker Compose
cd compose
docker-compose up -d

# Check service status
docker-compose ps
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

## 🔧 Development Guide

### Local Development Setup


#### Frontend Development

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Database Management

```bash
# Create migration files
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed test data
python manage.py seed
```

## 🔐 Security Features

### Data Encryption
- **Fernet Symmetric Encryption**: Protects sensitive user information such as addresses and phone numbers
- **PBKDF2 Key Derivation**: Secure key generation mechanism
- **Multi-round Encryption Testing**: Ensures ciphertext unreadability

### Authentication Security
- **JWT Tokens**: 30-minute access token + 7-day refresh token
- **HttpOnly Cookie**: Prevents XSS attacks
- **Token Rotation**: Automatic refresh and blacklist mechanism

### Privacy Protection
- **Consent Logging**: GDPR-compliant user consent tracking
- **IP Recording**: Request origin tracking
- **Data Minimization**: Collects only necessary information

### Payment Security
- **Stripe Integration**: PCI DSS compliant payment processing
- **Tokenization**: Sensitive payment information not stored locally
- **Payment Verification**: Complete payment lifecycle management

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
POST /api/auth/refresh      # Refresh token
GET  /api/auth/me          # Get user information
```

### Service Endpoints

```http
GET    /api/services/       # Get service list
POST   /api/services/       # Create service (admin)
GET    /api/services/{id}/  # Get service details
PUT    /api/services/{id}/  # Update service (admin)
DELETE /api/services/{id}/  # Delete service (admin)
```

### Booking Endpoints

```http
GET    /api/bookings/       # Get user bookings
POST   /api/bookings/       # Create booking
GET    /api/bookings/{id}/  # Get booking details
PUT    /api/bookings/{id}/  # Update booking
DELETE /api/bookings/{id}/  # Cancel booking
```

### Payment Endpoints

```http
POST /api/payments/create-checkout-session/  # Create checkout session
POST /api/payments/webhook/                   # Stripe Webhook
GET  /api/payments/qr/{token}/               # Get payment QR code
```

## 🐳 Deployment Guide

### Docker Deployment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variable Configuration

Production environment requires the following key variables:

```bash
# Security configuration
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<production-key>
FERNET_KEY=<production-encryption-key>
JWT_SIGNING_KEY=<production-jwt-key>

# Database configuration
MYSQL_PASSWORD=<strong-password>
MYSQL_ROOT_PASSWORD=<strong-password>

# Stripe configuration
STRIPE_SECRET_KEY=<production-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>

# Domain configuration
DJANGO_ALLOWED_HOSTS=yourdomain.com
DJANGO_CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Encryption functionality tests
python tests/test_crypto.py
python tests/test_booking_encryption.py

# API tests
python tests/test_auth_api.py
python tests/test_booking_api.py
python tests/test_services_api.py

# Payment tests
python tests/test_payment_model.py
python tests/test_stripe_checkout.py

# COVID functionality tests
python tests/test_covid_restrictions.py
```

## 📝 Development Tools

### Key Generation Tool

```bash
# Generate all required keys
python tools/generate-keys.py
```

### Database Seed Data

```bash
# Populate test data
python manage.py seed
```

**SafeHome** - Making home services safer and more convenient 🏠✨
