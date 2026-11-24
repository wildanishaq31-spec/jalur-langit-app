import { NextResponse } from 'next/server';
import { updateBuyerProfile } from '@/lib/serverBuyerStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentEmail = String(body.currentEmail || '').trim().toLowerCase();
    const name = typeof body.name === 'string' ? body.name.trim() : undefined;
    const newEmail = typeof body.newEmail === 'string' ? body.newEmail.trim().toLowerCase() : undefined;

    if (!currentEmail || !currentEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'invalid_email', message: 'Email akun saat ini tidak valid.' },
        { status: 400 }
      );
    }

    const result = await updateBuyerProfile(currentEmail, { name, newEmail });

    if (!result.success) {
      const status =
        result.error === 'not_found' ? 404 :
        result.error === 'email_exists' ? 409 :
        result.error === 'owner_protected' ? 403 : 400;

      return NextResponse.json(
        { success: false, error: result.error, message: result.message },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: result.message || 'Profil berhasil diperbarui.'
    });
  } catch (err: unknown) {
    console.error('[Profile Update Error]:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Terjadi kesalahan saat menyimpan profil.' },
      { status: 500 }
    );
  }
}
