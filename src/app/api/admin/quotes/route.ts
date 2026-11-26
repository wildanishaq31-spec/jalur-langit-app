import { NextRequest, NextResponse } from 'next/server';
import { readCloudJson, writeCloudJson } from '@/lib/cloudStorage';
import { DEFAULT_INSPIRATIONAL_QUOTES } from '@/data/amalanData';
import { InspirationalQuoteItem } from '@/types';

const STORAGE_KEY = 'jalur_langit_quotes_v1';
const TEMP_FILE = 'jalur_langit_quotes_v1.json';

export async function GET() {
  try {
    const { data } = await readCloudJson<InspirationalQuoteItem[]>(STORAGE_KEY, TEMP_FILE);
    const quotes = data && data.length > 0 ? data : DEFAULT_INSPIRATIONAL_QUOTES;
    return NextResponse.json(
      { success: true, quotes },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[GET /api/admin/quotes]', err);
    return NextResponse.json(
      { success: true, quotes: DEFAULT_INSPIRATIONAL_QUOTES },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quotes } = body as { quotes: InspirationalQuoteItem[] };

    if (!Array.isArray(quotes)) {
      return NextResponse.json({ success: false, error: 'Payload harus berupa array' }, { status: 400 });
    }

    const sanitized: InspirationalQuoteItem[] = quotes.map((q, idx) => ({
      id: q.id || `q-custom-${Date.now()}-${idx}`,
      text: (q.text || '').trim(),
      author: (q.author || 'Jalur Langit').trim(),
      category: q.category || 'nasehat',
      isActive: q.isActive !== false,
      order: q.order ?? idx + 1,
      createdAt: q.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    await writeCloudJson(STORAGE_KEY, TEMP_FILE, sanitized);

    return NextResponse.json(
      { success: true, quotes: sanitized, count: sanitized.length },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[POST /api/admin/quotes]', err);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan quotes' }, { status: 500 });
  }
}
