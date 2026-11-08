# Alight Motion PRO API - Dokumentasi & SDK Client

Repositori resmi berisi panduan integrasi, modul SDK (Python & TypeScript), serta script bot siap pakai untuk berinteraksi dengan **Alight Motion Pro Upgrade API**.

---

## Alur Singkat Integrasi

1. **Kirim Verifikasi**: Panggil `POST /api/auth/send-link` dengan email target.
2. **Salin Link Email**: Pengguna membuka email, lalu menyalin tautan tombol verifikasi (jangan dibuka di browser).
3. **Eksekusi Pro**: Kirim email dan URL tautan tersebut ke `POST /api/subscription/upgrade`. Akun langsung aktif Pro.

---

## Tingkat Akses (Tiers)

- **Free Tier (Publik / Gratis)**:
  Bisa langsung digunakan tanpa API key pribadi. Di CLI atau SDK, **cukup dikosongkan (tekan Enter) atau ketik `free`**. Di header HTTP cukup kirim `x-api-key: free` atau kosongkan header `x-api-key`. Dibatasi maksimal **10 kali upgrade per hari per user**.
- **Private Tier**:
  Menggunakan API key pribadi (`am_live_...`). Kuota mandiri dari admin, dan **bebas dari cooldown/rate-limit email spam**.

---

## Panduan Lengkap

- 📖 **[Panduan Integrasi API (`docs/USER.md`)](./docs/USER.md)**:
  Spesifikasi lengkap endpoint `/api/*`, format payload, contoh cURL, dan tabel penanganan kode error.
- 🛠️ **[Panduan Skrip & Bot Helper (`docs/SCRIPTS_GUIDE.md`)](./docs/SCRIPTS_GUIDE.md)**:
  Cara menjalankan tool CLI terminal, import SDK class, dan konfigurasi bot Telegram / Discord.

---

## Contoh Proyek & SDK di Folder `examples/`

Setiap folder di dalam `examples/` dirancang sebagai proyek mandiri (self-contained) lengkap dengan dependensi, konfigurasi, dan dokumentasi masing-masing:

| Folder | Bahasa / Platform | Keterangan |
| :--- | :--- | :--- |
| **[`examples/cli-node/`](./examples/cli-node/)** | Node.js (v18+) / Bun | CLI interaktif JavaScript tanpa dependensi npm (Zero dependencies). |
| **[`examples/cli-python/`](./examples/cli-python/)** | Python 3 | CLI interaktif Python untuk terminal. |
| **[`examples/sdk-typescript/`](./examples/sdk-typescript/)** | TypeScript / JS | Modul SDK client lengkap dengan tipe data untuk Node.js & Bun. |
| **[`examples/sdk-python/`](./examples/sdk-python/)** | Python 3 | Modul SDK client Python (FastAPI, Flask, bot). |
| **[`examples/discord-bot/`](./examples/discord-bot/)** | TypeScript (`discord.js v14`) | Bot Discord lengkap dengan Slash Commands & Modal Form privat. |
| **[`examples/telegram-bot/`](./examples/telegram-bot/)** | Python (`telebot`) | Bot Telegram interaktif siap jalan dengan wizard multi-step. |

---

## Quick Start CLI

Tersedia tool CLI terminal siap pakai tanpa perlu menulis kode integrasi manual:

### Versi Node.js / Bun:
```bash
node examples/cli-node/cli.js
# atau: bun examples/cli-node/cli.js
```

### Versi Python:
```bash
pip install -r examples/cli-python/requirements.txt
python examples/cli-python/cli.py
```

---

## Quick Example (SDK)

### TypeScript:
```typescript
import { AlightMotionAPI } from './examples/sdk-typescript/client';

const api = new AlightMotionAPI('https://api.wky.me', 'am_live_xxxxxxxx');

// Kirim link verifikasi ke email
await api.sendVerificationLink('user@gmail.com');

// Upgrade akun setelah link disalin dari email
const res = await api.upgradeToPro('user@gmail.com', 'https://alightcreative.com?link=...', '2_bulan');
console.log(res.message);
```

### Python:
```python
from examples.sdk_python.client import AlightMotionAPI # atau salin client.py ke project Anda

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