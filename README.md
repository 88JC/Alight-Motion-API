# Alight Motion PRO API - Dokumentasi & SDK Client

Repositori resmi berisi panduan integrasi, modul SDK (Python & TypeScript), serta script bot siap pakai untuk berinteraksi dengan **Alight Motion Pro Upgrade API**.

---

## Alur Singkat Integrasi

1. **Kirim Verifikasi**: Panggil `POST /api/auth/send-link` dengan email target.
2. **Salin Link Email**: Pengguna membuka email, lalu menyalin tautan tombol verifikasi (jangan dibuka di browser).
3. **Eksekusi Pro**: Kirim email dan URL tautan tersebut ke `POST /api/subscription/upgrade`. Akun langsung aktif Pro.

---

## Tingkat Akses (Tiers)

- **Free Tier (Publik)**:
  Bisa langsung digunakan tanpa API key pribadi (cukup kirim header `x-api-key: free` atau kosongkan header). Dibatasi maksimal **10 kali upgrade per hari per users**.
- **Private Tier**:
  Menggunakan API key pribadi (`am_live_...`). Kuota mandiri dari admin, dan **bebas dari cooldown/rate-limit email spam**.

---

## Panduan Lengkap

- 📖 **[Panduan Integrasi API (`docs/USER.md`)](./docs/USER.md)**:
  Spesifikasi lengkap endpoint `/api/*`, format payload, contoh cURL, dan tabel penanganan kode error.
- 🛠️ **[Panduan Skrip & Bot Helper (`docs/SCRIPTS_GUIDE.md`)](./docs/SCRIPTS_GUIDE.md)**:
  Cara menjalankan tool CLI terminal, import SDK class, dan konfigurasi bot Telegram / Discord.

---

## File Siap Pakai di Folder `examples/`

| File | Bahasa / Runtime | Keterangan |
| :--- | :--- | :--- |
| **[`cli.js`](./examples/cli.js)** | Node.js (v18+) / Bun | CLI interaktif JavaScript tanpa dependensi npm (Zero dependencies). |
| **[`interactive-cli.py`](./examples/interactive-cli.py)** | Python 3 | CLI interaktif Python untuk terminal. |
| **[`client.ts`](./examples/client.ts)** | TypeScript / JS | Class SDK client untuk Node.js, Bun, dan bot Discord. |
| **[`client.py`](./examples/client.py)** | Python 3 | Class SDK client untuk Python (FastAPI, Flask, bot). |
| **[`discord_bot_example.ts`](./examples/discord_bot_example.ts)** | TypeScript (`discord.js v14`) | Bot Discord dengan Slash Commands & Modal Form input link privat. |
| **[`telegram_bot_example.py`](./examples/telegram_bot_example.py)** | Python (`telebot`) | Bot Telegram interaktif siap jalan. |

---

## Quick Start CLI

Tersedia tool CLI terminal siap pakai tanpa perlu menulis kode integrasi manual:

### Versi Node.js / Bun:
```bash
node examples/cli.js
# atau: bun examples/cli.js
```

### Versi Python:
```bash
pip install requests
python examples/interactive-cli.py
```

---

## Quick Example (SDK)

### TypeScript:
```typescript
import { AlightMotionAPI } from './examples/client';

const api = new AlightMotionAPI('https://api.wky.me', 'am_live_xxxxxxxx');

// Kirim link verifikasi ke email
await api.sendVerificationLink('user@gmail.com');

// Upgrade akun setelah link disalin dari email
const res = await api.upgradeToPro('user@gmail.com', 'https://alightcreative.com?link=...', '2_bulan');
console.log(res.message);
```

### Python:
```python
from examples.client import AlightMotionAPI

api = AlightMotionAPI("https://api.wky.me", "am_live_xxxxxxxx")

# Kirim link verifikasi ke email
api.send_verification_link("user@gmail.com")

# Upgrade akun setelah link disalin dari email
res = api.upgrade_to_pro("user@gmail.com", "https://alightcreative.com?link=...", "2_bulan")
print(res.get("message"))
```

---

## Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to check the [issues page](https://github.com/88JC/Alight-Motion-API/issues) or submit a pull request.

---

## License

This project is open-sourced under the MIT License - see the [MIT License](LICENSE) file for details.