# Panduan Script & Bot Helper

Di folder `examples/` sudah disediakan beberapa script siap pakai tanpa perlu nulis request HTTP dari nol.

---

## File yang Tersedia di `examples/`

| File | Bahasa | Fungsi |
| :--- | :--- | :--- |
| `interactive-cli.py` | Python | Tool terminal interaktif (Python). Cek kuota, kirim email, dan upgrade akun via terminal. |
| `cli.js` | Node.js / Bun | Tool terminal interaktif (JavaScript). Tanpa dependensi npm, langsung jalan pakai `node` atau `bun`. |
| `client.py` | Python | Modul SDK class. Tinggal di-import ke script Python atau bot Telegram kamu. |
| `client.ts` | TypeScript | Modul SDK class untuk Node.js / Bun / bot Discord. |
| `telegram_bot_example.py` | Python | Contoh bot Telegram lengkap siap jalan pakai Telebot. |
| `discord_bot_example.ts` | TypeScript | Contoh bot Discord lengkap siap jalan pakai discord.js v14 (Slash command + Modal input link). |

---

## 1. Menjalankan CLI Terminal (`interactive-cli.py`)

Cocok buat yang mau pakai langsung lewat terminal tanpa perlu coding.

1. Install modul `requests`:
   ```bash
   pip install requests
   ```
2. Jalankan:
   ```bash
   python examples/interactive-cli.py
   ```
3. Masukkan URL API dan API Key kamu, lalu pilih menu:
   - Menu 1: Cek sisa kuota dan masa aktif.
   - Menu 2: Cek daftar paket durasi.
   - Menu 3: Masukkan email target -> buka email -> paste link -> akun jadi Pro.
### Alternatif: Menjalankan CLI Versi JavaScript (`cli.js`)
Nggak butuh install package npm apa pun (zero dependencies), sudah pakai native `readline/promises` dan `fetch` bawaan Node.js (v18+) atau Bun.

```bash
node examples/cli.js
# atau
bun examples/cli.js
```

---

## 2. Menggunakan SDK Python (`client.py`)

Salin `client.py` ke project kamu, lalu pakai seperti ini:

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

---

## 3. Menggunakan SDK TypeScript (`client.ts`)

Salin `client.ts` ke project Node.js / Bun kamu:

```typescript
import { AlightMotionAPI } from './client';

const api = new AlightMotionAPI('https://api.wky.me', 'am_live_xxxx');

async function main() {
  // Cek kuota
  const me = await api.getQuota();
  console.log('Sisa kuota:', me.data?.remaining_quota);

  // Kirim link
  await api.sendVerificationLink('user@gmail.com');

  // Upgrade
  const res = await api.upgradeToPro('user@gmail.com', 'https://alightcreative.com?link=...', '2_bulan');
  console.log(res.message);
}

main();
```

---

## 4. Bot Telegram (`telegram_bot_example.py`)

1. Install dependensi:
   ```bash
   pip install pyTelegramBotAPI requests
   ```
2. Buka `examples/telegram_bot_example.py`, isi `BOT_TOKEN`, `API_URL`, dan `USER_API_KEY`.
3. Jalankan:
   ```bash
   python examples/telegram_bot_example.py
   ```

---

## 5. Bot Discord (`discord_bot_example.ts`)

Menggunakan `discord.js v14`. Dilengkapi Discord Modal Form, jadi link verifikasi yang dipaste member bersifat privat dan aman dari chat publik.

1. Install dependensi:
   ```bash
   bun add discord.js
   # atau: npm install discord.js
   ```
2. Buka `examples/discord_bot_example.ts`, isi `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `API_URL`, dan `USER_API_KEY`.
3. Jalankan:
   ```bash
   bun run examples/discord_bot_example.ts
   ```
