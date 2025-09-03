import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendWelcomeEmail, sendEventReminder } from '@/lib/email';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { type, recipient, data } = body;

    if (!type || !recipient) {
      return NextResponse.json({ error: 'Type and recipient are required' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(recipient, data);
        break;
      case 'event-reminder':
        result = await sendEventReminder(recipient, data);
        break;
      case 'custom':
        result = await sendEmail({
          to: recipient,
          subject: data.subject,
          template: data.template,
          data: data.templateData,
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
