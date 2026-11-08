# Alight Motion Telegram Bot

Bot Telegram interaktif berbasis `pyTelegramBotAPI` (`telebot`) untuk mengotomasi pengecekan kuota dan upgrade akun Alight Motion ke Pro.

---

## Fitur Bot

- `/start` atau `/help`: Panduan ringkas penggunaan bot.
- `/kuota`: Cek sisa kuota, total upgrade berhasil, dan masa aktif API key.
- `/paket`: Daftar paket durasi aktif.
- `/upgrade`: Wizard step-by-step:
  1. Pengguna memasukkan email akun Alight Motion.
  2. Bot mengirim link verifikasi ke inbox / spam email.
  3. Pengguna menyalin tautan tombol verifikasi email.
  4. Pengguna mem-paste link ke obrolan bot.
  5. Akun berhasil di-upgrade ke Pro!

---

## Prasyarat

- Python 3.8+
- Token Bot Telegram dari [@BotFather](https://t.me/BotFather)

---

## Panduan Setup

### 1. Salin Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi variabel di dalam `.env`:
- `TELEGRAM_BOT_TOKEN`: Token bot dari @BotFather.
- `ALIGHT_API_URL`: URL endpoint Alight Motion API (misal `https://api.wky.me`).
- `ALIGHT_API_KEY`: API Key kamu (`am_live_...`).

### 2. Install Dependensi
```bash
pip install -r requirements.txt
```

### 3. Menjalankan Bot
```bash
python bot.py
```
