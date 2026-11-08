# Panduan Script & Bot Helper

Di folder `examples/` sudah disediakan beberapa proyek siap pakai yang dipisah ke dalam folder mandiri, lengkap dengan file konfigurasi, dependensi, dan dokumentasi masing-masing.

---

## Folder yang Tersedia di `examples/`

| Folder | Bahasa / Runtime | Fungsi |
| :--- | :--- | :--- |
| **[`cli-node/`](../examples/cli-node/)** | Node.js / Bun | Tool terminal interaktif JavaScript zero-dependencies bawaan `readline/promises` & `fetch`. |
| **[`cli-python/`](../examples/cli-python/)** | Python 3 | Tool terminal interaktif Python untuk cek kuota dan eksekusi upgrade. |
| **[`sdk-typescript/`](../examples/sdk-typescript/)** | TypeScript / JS | Modul SDK class (`client.ts`), interface types, dan script contoh `example.ts`. |
| **[`sdk-python/`](../examples/sdk-python/)** | Python 3 | Modul SDK class (`client.py`) berbasis `requests.Session` dan script contoh `example.py`. |
| **[`discord-bot/`](../examples/discord-bot/)** | TypeScript (`discord.js v14`) | Bot Discord mandiri dengan Slash Commands, Modal Form input link privat, dan dukungan `.env`. |
| **[`telegram-bot/`](../examples/telegram-bot/)** | Python (`telebot`) | Bot Telegram mandiri dengan wizard interaktif bertahap dan dukungan `.env`. |

## Catatan API Key & Free Tier

- Jika Anda memiliki API Key pribadi, masukkan key Anda (`am_live_...`).
- **Jika tidak mempunyai API Key**: Cukup **dikosongkan (tekan Enter)** atau ketik **`free`**. Sistem otomatis beralih ke Free Tier publik (10x upgrade per hari).

---

## 1. Menjalankan CLI Terminal JavaScript (`examples/cli-node`)

Nggak butuh install package npm apa pun (zero dependencies), sudah menggunakan modul native Node.js (v18+) atau Bun.

```bash
cd examples/cli-node
node cli.js
# atau menggunakan Bun:
bun cli.js
```

---

## 2. Menjalankan CLI Terminal Python (`examples/cli-python`)

1. Pindah ke direktori dan install dependensi:
   ```bash
   cd examples/cli-python
   pip install -r requirements.txt
   ```
2. Jalankan:
   ```bash
   python cli.py
   ```
3. Masukkan Base URL API dan API Key kamu, lalu pilih aksi menu (Cek kuota, lihat paket, atau upgrade akun).

---

## 3. Menggunakan SDK TypeScript (`examples/sdk-typescript`)

Import class `AlightMotionAPI` ke dalam proyek Node.js / Bun kamu:

```typescript
import { AlightMotionAPI } from './client';

const api = new AlightMotionAPI('https://api.wky.me', 'am_live_xxxx');

async function main() {
  // Cek kuota
  const me = await api.getQuota();
  console.log('Sisa kuota:', me.data?.remaining_quota);

  // Kirim link verifikasi
  await api.sendVerificationLink('user@gmail.com');

  // Upgrade akun
  const res = await api.upgradeToPro('user@gmail.com', 'https://alightcreative.com?link=...', '2_bulan');
  console.log(res.message);
}

main();
```

Untuk mencoba demo:
```bash
cd examples/sdk-typescript
bun run example.ts
# atau: npx tsx example.ts
```

---

## 4. Menggunakan SDK Python (`examples/sdk-python`)

Salin `client.py` ke project Python kamu:

```python
from client import AlightMotionAPI

api = AlightMotionAPI("https://api.wky.me", "am_live_xxxx")

# Cek kuota
info = api.get_quota()
print("Sisa kuota:", info["data"]["remaining_quota"])

# Kirim link verifikasi ke email
api.send_verification_link("user@gmail.com")

# Eksekusi upgrade (link didapat dari email)
res = api.upgrade_to_pro("user@gmail.com", "https://alightcreative.com?link=...", "2_bulan")
print(res["message"])
```

Untuk mencoba demo:
```bash
cd examples/sdk-python
pip install -r requirements.txt
python example.py
```

---

## 5. Bot Discord (`examples/discord-bot`)

Menggunakan `discord.js v14`. Dilengkapi Discord Modal Form, jadi link verifikasi yang dipaste member bersifat privat dan aman dari chat publik.

1. Buka folder dan salin file environment:
   ```bash
   cd examples/discord-bot
   cp .env.example .env
   ```
2. Isi `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `ALIGHT_API_URL`, dan `ALIGHT_API_KEY` di `.env`.
3. Install dependensi:
   ```bash
   bun install
   # atau: npm install
   ```
4. Jalankan bot:
   ```bash
   bun run bot.ts
   # atau: npm run dev
   ```

---

## 6. Bot Telegram (`examples/telegram-bot`)

1. Buka folder dan salin file environment:
   ```bash
   cd examples/telegram-bot
   cp .env.example .env
   ```
2. Isi `TELEGRAM_BOT_TOKEN`, `ALIGHT_API_URL`, dan `ALIGHT_API_KEY` di `.env`.
3. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan:
   ```bash
   python bot.py
   ```
