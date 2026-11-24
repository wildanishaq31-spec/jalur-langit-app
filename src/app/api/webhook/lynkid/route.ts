import { NextResponse } from 'next/server';
import { addOrUpdateBuyer, determineTierFromLynkData } from '@/lib/serverBuyerStore';
import { AuthUser, TIER_CONFIG } from '@/types/auth';

/**
 * Endpoint Webhook Lynk.id Otomatis:
 * URL: https://jalur-langit-app.vercel.app/api/webhook/lynkid
 * 
 * Alur:
 * 1. Pembeli membeli paket di Lynk.id.
 * 2. Lynk.id mengirim HTTP POST ke URL ini dengan rincian pembelian.
 * 3. Server memproses email, nama, dan mendeteksi paketnya (Starter/Ultimate/VIP).
 * 4. Pembeli otomatis tercatat di Whitelist Server!
 * 5. Saat pembeli membuka PWA dan login dengan email tersebut, akses langsung aktif 100%!
 */

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Lynk.id Automatic Access Webhook - Jalur Langit PWA',
    timestamp: new Date().toISOString(),
    message: 'Webhook endpoint aktif dan siap menerima data pembelian dari Lynk.id.'
  });
}

// Helper fungsi rekursif untuk mencari nilai berdasarkan kemungkinan key nama
function findDeepValue(obj: unknown, targetKeys: string[]): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const record = obj as Record<string, unknown>;

  for (const k of Object.keys(record)) {
    const val = record[k];
    if (targetKeys.includes(k.toLowerCase()) && typeof val === 'string' && val.trim()) {
      return val.trim();
    }
    if (val && typeof val === 'object') {
      const found = findDeepValue(val, targetKeys);
      if (found) return found;
    }
  }
  return undefined;
}

// Helper untuk menemukan email apapun di dalam payload JSON secara menyeluruh
function findAnyEmail(obj: unknown): string | undefined {
  const jsonStr = JSON.stringify(obj || {});
  const emailMatch = jsonStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0].trim().toLowerCase() : undefined;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    console.log('[Lynk.id Webhook Incoming Payload]:', JSON.stringify(payload));

    // 1. Ekstraksi Email Pembeli (Mendukung format standar Lynk.id data.message_data, dll)
    const rawEmail = 
      payload.data?.message_data?.customer?.email ||
      payload.data?.customer?.email ||
      payload.customer?.email ||
      payload.email ||
      payload.buyer_email ||
      payload.customer_email ||
      payload.data?.email ||
      findDeepValue(payload, ['email', 'buyer_email', 'customer_email']) ||
      findAnyEmail(payload) ||
      '';

    const email = String(rawEmail).trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'invalid_email',
          message: 'Payload tidak memiliki email pembeli yang valid.',
          receivedPayload: payload
        },
        { status: 400 }
      );
    }

    // 2. Ekstraksi Nama Pembeli
    const name = 
      payload.data?.message_data?.customer?.name ||
      payload.data?.customer?.name ||
      payload.customer?.name ||
      payload.name ||
      payload.buyer_name ||
      payload.customer_name ||
      findDeepValue(payload, ['name', 'buyer_name', 'customer_name', 'fullname']) ||
      email.split('@')[0];

    // 3. Ekstraksi Nama Produk & Harga untuk Menentukan Tier
    const productName = 
      payload.data?.message_data?.items?.[0]?.title ||
      payload.data?.message_data?.items?.[0]?.name ||
      payload.items?.[0]?.title ||
      payload.items?.[0]?.name ||
      payload.product_name ||
      payload.item_name ||
      findDeepValue(payload, ['title', 'product_name', 'item_name', 'product']) ||
      '';

    const rawAmount = 
      payload.data?.message_data?.totals?.grandTotal ||
      payload.data?.message_data?.totals?.totalPrice ||
      payload.data?.message_data?.items?.[0]?.price ||
      payload.amount ||
      payload.price ||
      payload.total ||
      payload.items?.[0]?.price ||
      0;

    const amount = Number(rawAmount) || 0;

    // Tentukan Tier secara otomatis: Starter / Ultimate / VIP
    const tier = determineTierFromLynkData(productName, amount);

    const orderId = 
      payload.data?.message_data?.refId ||
      payload.data?.message_id ||
      payload.order_id || 
      payload.invoice_number || 
      payload.id || 
      `LYNK-AUTO-${Date.now().toString().slice(-6)}`;

    const newBuyer: AuthUser = {
      email,
      name: String(name),
      tier,
      tierLabel: TIER_CONFIG[tier].name,
      purchasedAt: new Date().toISOString(),
      orderId: String(orderId)
    };

    // Simpan otomatis ke database whitelist server
    const savedBuyer = await addOrUpdateBuyer(newBuyer);

    console.log(`[Lynk.id Webhook Sukses] Akses otomatis diberikan untuk ${email} (Tier: ${tier})`);

    return NextResponse.json({
      success: true,
      message: `Alhamdulillah! Akses ${TIER_CONFIG[tier].name} untuk ${email} berhasil diaktifkan otomatis.`,
      buyer: savedBuyer
    });
  } catch (err: unknown) {
    console.error('[Lynk.id Webhook Error]:', err);
    return NextResponse.json(
      { 
        success: false, 
        error: 'server_error', 
        message: 'Terjadi kesalahan saat memproses webhook Lynk.id.' 
      },
      { status: 500 }
    );
  }
}
