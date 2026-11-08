import { AlightMotionAPI } from './client';

const API_URL = process.env.ALIGHT_API_URL || 'https://api.wky.me';
const API_KEY = process.env.ALIGHT_API_KEY || 'free';

async function main() {
  const api = new AlightMotionAPI(API_URL, API_KEY);

  console.log('--- 1. Cek Kuota & Info Akun ---');
  const me = await api.getQuota();
  if (me.success && me.data) {
    if (me.data.tier) {
      console.log(`Status: ${me.data.tier}`);
      console.log(`Sisa Hari Ini: ${me.data.remaining_today} / ${me.data.daily_limit}`);
      console.log(`IP: ${me.data.ip}`);
    } else {
      console.log(`User: ${me.data.name}`);
      console.log(`Sisa Kuota: ${me.data.remaining_quota}`);
      console.log(`Masa Aktif: ${me.data.expires_at || 'Lifetime'}`);
    }
  } else {
    console.log(`Gagal cek kuota: ${me.error}`);
  }

  console.log('\n--- 2. Cek Daftar Paket ---');
  const plans = await api.getPlans();
  if (plans.success && plans.data) {
    for (const p of plans.data) {
      console.log(`- ${p.id} (label: ${p.label})`);
    }
  }

  // Contoh pengiriman link verifikasi:
  // console.log('\n--- 3. Kirim Link Verifikasi ---');
  // const sendRes = await api.sendVerificationLink('target@gmail.com');
  // console.log(sendRes);

  // Contoh eksekusi upgrade Pro:
  // console.log('\n--- 4. Eksekusi Upgrade ---');
  // const upgradeRes = await api.upgradeToPro('target@gmail.com', 'https://alightcreative.com?link=...', '2_bulan');
  // console.log(upgradeRes);
}

main().catch(console.error);
