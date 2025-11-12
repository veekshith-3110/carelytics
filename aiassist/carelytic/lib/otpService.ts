// OTP Service for authentication
// In production, this would call your backend API

export interface OTPService {
  sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; otp?: string }>;
  verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }>;
  canResend(phoneNumber: string): boolean;
  getTimeRemaining(phoneNumber: string): number;
}

// Mock OTP Service - Replace with real API calls
class MockOTPService implements OTPService {
  private otpStore: Map<string, { otp: string; expiresAt: number; lastSent: number }> = new Map();
  private readonly RESEND_COOLDOWN = 30 * 1000; // 30 seconds cooldown between resends
  private readonly OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes expiry

  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; otp?: string }> {
    // Validate phone number
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit phone number',
      };
    }

    // Check if we can resend (cooldown check)
    const stored = this.otpStore.get(phoneNumber);
    if (stored && Date.now() - stored.lastSent < this.RESEND_COOLDOWN) {
      const remaining = Math.ceil((this.RESEND_COOLDOWN - (Date.now() - stored.lastSent)) / 1000);
      return {
        success: false,
        message: `Please wait ${remaining} seconds before requesting a new OTP`,
      };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.OTP_EXPIRY;
    const lastSent = Date.now();

    // Store OTP
    this.otpStore.set(phoneNumber, { otp, expiresAt, lastSent });

    // In production, send OTP via SMS using services like:
    // - Twilio
    // - AWS SNS
    // - Firebase Phone Auth
    // - Your backend API

    // OTP generated: ${otp} (for demo purposes only - remove in production)
    if (__DEV__) {
      console.log(`[MOCK] OTP for ${phoneNumber}: ${otp}`);
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: `OTP sent to ${phoneNumber}. For demo, OTP is: ${otp}`,
      otp, // Include OTP in response for demo purposes only
    };
  }

  canResend(phoneNumber: string): boolean {
    const stored = this.otpStore.get(phoneNumber);
    if (!stored) return true;
    return Date.now() - stored.lastSent >= this.RESEND_COOLDOWN;
  }

  getTimeRemaining(phoneNumber: string): number {
    const stored = this.otpStore.get(phoneNumber);
    if (!stored) return 0;
    const remaining = this.RESEND_COOLDOWN - (Date.now() - stored.lastSent);
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    const stored = this.otpStore.get(phoneNumber);

    if (!stored) {
      return {
        success: false,
        message: 'No OTP found. Please request a new OTP.',
      };
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(phoneNumber);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      };
    }

    if (stored.otp !== otp) {
      // Track failed attempts (optional - for security)
      return {
        success: false,
        message: 'Invalid OTP. Please try again.',
      };
    }

    // OTP verified - clear it from store
    this.otpStore.delete(phoneNumber);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Phone number verified successfully!',
    };
  }
}

// Production OTP Service - Replace with your backend API
class ProductionOTPService implements OTPService {
  private apiUrl = 'https://your-api.com'; // Replace with your API URL

  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to send OTP',
        };
      }

      return {
        success: true,
        message: data.message || 'OTP sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  }

  canResend(phoneNumber: string): boolean {
    // In production, this would check with your backend
    return true;
  }

  getTimeRemaining(phoneNumber: string): number {
    // In production, this would check with your backend
    return 0;
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Invalid OTP',
        };
      }

      return {
        success: true,
        message: data.message || 'Phone number verified',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to verify OTP',
      };
    }
  }
}

// Export service (switch to ProductionOTPService in production)
export const otpService: OTPService = new MockOTPService();
// export const otpService: OTPService = new ProductionOTPService();

// Convenience functions for easy access
export const sendOTP = (phoneNumber: string) => otpService.sendOTP(phoneNumber);
export const verifyOTP = (phoneNumber: string, otp: string) => otpService.verifyOTP(phoneNumber, otp);
export const canResendOTP = (phoneNumber: string) => otpService.canResend(phoneNumber);
export const getResendTimeRemaining = (phoneNumber: string) => otpService.getTimeRemaining(phoneNumber);

