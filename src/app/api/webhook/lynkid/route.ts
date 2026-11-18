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

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));

    // Ekstraksi email pembeli dari berbagai variasi payload Lynk.id
    const rawEmail = 
      payload.email ||
      payload.buyer_email ||
      payload.customer_email ||
      payload.customer?.email ||
      payload.data?.email ||
      payload.data?.customer?.email ||
      '';

    const email = String(rawEmail).trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'invalid_email',
          message: 'Payload tidak memiliki email pembeli yang valid.' 
        },
        { status: 400 }
      );
    }

    // Ekstraksi nama pembeli
    const name = 
      payload.name ||
      payload.buyer_name ||
      payload.customer_name ||
      payload.customer?.name ||
      payload.data?.name ||
      payload.data?.customer?.name ||
      email.split('@')[0];

    // Ekstraksi nama produk & harga untuk menentukan tier
    const productName = 
      payload.product_name ||
      payload.item_name ||
      payload.items?.[0]?.name ||
      payload.data?.product_name ||
      '';

    const rawAmount = 
      payload.amount ||
      payload.price ||
      payload.total ||
      payload.items?.[0]?.price ||
      0;

    const amount = Number(rawAmount) || 0;

    // Tentukan Tier secara otomatis: Starter (49rb) / Ultimate (89rb) / VIP (149rb)
    const tier = determineTierFromLynkData(productName, amount);

    const orderId = 
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
