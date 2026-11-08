# Alight Motion Discord Bot

Bot Discord berbasis `discord.js v14` yang mengintegrasikan Alight Motion API dengan fitur Slash Commands dan Discord Modal Form interaktif.

Tautan verifikasi diinput melalui Discord Modal Form privat, sehingga link verifikasi sensitif member tidak bocor ke obrolan publik server.

---

## Fitur Bot

- `/kuota`: Cek sisa kuota, total upgrade, dan masa aktif API key.
- `/paket`: Menampilkan daftar paket durasi aktif.
- `/upgrade [email] [plan]`: Memulai proses upgrade. Mengirimkan link ke email target dan memunculkan tombol Modal Form untuk input link verifikasi secara aman dan privat (ephemeral).

---

## Prasyarat

- Node.js v18+ atau [Bun](https://bun.sh/)
- Akun Bot di [Discord Developer Portal](https://discord.com/developers/applications)

---

## Panduan Setup

### 1. Salin Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi variabel di dalam `.env`:
- `DISCORD_BOT_TOKEN`: Token bot dari Discord Developer Portal.
- `DISCORD_CLIENT_ID`: Application ID bot Discord kamu.
- `ALIGHT_API_URL`: URL endpoint Alight Motion API (misal `https://api.wky.me`).
- `ALIGHT_API_KEY`: API Key kamu (`am_live_...`).

### 2. Install Dependensi

Jika menggunakan **Bun**:
```bash
bun install
```

Jika menggunakan **npm**:
```bash
npm install
```

### 3. Menjalankan Bot

Menggunakan Bun:
```bash
bun run bot.ts
# atau
bun start
```

Menggunakan Node.js / npx tsx:
```bash
npm run dev
```
