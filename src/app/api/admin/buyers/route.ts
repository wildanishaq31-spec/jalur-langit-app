import { NextResponse } from 'next/server';
import { getAllBuyers, addOrUpdateBuyer, removeBuyer } from '@/lib/serverBuyerStore';
import { AuthUser, TIER_CONFIG, UserTier } from '@/types/auth';

export async function GET() {
  const buyers = await getAllBuyers();
  return NextResponse.json({
    success: true,
    buyers,
    total: buyers.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    const validTiers: UserTier[] = ['starter', 'ultimate', 'vip'];
    const tier: UserTier = validTiers.includes(body.tier as UserTier)
      ? (body.tier as UserTier)
      : 'ultimate';

    const newBuyerData: Partial<AuthUser> & { email: string; tier: UserTier } = {
      email,
      tier,
      tierLabel: TIER_CONFIG[tier]?.name || 'Paket Jalur Langit',
    };
    if (body.name) newBuyerData.name = body.name;
    if (body.orderId) newBuyerData.orderId = body.orderId;

    const saved = await addOrUpdateBuyer(newBuyerData as AuthUser);
    return NextResponse.json({
      success: true,
      buyer: saved
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email diperlukan' }, { status: 400 });
    }

    await removeBuyer(email);
    return NextResponse.json({ success: true, message: `Buyer ${email} dihapus` });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
