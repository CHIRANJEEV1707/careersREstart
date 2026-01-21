import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'careers@letsrestart.in';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return false;
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Email send error:', error);
      return false;
    }

    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

export function generateConfirmationEmail(name: string, jobTitle: string, trackingCode: string): string {
  const trackingUrl = `${BASE_URL}/track/${trackingCode}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 20px; background-color: #f8fafc;">
      <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="padding: 32px;">
          <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #0f172a;">Application Received</h1>
          <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">Thank you for applying to REstart</p>
          
          <p style="margin: 0 0 16px; color: #334155; line-height: 1.6;">
            Hi ${name},
          </p>
          
          <p style="margin: 0 0 16px; color: #334155; line-height: 1.6;">
            We've received your application for the <strong>${jobTitle}</strong> position. Our team will review your profile and get back to you within <strong>5-7 business days</strong>.
          </p>
          
          <p style="margin: 0 0 24px; color: #334155; line-height: 1.6;">
            You can track your application status anytime:
          </p>
          
          <a href="${trackingUrl}" style="display: inline-block; background: #0085ff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
            Track Application
          </a>
          
          <p style="margin: 24px 0 0; color: #94a3b8; font-size: 12px;">
            Or copy this link: ${trackingUrl}
          </p>
        </div>
        
        <div style="padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            © ${new Date().getFullYear()} REstart. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateStatusUpdateEmail(name: string, jobTitle: string, status: string, trackingCode: string): string {
  const trackingUrl = `${BASE_URL}/track/${trackingCode}`;

  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    reviewing: {
      title: 'Application Under Review',
      message: 'Great news! Your application is now being reviewed by our team. We\'ll be in touch soon.',
      color: '#eab308',
    },
    interviewed: {
      title: 'Interview Stage',
      message: 'Congratulations! You\'ve moved to the interview stage. We\'ll reach out with next steps shortly.',
      color: '#8b5cf6',
    },
    hired: {
      title: 'Congratulations! 🎉',
      message: 'We\'re thrilled to offer you the position! Welcome to REstart. We\'ll be sending more details soon.',
      color: '#22c55e',
    },
    rejected: {
      title: 'Application Update',
      message: 'Thank you for your interest in REstart. After careful consideration, we\'ve decided to move forward with other candidates. We encourage you to apply for future openings.',
      color: '#64748b',
    },
  };

  const statusInfo = statusMessages[status] || {
    title: 'Application Update',
    message: 'Your application status has been updated.',
    color: '#0085ff',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 20px; background-color: #f8fafc;">
      <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="height: 4px; background: ${statusInfo.color};"></div>
        <div style="padding: 32px;">
          <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #0f172a;">${statusInfo.title}</h1>
          <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">${jobTitle} at REstart</p>
          
          <p style="margin: 0 0 16px; color: #334155; line-height: 1.6;">
            Hi ${name},
          </p>
          
          <p style="margin: 0 0 24px; color: #334155; line-height: 1.6;">
            ${statusInfo.message}
          </p>
          
          <a href="${trackingUrl}" style="display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
            View Application Status
          </a>
        </div>
        
        <div style="padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            © ${new Date().getFullYear()} REstart. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
