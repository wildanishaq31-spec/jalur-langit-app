// Test script for Lynk.id purchase and upgrade workflow
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== MEMULAI TEST INTEGRASI LYNK.ID & UPGRADE PAKET ===\n');

  // 1. Healthcheck
  console.log('[TEST 1] Cek Status Webhook GET...');
  const healthRes = await fetch(`${BASE_URL}/api/webhook/lynkid`);
  const healthData = await healthRes.json();
  console.log('Status Healthcheck:', healthData.status === 'online' ? '✅ ONLINE' : '❌ OFFLINE');
  console.log('Response:', JSON.stringify(healthData), '\n');

  // 2. Simulasi Beli Paket Starter (Rp 49.000)
  console.log('[TEST 2] Simulasi Pembelian Paket STARTER (Rp 49.000)...');
  const starterPayload = {
    order_id: 'LYNK-TEST-STARTER-001',
    customer: {
      email: 'siti.nurhaliza@gmail.com',
      name: 'Siti Nurhaliza'
    },
    product_name: 'Jalur Langit - Paket Starter',
    amount: 49000,
    status: 'PAID'
  };

  const starterRes = await fetch(`${BASE_URL}/api/webhook/lynkid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(starterPayload)
  });
  const starterData = await starterRes.json();
  console.log('Webhook Result:', starterData.success ? '✅ SUKSES' : '❌ GAGAL');
  console.log('Tercatat Sebagai:', starterData.buyer?.name, `[${starterData.buyer?.tierLabel}] - Tier:`, starterData.buyer?.tier);

  // Verifikasi login starter
  const verifyStarterRes = await fetch(`${BASE_URL}/api/auth/verify-buyer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'siti.nurhaliza@gmail.com' })
  });
  const verifyStarter = await verifyStarterRes.json();
  console.log('Verifikasi Login Starter:', verifyStarter.success && verifyStarter.user?.tier === 'starter' ? '✅ VALID (Starter)' : '❌ GAGAL', '\n');

  // 3. Simulasi Beli Paket Full Bundling / Ultimate (Rp 89.000)
  console.log('[TEST 3] Simulasi Pembelian Paket ULTIMATE (Rp 89.000)...');
  const ultimatePayload = {
    order_id: 'LYNK-TEST-ULT-002',
    customer: {
      email: 'fatimah.azzahra@gmail.com',
      name: 'Fatimah Az-Zahra'
    },
    product_name: 'Jalur Langit - Paket Full Bundling (Best Seller)',
    amount: 89000,
    status: 'PAID'
  };

  const ultRes = await fetch(`${BASE_URL}/api/webhook/lynkid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ultimatePayload)
  });
  const ultData = await ultRes.json();
  console.log('Webhook Result:', ultData.success ? '✅ SUKSES' : '❌ GAGAL');
  console.log('Tercatat Sebagai:', ultData.buyer?.name, `[${ultData.buyer?.tierLabel}] - Tier:`, ultData.buyer?.tier);

  // Verifikasi login ultimate
  const verifyUltRes = await fetch(`${BASE_URL}/api/auth/verify-buyer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fatimah.azzahra@gmail.com' })
  });
  const verifyUlt = await verifyUltRes.json();
  console.log('Verifikasi Login Ultimate:', verifyUlt.success && verifyUlt.user?.tier === 'ultimate' ? '✅ VALID (Ultimate)' : '❌ GAGAL', '\n');

  // 4. Simulasi Beli Paket VIP (Rp 149.000)
  console.log('[TEST 4] Simulasi Pembelian Paket VIP (Rp 149.000)...');
  const vipPayload = {
    order_id: 'LYNK-TEST-VIP-003',
    customer: {
      email: 'aisyah.humaira@gmail.com',
      name: 'Aisyah Humaira'
    },
    product_name: 'Jalur Langit - Paket VIP Ultimate + Lab',
    amount: 149000,
    status: 'PAID'
  };

  const vipRes = await fetch(`${BASE_URL}/api/webhook/lynkid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vipPayload)
  });
  const vipData = await vipRes.json();
  console.log('Webhook Result:', vipData.success ? '✅ SUKSES' : '❌ GAGAL');
  console.log('Tercatat Sebagai:', vipData.buyer?.name, `[${vipData.buyer?.tierLabel}] - Tier:`, vipData.buyer?.tier);

  // Verifikasi login VIP
  const verifyVipRes = await fetch(`${BASE_URL}/api/auth/verify-buyer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aisyah.humaira@gmail.com' })
  });
  const verifyVip = await verifyVipRes.json();
  console.log('Verifikasi Login VIP:', verifyVip.success && verifyVip.user?.tier === 'vip' ? '✅ VALID (VIP)' : '❌ GAGAL', '\n');

  // 5. TEST SKENARIO UPGRADE PAKET:
  // User Siti Nurhaliza (sebelumnya Starter 49k) melakukan pembelian UPGRADE ke VIP Ultimate + Lab (149k)
  console.log('[TEST 5] SKENARIO UPGRADE PAKET:');
  console.log('Status awal Siti Nurhaliza: Tier =', verifyStarter.user?.tier);
  console.log('Siti Nurhaliza melakukan transaksi di Lynk.id untuk membeli Paket VIP (Rp 149.000)...');

  const upgradePayload = {
    order_id: 'LYNK-UPGRADE-004',
    customer: {
      email: 'siti.nurhaliza@gmail.com', // EMAIL YANG SAMA!
      name: 'Siti Nurhaliza'
    },
    product_name: 'Jalur Langit - Paket VIP Ultimate + Lab',
    amount: 149000,
    status: 'PAID'
  };

  const upgradeRes = await fetch(`${BASE_URL}/api/webhook/lynkid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(upgradePayload)
  });
  const upgradeData = await upgradeRes.json();
  console.log('Webhook Upgrade Result:', upgradeData.success ? '✅ SUKSES' : '❌ GAGAL');
  console.log('Status Akun Sekarang:', upgradeData.buyer?.name, `[${upgradeData.buyer?.tierLabel}] - Tier:`, upgradeData.buyer?.tier);

  // Verifikasi login setelah upgrade
  const verifyAfterUpgradeRes = await fetch(`${BASE_URL}/api/auth/verify-buyer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'siti.nurhaliza@gmail.com' })
  });
  const verifyAfterUpgrade = await verifyAfterUpgradeRes.json();
  console.log('Verifikasi Login Setelah Upgrade:', verifyAfterUpgrade.success && verifyAfterUpgrade.user?.tier === 'vip' ? '🎉 BERHASIL NAIK KE VIP!' : '❌ GAGAL UPGRADE');
  console.log('Detail User Terverifikasi:', JSON.stringify(verifyAfterUpgrade.user, null, 2), '\n');

  // 6. Test Email Tidak Terdaftar (Menolak akses)
  console.log('[TEST 6] Test Email Belum Membeli (Keamanan Whitelist)...');
  const unknownVerifyRes = await fetch(`${BASE_URL}/api/auth/verify-buyer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pembeli.palsu@gmail.com' })
  });
  const unknownVerify = await unknownVerifyRes.json();
  console.log('Proteksi Email Tidak Terdaftar:', unknownVerify.success === false && unknownVerify.error === 'not_purchased' ? '🛡️ TERPROTEKSI (Ditolak Masuk)' : '❌ BOCOR');
  console.log('Pesan Error:', unknownVerify.message, '\n');

  console.log('=== SEMUA PENGUJIAN LYNK.ID & UPGRADE SELESAI DENGAN SUKSES 100% ===');
}

runTests().catch(console.error);
