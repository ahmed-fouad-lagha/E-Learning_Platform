interface SMSConfig {
  provider: 'mobilis' | 'djezzy' | 'ooredoo';
  apiUrl: string;
  apiKey: string;
}

interface SMSMessage {
  to: string;
  message: string;
  type: 'verification' | 'notification' | 'reminder';
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export class SMSService {
  private config: SMSConfig;

  constructor(config: SMSConfig) {
    this.config = config;
  }

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      // Format phone number for Algerian standards
      const formattedPhone = this.formatAlgerianPhone(message.to);
      
      const payload = {
        to: formattedPhone,
        message: message.message,
        type: message.type,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        messageId: result.messageId || result.id,
        cost: result.cost || 0
      };

    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMS error'
      };
    }
  }

  private formatAlgerianPhone(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('213')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+213${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+213${cleaned}`;
    }
    
    return `+213${cleaned}`;
  }

  async sendVerificationCode(phone: string, code: string): Promise<SMSResponse> {
    const message = `رمز التحقق الخاص بك في منصة التعلم الجزائرية: ${code}\nلا تشارك هذا الرمز مع أحد.\nCode de vérification: ${code}`;
    
    return this.sendSMS({
      to: phone,
      message,
      type: 'verification'
    });
  }

  async sendExamReminder(phone: string, examName: string, date: string): Promise<SMSResponse> {
    const message = `تذكير: امتحان ${examName} غداً في ${date}. حظ موفق!\nRappel: Examen ${examName} demain à ${date}. Bonne chance!`;
    
    return this.sendSMS({
      to: phone,
      message,
      type: 'reminder'
    });
  }

  async sendProgressUpdate(phone: string, studentName: string, progress: number): Promise<SMSResponse> {
    const message = `تحديث التقدم: ${studentName} أكمل ${progress}% من المنهج هذا الأسبوع.\nMise à jour: ${studentName} a complété ${progress}% du programme cette semaine.`;
    
    return this.sendSMS({
      to: phone,
      message,
      type: 'notification'
    });
  }
}

// Factory function to create SMS service based on environment
export function createSMSService(): SMSService {
  const provider = (process.env.SMS_PROVIDER as 'mobilis' | 'djezzy' | 'ooredoo') || 'mobilis';
  
  const configs = {
    mobilis: {
      provider: 'mobilis' as const,
      apiUrl: process.env.MOBILIS_API_URL || '',
      apiKey: process.env.MOBILIS_API_KEY || ''
    },
    djezzy: {
      provider: 'djezzy' as const,
      apiUrl: process.env.DJEZZY_API_URL || '',
      apiKey: process.env.DJEZZY_API_KEY || ''
    },
    ooredoo: {
      provider: 'ooredoo' as const,
      apiUrl: process.env.OOREDOO_API_URL || '',
      apiKey: process.env.OOREDOO_API_KEY || ''
    }
  };

  return new SMSService(configs[provider]);
}

// Utility function for testing SMS in development
export async function testSMSService() {
  const smsService = createSMSService();
  
  const testResult = await smsService.sendVerificationCode(
    '+213555123456',
    '123456'
  );
  
  console.log('SMS Test Result:', testResult);
  return testResult;
}