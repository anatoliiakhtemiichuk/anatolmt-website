/**
 * Contact Form API
 * POST /api/contact - Send contact/B2B inquiry email
 *
 * Handles both:
 * - B2B form (/dla-firm) - includes company fields
 * - Contact form (/contact) - personal inquiries
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available (skip during build)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Determine form type
    const isB2B = body.formType === 'b2b';

    // Validate required fields based on form type
    if (isB2B) {
      const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'message'];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `Brakuje wymaganego pola: ${field}` },
            { status: 400 }
          );
        }
      }
    } else {
      const requiredFields = ['name', 'email', 'message'];
      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `Brakuje wymaganego pola: ${field}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy adres email' },
        { status: 400 }
      );
    }

    // Build email subject and HTML content
    const subject = isB2B
      ? `Zapytanie B2B (firma) - ${body.companyName}`
      : `Zapytanie prywatne - ${body.name}`;

    const htmlContent = isB2B
      ? `
        <h2>Nowe zapytanie B2B (firma)</h2>
        <p><strong>Data i czas:</strong> ${new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}</p>
        <hr />
        <p><strong>Nazwa firmy:</strong> ${body.companyName}</p>
        <p><strong>Osoba kontaktowa:</strong> ${body.contactPerson}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Telefon:</strong> ${body.phone}</p>
        ${body.employeeCount ? `<p><strong>Liczba pracowników:</strong> ${body.employeeCount}</p>` : ''}
        <hr />
        <p><strong>Wiadomość:</strong></p>
        <p>${body.message.replace(/\n/g, '<br />')}</p>
      `
      : `
        <h2>Nowe zapytanie prywatne (osoba prywatna)</h2>
        <p><strong>Data i czas:</strong> ${new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}</p>
        <hr />
        <p><strong>Imię i nazwisko:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <hr />
        <p><strong>Wiadomość:</strong></p>
        <p>${body.message.replace(/\n/g, '<br />')}</p>
      `;

    // Check if Resend is configured
    if (!resend) {
      console.error('[contact] RESEND_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Usługa email nie jest skonfigurowana. Skontaktuj się telefonicznie.' },
        { status: 503 }
      );
    }

    // Send email via Resend
    // TODO: Change 'to' back to 'anatolmt.kontakt@gmail.com' once anatolmt.pl domain is verified in Resend
    // TEMPORARY: Using account owner's email because onboarding@resend.dev can only send to verified addresses
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'anatoliiakhtemiichuk@gmail.com',
      replyTo: body.email,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.' },
        { status: 500 }
      );
    }

    console.log('[contact] Email sent successfully:', {
      messageId: data?.id,
      formType: isB2B ? 'b2b' : 'contact',
      email: body.email,
    });

    return NextResponse.json({
      success: true,
      message: 'Wiadomość została wysłana',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
    console.error('[contact] Error:', errorMessage);

    return NextResponse.json(
      { success: false, error: 'Błąd serwera. Spróbuj ponownie później.' },
      { status: 500 }
    );
  }
}
