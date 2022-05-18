export interface OTP {
  otp: string;
  expiryTime: number;
  isUsed: boolean;
  userEmail: string;
  userID: string;
}
