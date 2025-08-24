
'use server';

import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  console.warn(
    `
    *****************************************************************
    * WARNING: Email (SMTP) environment variables are not fully set. *
    *          Emails will not be sent. Please check your .env file.  *
    *****************************************************************
    `
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587', 10),
  secure: parseInt(SMTP_PORT || '587', 10) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // If credentials aren't set, log to console instead of sending for development
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.log('--- SIMULATED EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body (HTML):');
    console.log(html);
    console.log('-----------------------');
    return { success: true, message: 'Simulated email sent successfully.' };
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // This could be exposed to the user in some cases, but for auth, we might not want to.
    throw new Error('Failed to send verification email.');
  }
}

export async function sendVerificationEmail(email: string, otp: string) {
  const subject = 'Your Verification Code for ContentGenius';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #008080;">Welcome to ContentGenius!</h2>
      <p>Your one-time password (OTP) to complete your sign-in or registration is:</p>
      <p style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px; border: 1px solid #ddd; padding: 10px; display: inline-block;">
        ${otp}
      </p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9em; color: #888;">ContentGenius | AI-Powered Content Creation</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

