interface PaymentConfig {
  provider: 'baridimob' | 'cib';
  apiUrl: string;
  merchantId: string;
  apiKey: string;
}

interface PaymentRequest {
  amount: number; // in DZD centimes
  currency: 'DZD';
  orderId: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  cancelUrl: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

interface PaymentVerification {
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  amount: number;
  fees: number;
  error?: string;
}

export class PaymentService {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        merchant_id: this.config.merchantId,
        amount: request.amount,
        currency: request.currency,
        order_id: request.orderId,
        description: request.description,
        customer_email: request.customerEmail,
        customer_phone: this.formatAlgerianPhone(request.customerPhone),
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${this.config.apiUrl}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Payment API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        paymentUrl: result.payment_url || result.redirect_url,
        transactionId: result.transaction_id || result.id
      };

    } catch (error) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${this.config.apiUrl}/payment/verify/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Payment verification error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        status: this.mapPaymentStatus(result.status),
        transactionId: result.transaction_id,
        amount: result.amount,
        fees: result.fees || 0
      };

    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        success: false,
        status: 'failed',
        transactionId,
        amount: 0,
        fees: 0,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  private mapPaymentStatus(status: string): 'pending' | 'completed' | 'failed' | 'cancelled' {
    const statusMap: { [key: string]: 'pending' | 'completed' | 'failed' | 'cancelled' } = {
      'PENDING': 'pending',
      'SUCCESS': 'completed',
      'COMPLETED': 'completed',
      'FAILED': 'failed',
      'ERROR': 'failed',
      'CANCELLED': 'cancelled',
      'CANCELED': 'cancelled'
    };
    
    return statusMap[status.toUpperCase()] || 'failed';
  }

  private formatAlgerianPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('213')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+213${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+213${cleaned}`;
    }
    
    return `+213${cleaned}`;
  }

  // Subscription-specific methods
  async createSubscriptionPayment(
    userId: string,
    planType: 'premium' | 'family' | 'school',
    duration: 'monthly' | 'yearly'
  ): Promise<PaymentResponse> {
    const plans = {
      premium: { monthly: 250000, yearly: 2500000 }, // 2500 DZD monthly, 25000 yearly
      family: { monthly: 500000, yearly: 5000000 },   // 5000 DZD monthly, 50000 yearly
      school: { monthly: 1500000, yearly: 15000000 }  // 15000 DZD monthly, 150000 yearly
    };

    const amount = plans[planType][duration];
    const orderId = `SUB_${userId}_${planType}_${duration}_${Date.now()}`;

    return this.createPayment({
      amount,
      currency: 'DZD',
      orderId,
      description: `اشتراك ${planType} - ${duration === 'monthly' ? 'شهري' : 'سنوي'}`,
      customerEmail: '', // Will be filled from user data
      customerPhone: '', // Will be filled from user data
      returnUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/payment/cancel`
    });
  }
}

// Factory functions for different payment providers
export function createBaridiMobService(): PaymentService {
  return new PaymentService({
    provider: 'baridimob',
    apiUrl: process.env.BARIDIMOB_API_URL || '',
    merchantId: process.env.BARIDIMOB_MERCHANT_ID || '',
    apiKey: process.env.BARIDIMOB_API_KEY || ''
  });
}

export function createCIBService(): PaymentService {
  return new PaymentService({
    provider: 'cib',
    apiUrl: process.env.CIB_PAYMENT_URL || '',
    merchantId: process.env.CIB_MERCHANT_ID || '',
    apiKey: process.env.CIB_API_KEY || ''
  });
}

// Main payment service with fallback
export function createPaymentService(preferredProvider?: 'baridimob' | 'cib'): PaymentService {
  if (preferredProvider === 'cib') {
    return createCIBService();
  }
  return createBaridiMobService(); // Default to BaridiMob
}

// Utility function for testing payments in development
export async function testPaymentService() {
  const paymentService = createPaymentService();
  
  const testPayment = await paymentService.createPayment({
    amount: 250000, // 2500 DZD
    currency: 'DZD',
    orderId: `TEST_${Date.now()}`,
    description: 'Test payment for premium subscription',
    customerEmail: 'test@example.com',
    customerPhone: '+213555123456',
    returnUrl: 'http://localhost:3000/payment/success',
    cancelUrl: 'http://localhost:3000/payment/cancel'
  });
  
  console.log('Payment Test Result:', testPayment);
  return testPayment;
}