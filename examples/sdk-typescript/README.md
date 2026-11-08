# Alight Motion SDK (TypeScript / JavaScript)

Modul client SDK TypeScript/JavaScript siap pakai untuk berinteraksi dengan **Alight Motion API**. Dapat digunakan di Node.js (v18+), Bun, Deno, maupun integrasi backend (Express, Nest, Hono, bot Discord, dll).

---

## File

- `client.ts`: Definisi class `AlightMotionAPI` serta interface data (`Plan`, `UserProfile`, `ApiResponse`).
- `example.ts`: Script demonstrasi pemanggilan method API.

---

## Cara Import & Pemakaian

```typescript
import { AlightMotionAPI } from './client';

const api = new AlightMotionAPI('https://api.wky.me', 'am_live_xxxxxxxx');

async function run() {
  // 1. Cek Kuota
  const me = await api.getQuota();
  console.log('Sisa kuota:', me.data?.remaining_quota);

  // 2. Daftar Paket
  const plans = await api.getPlans();
  console.log('Paket:', plans.data);

  // 3. Kirim Link Verifikasi ke Email
  await api.sendVerificationLink('user@gmail.com');

  // 4. Upgrade Akun ke Pro
  const res = await api.upgradeToPro(
    'user@gmail.com',
    'https://alightcreative.com?link=...',
    '2_bulan'
  );
  console.log(res.message);
}

run();
```

---

## Menjalankan Contoh Demo

Menggunakan Bun:
```bash
bun run example.ts
```

Menggunakan Node.js / npx tsx:
```bash
npx tsx example.ts
```
