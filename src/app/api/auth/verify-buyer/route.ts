import { NextResponse } from 'next/server';
import { findBuyerByEmail } from '@/lib/serverBuyerStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'invalid_email',
          message: 'Format email tidak valid.' 
        },
        { status: 400 }
      );
    }

    const buyer = await findBuyerByEmail(email);

    if (buyer) {
      return NextResponse.json({
        success: true,
        user: buyer,
        message: 'Email pembeli terverifikasi aktif.'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'not_purchased',
      message: `Email ${email} belum tercatat dalam sistem pembelian Lynk.id kami.`
    }, { status: 404 });
  } catch (err: unknown) {
    console.error('[Verify Buyer Error]:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
