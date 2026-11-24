import { NextResponse } from 'next/server';

// Versi aplikasi diperbarui otomatis untuk deteksi pembaruan klien
export const APP_BUILD_VERSION = '3.3.0-20261124-2015';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      version: APP_BUILD_VERSION,
      timestamp: Date.now(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
