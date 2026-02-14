import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

type Sender = {
  email: string;
  name: string;
};

type Recipients = {
  email: string;
}[];

@Injectable()
export class MailerService {
  private readonly sender: Sender;
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('MAILER_HOST');
    const port = this.configService.get<number>('MAILER_PORT');
    const user = this.configService.get<string>('MAILER_USER_NAME');
    const pass = this.configService.get<string>('MAILER_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: host || 'sandbox.smtp.mailtrap.io',
      port: port || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: user || '',
        pass: pass || '',
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    this.sender = {
      email:
        this.configService.get<string>('MAILER_EMAIL') ||
        'st-markos-library.com',
      name:
        this.configService.get<string>('MAILER_NAME') || 'St Markos Library',
    };

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP server is ready to send emails', success);
      }
    });
  }

  async sendVerificationEmail(
    name: string,
    toMail: string,
    verificationCode: string,
  ) {
    const recipients: Recipients = [
      {
        email: toMail,
      },
    ];

    const subject = 'Verify your account - St. Markos Library';

    const content = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                            <h2 style="color: #2c3e50;">St. Markos Library</h2>
                            <p>Welcome ${name}! Use the verification code below to complete your registration:</p>
                            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                                ${verificationCode}
                            </div>
                            <p>This code will expire in 10 minutes.</p>
                            <hr />
                        <p style="font-size: 14px; color: #d9534f; font-weight: bold;">
                            ⚠️ Don't share this code with anyone.
                        </p>    
                </div>
        `;

    return await this.sendEmail(recipients, subject, content);
  }

  private async sendEmail(
    recipients: Recipients,
    subject: string,
    content: string,
  ) {
    try {
      console.log(
        'Attempting to send email to:',
        recipients.map((r) => r.email).join(', '),
      );
      const info = await this.transporter.sendMail({
        from: `"${this.sender.name}" <${this.sender.email}>`,
        to: recipients.map((r) => r.email).join(', '),
        subject,
        html: content,
      });
      console.log(`Email sent successfully! to: ${info.accepted.join(', ')}`);
    } catch (error) {
      console.error(
        `Error sending email to ${JSON.stringify(recipients)} -- error:`,
        error,
      );
      throw error; // Re-throw to let caller know it failed
    }
  }
}
