/**
 * Payment status type
 */
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded'

/**
 * Payment model interface
 */
export interface Payment {
  id: string // UUID in backend
  booking: string // Booking ID
  amount: number
  status: PaymentStatus
  qr_token?: string
  stripe_session_id?: string
  stripe_payment_intent_id?: string
  payment_method?: string
  currency: string
  metadata?: Record<string, any>
  paid_at?: string
  created_at: string
  updated_at: string
}

/**
 * Stripe configuration interface
 */
export interface StripeConfig {
  publishableKey: string
}

/**
 * Create Stripe checkout session request
 */
export interface CreateStripeCheckoutRequest {
  booking_id: string
  amount?: number // Amount in cents
  currency?: string
}

/**
 * Stripe checkout session response
 */
export interface StripeCheckoutResponse {
  checkout_url: string
  session_id: string
}

/**
 * Payment success response
 */
export interface PaymentSuccessResponse {
  payment_status: string
  amount_total: number
  currency: string
}

/**
 * Payment QR data response
 */
export interface PaymentQRData {
  qr_token: string
  status: PaymentStatus
  amount: string
  currency: string
}
