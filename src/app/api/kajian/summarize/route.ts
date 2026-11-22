import { NextRequest, NextResponse } from 'next/server';
import { summarizeKajianFromUrl } from '@/utils/smartKajianSummarizer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'URL video atau link kajian wajib diisi' },
        { status: 400 }
      );
    }

    const summary = await summarizeKajianFromUrl(url.trim());

    return NextResponse.json({
      success: true,
      data: summary
    });
  } catch (error: unknown) {
    console.error('Error summarizing kajian:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Gagal menganalisis link kajian' 
      },
      { status: 500 }
    );
  }
}
