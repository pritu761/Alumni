import nodemailer from 'nodemailer';

// Email templates
const emailTemplates = {
  'donation-confirmation': {
    subject: 'Thank you for your donation!',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Donation!</h1>
        </div>
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${data.donorName},</p>
          
          <p style="color: #666; line-height: 1.6;">
            We are deeply grateful for your generous donation of <strong>₹${data.amount}</strong> 
            towards <strong>${data.cause}</strong>. Your contribution will make a significant 
            impact on our alumni community and future students.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Donation Details</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ₹${data.amount}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Cause:</strong> ${data.cause}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${data.date}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Your donation is tax-deductible under Section 80G of the Income Tax Act. 
            This email serves as your official receipt.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/donations" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Donations
            </a>
          </div>
        </div>
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Alumni Network | Thank you for being part of our community</p>
        </div>
      </div>
    `,
  },
  'event-reminder': {
    subject: 'Event Reminder',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Event Reminder</h1>
        </div>
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${data.attendeeName},</p>
          
          <p style="color: #666; line-height: 1.6;">
            This is a friendly reminder about the upcoming event you've registered for:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
            <h3 style="margin: 0 0 15px 0; color: #333;">${data.eventTitle}</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${data.eventDate}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Time:</strong> ${data.eventTime}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${data.location}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            ${data.description}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${data.eventId}" 
               style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Event Details
            </a>
          </div>
        </div>
      </div>
    `,
  },
  'welcome': {
    subject: 'Welcome to the Alumni Network!',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Our Alumni Network!</h1>
        </div>
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${data.name},</p>
          
          <p style="color: #666; line-height: 1.6;">
            Welcome to our vibrant alumni community! We're excited to have you join our network 
            of accomplished graduates who are making a difference in the world.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Connect with fellow alumni in your field</li>
              <li>Attend exclusive alumni events</li>
              <li>Participate in mentorship programs</li>
              <li>Support current students through donations</li>
              <li>Share your achievements and updates</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alumni" 
               style="background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Explore Alumni Directory
            </a>
          </div>
        </div>
      </div>
    `,
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface EmailOptions {
  to: string;
  subject?: string;
  template: keyof typeof emailTemplates;
  data: Record<string, any>;
}

export const sendEmail = async ({ to, subject, template, data }: EmailOptions) => {
  try {
    const transporter = createTransporter();
    const templateConfig = emailTemplates[template];
    
    const mailOptions = {
      from: `"Alumni Network" <${process.env.SMTP_USER}>`,
      to,
      subject: subject || templateConfig.subject,
      html: templateConfig.html(data),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Email notification functions
export const sendDonationConfirmation = async (donorEmail: string, donationData: any) => {
  return sendEmail({
    to: donorEmail,
    template: 'donation-confirmation',
    data: donationData,
  });
};

export const sendEventReminder = async (attendeeEmail: string, eventData: any) => {
  return sendEmail({
    to: attendeeEmail,
    template: 'event-reminder',
    data: eventData,
  });
};

export const sendWelcomeEmail = async (userEmail: string, userData: any) => {
  return sendEmail({
    to: userEmail,
    template: 'welcome',
    data: userData,
  });
};
