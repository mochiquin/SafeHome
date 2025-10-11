# API Client Usage Guide

## Installation and Setup

1. Ensure axios is installed:
```bash
pnpm add axios
```

2. Copy environment variables file:
```bash
cp .env.example .env.local
```

3. Configure in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Basic Usage

### Authentication API

```typescript
import { authApi } from '@/lib/apis'

// Login (optionally specify role)
const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
  role: 'customer'  // Optional: specify role for verification
})

// Or login without specifying role (system will use user's registered role)
const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
})

// Register
const registerResponse = await authApi.register({
  email: 'user@example.com',
  username: 'username',
  first_name: 'John',
  last_name: 'Doe',
  password: 'password123',
  password_confirm: 'password123',
  consent: true,
  role: 'customer',
  city: 'New York'
})

// Get user profile
const userResponse = await authApi.me()

// Update user profile
const updateResponse = await authApi.updateProfile({
  first_name: 'Jane',
  city: 'Los Angeles'
})

// Logout
await authApi.logout()

// Delete account
await authApi.deleteAccount()

// Get customer dashboard (customers only)
const customerDashboard = await authApi.getCustomerDashboard()

// Get provider dashboard (providers only)
const providerDashboard = await authApi.getProviderDashboard()
```

### Services API

```typescript
import { servicesApi } from '@/lib/apis'

// Get services list
const servicesResponse = await servicesApi.getServices({
  page: 1,
  page_size: 10,
  category: 'Cleaning',
  min_price: 50,
  max_price: 200
})

// Get single service
const serviceResponse = await servicesApi.getService('service-uuid')

// Get services by location
const localServicesResponse = await servicesApi.getServicesByLocation('New York')

// Get categories list
const categoriesResponse = await servicesApi.getCategories()
```

### Bookings API

```typescript
import { bookingsApi } from '@/lib/apis'

// Create a new booking
const createResponse = await bookingsApi.createBooking({
  service_id: 'service-uuid',
  address: '123 Main St',
  phone: '+1234567890',
  city: 'New York',
  state: 'NY',
  start_time: '2024-01-15T10:00:00Z',
  duration_hours: 2,
  notes: 'Please be careful with the furniture'
})

// Get user's bookings
const bookingsResponse = await bookingsApi.getBookings({
  page: 1,
  page_size: 10,
  status: 'confirmed'
})

// Get booking details
const bookingResponse = await bookingsApi.getBooking('booking-uuid')

// Update booking
const updateResponse = await bookingsApi.updateBooking('booking-uuid', {
  address: '456 Oak Ave',
  start_time: '2024-01-16T14:00:00Z'
})

// Get booking statistics
const statsResponse = await bookingsApi.getBookingStats()
```

### Payments API

```typescript
import { paymentsApi } from '@/lib/apis'

// Get Stripe configuration
const stripeConfig = await paymentsApi.getStripeConfig()

// Create Stripe checkout session
const checkoutResponse = await paymentsApi.createStripeCheckout({
  booking_id: 'booking-uuid',
  amount: 10000, // Amount in cents
  currency: 'usd'
})

// Handle payment success (called after Stripe redirect)
const successResponse = await paymentsApi.handlePaymentSuccess('session_id')

// Handle payment cancellation
const cancelResponse = await paymentsApi.handlePaymentCancel()

// Get payment QR data for mobile payments
const qrResponse = await paymentsApi.getPaymentQRData('payment-uuid')
```

## Error Handling

All API calls will throw errors that you need to handle:

```typescript
import { authApi } from '@/lib/apis'

try {
  const response = await authApi.login({
    email: 'user@example.com',
    password: 'wrong_password'
  })
  console.log('Login successful:', response.data)
} catch (error: any) {
  console.error('Login failed:', error.message)
  if (error.status_code === 401) {
    // Handle unauthorized error
  }
}
```

## Type Definitions

All type definitions are available in `@/lib/types/`, you can import them:

```typescript
import type { User, Service, Booking, Payment, ApiResponse } from '@/lib/types/api'
```

## Custom Configuration

If you need to customize axios configuration, modify `@/lib/axios.ts`:

- Adjust timeout
- Add custom headers
- Modify error handling logic
- Add request/response interceptors
