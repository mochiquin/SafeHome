import { BaseApiClient } from './base'
import type { ApiResponse } from '../types/common'
import type {
  Payment,
  StripeConfig,
  CreateStripeCheckoutRequest,
  StripeCheckoutResponse,
  PaymentSuccessResponse,
  PaymentQRData,
} from '../types/payment'

export class PaymentsApiClient extends BaseApiClient {
  constructor() {
    super('/payments')
  }

  /**
   * Get Stripe configuration for frontend
   */
  async getStripeConfig(): Promise<ApiResponse<StripeConfig>> {
    return this.get<StripeConfig>('/stripe/config')
  }

  /**
   * Create Stripe checkout session
   */
  async createStripeCheckout(data: CreateStripeCheckoutRequest): Promise<ApiResponse<StripeCheckoutResponse>> {
    return this.post<StripeCheckoutResponse>('/stripe/checkout', data)
  }

  /**
   * Verify Stripe payment session and update payment status
   */
  async verifyPaymentSession(sessionId: string): Promise<ApiResponse<{ payment_status: string; amount?: string; paid_at?: string }>> {
    return this.post<{ payment_status: string; amount?: string; paid_at?: string }>('/stripe/verify-session', { session_id: sessionId })
  }

  /**
   * Handle payment success callback
   */
  async handlePaymentSuccess(sessionId: string): Promise<ApiResponse<PaymentSuccessResponse>> {
    return this.get<PaymentSuccessResponse>('/success', { session_id: sessionId })
  }

  /**
   * Handle payment cancellation callback
   */
  async handlePaymentCancel(): Promise<ApiResponse<{ status: string }>> {
    return this.get<{ status: string }>('/cancel')
  }

  /**
   * Get payment QR data (for mobile payments)
   */
  async getPaymentQRData(paymentId: string): Promise<ApiResponse<PaymentQRData>> {
    return this.get<PaymentQRData>(`/${paymentId}/qr`)
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<ApiResponse<Payment>> {
    return this.get<Payment>(`/${paymentId}`)
  }
}

// Export singleton instance
export const paymentsApi = new PaymentsApiClient()
