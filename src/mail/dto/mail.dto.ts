export class SendEmailDto {
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  from?: string;
}

export class SendPasswordResetEmailDto {
  otp: string;
  email: string;
}
