#!/usr/bin/env node

const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const DEFAULT_URL = 'https://api.wky.me';

class AlightClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey.trim();
  }

  async request(path, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  getMe() {
    return this.request('/api/me');
  }

  getPlans() {
    return this.request('/api/plans');
  }

  sendLink(email) {
    return this.request('/api/auth/send-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  upgrade(email, linkOrCode, plan = '2_bulan') {
    const isUrl = linkOrCode.startsWith('http://') || linkOrCode.startsWith('https://');
    const body = {
      email,
      plan,
      ...(isUrl ? { link: linkOrCode } : { oobCode: linkOrCode }),
    };

    return this.request('/api/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('----------------------------------------');
  console.log(' Alight Motion Pro Upgrade - CLI Helper ');
  console.log('----------------------------------------\n');

  const rawUrl = await rl.question(`Base API URL [${DEFAULT_URL}]: `);
  const apiUrl = rawUrl.trim() || DEFAULT_URL;

  const rawApiKey = (await rl.question('API Key kamu (am_live_... atau Enter / ketik "free" untuk Free Tier): ')).trim();
  const apiKey = rawApiKey.toLowerCase() === 'free' ? 'free' : rawApiKey;

  const client = new AlightClient(apiUrl, apiKey);

  console.log('\nCek akun...');
  const me = await client.getMe();
  if (!me.success) {
    console.log(`Gagal koneksi/cek akun: ${me.error || 'Key tidak valid'}`);
    rl.close();
    return;
  }

  const user = me.data || {};
  if (user.tier) {
    console.log(`\nStatus     : ${user.tier}`);
    console.log(`Sisa hari  : ${user.remaining_today} / ${user.daily_limit} upgrade`);
    console.log(`IP         : ${user.ip}`);
  } else {
    console.log(`Halo, ${user.name || 'User'}!`);
    console.log(`Sisa kuota : ${user.remaining_quota}`);
    console.log(`Masa aktif : ${user.expires_at || 'Lifetime'}`);
  }

  while (true) {
    console.log('\nPilih aksi:');
    console.log('1. Cek sisa kuota');
    console.log('2. Lihat daftar paket durasi');
    console.log('3. Upgrade akun Alight Motion');
    console.log('4. Keluar');

    const opt = (await rl.question('Pilih [1-4]: ')).trim();

    if (opt === '1') {
      const cur = await client.getMe();
      if (!cur.success) {
        console.log(`Error: ${cur.error}`);
        continue;
      }
      const d = cur.data || {};
      if (d.tier) {
        console.log(`\nStatus     : ${d.tier}`);
        console.log(`Sisa hari  : ${d.remaining_today} / ${d.daily_limit} upgrade`);
        console.log(`Terpakai   : ${d.used_today}`);
        console.log(`IP         : ${d.ip}`);
        console.log(`Catatan    : ${d.note || '-'}`);
      } else {
        console.log(`\nAkun       : ${d.name}`);
        console.log(`Sisa kuota : ${d.remaining_quota}`);
        console.log(`Total jadi : ${d.total_created} akun`);
        console.log(`Masa aktif : ${d.expires_at || 'Lifetime'}`);
      }
    } else if (opt === '2') {
      const plans = await client.getPlans();
      if (!plans.success) {
        console.log('Gagal memuat paket.');
        continue;
      }
      console.log('\nPilihan durasi:');
      for (const p of plans.data) {
        console.log(`- ${p.id} -> aktif s/d ${p.label}`);
      }
    } else if (opt === '3') {
      console.log('\n[Langkah 1] Kirim link ke email');
      const email = (await rl.question('Masukkan email target: ')).trim();
      if (!email.includes('@')) {
        console.log('Format email salah.');
        continue;
      }

      console.log(`Kirim link ke ${email}...`);
      const sendRes = await client.sendLink(email);
      if (!sendRes.success) {
        console.log(`Gagal kirim link: ${sendRes.error}`);
        continue;
      }

      console.log(`Link sukses terkirim ke ${email}.`);
      console.log('\n[Langkah 2] Buka email target (cek inbox / spam)');
      console.log("PENTING: Jangan buka link di browser. Cukup klik kanan / tahan tombol, lalu pilih 'Copy Link Address'.");

      const link = (await rl.question('Paste URL link-nya di sini: ')).trim();
      if (!link) {
        console.log('Link kosong, proses dibatalkan.');
        continue;
      }

      console.log('\nPilih paket durasi:');
      console.log('1. 2_bulan  (Aktif s/d Okt 2026) [Rekomendasi]');
      console.log('2. 6_bulan  (Aktif s/d Feb 2027)');
      console.log('3. 11_bulan (Aktif s/d Jul 2027)');
      console.log('4. 12_bulan (Aktif s/d Agu 2027)');

      const pOpt = (await rl.question('Pilihan [1/2/3/4, default 1]: ')).trim();
      const planMap = { '1': '2_bulan', '2': '6_bulan', '3': '11_bulan', '4': '12_bulan' };
      const selectedPlan = planMap[pOpt] || '2_bulan';

      console.log(`\nLagi proses upgrade ke paket ${selectedPlan}...`);
      const res = await client.upgrade(email, link, selectedPlan);

      if (res.success) {
        const d = res.data;
        console.log('\n----------------------------------------');
        console.log('BERHASIL! Akun target udah jadi Pro.');
        console.log(`Email      : ${d.email}`);
        console.log(`Paket      : ${d.plan}`);
        console.log(`Aktif s/d  : ${d.expires_estimated}`);
        console.log(`Sisa kuota : ${d.remaining_quota}`);
        console.log('----------------------------------------');
      } else {
        console.log(`Gagal upgrade: ${res.error}`);
        if (res.detail) console.log(`Detail: ${res.detail}`);
      }
    } else if (opt === '4') {
      console.log('Keluar. Sampai jumpa!');
      break;
    } else {
      console.log('Pilihan salah, coba lagi.');
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
