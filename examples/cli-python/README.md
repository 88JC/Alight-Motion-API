# Alight Motion CLI (Python)

Tool terminal interaktif berbasis Python untuk mengecek sisa kuota, melihat paket durasi, serta mengeksekusi upgrade akun Alight Motion ke Pro.

---

## Prasyarat

- Python 3.8+
- Library `requests`

---

## Instalasi Dependensi

```bash
pip install -r requirements.txt
```

---

## Cara Menjalankan

```bash
python cli.py
```

---

## Alur Penggunaan

1. Masukkan Base URL API (default: `https://api.wky.me`).
2. Masukkan API Key kamu (atau cukup **kosongkan / ketik `free`** untuk Free Tier gratis 10x/hari).
3. Pilih menu:
   - **1**: Cek sisa kuota akun dan masa aktif API key.
   - **2**: Lihat daftar paket durasi yang aktif di server.
   - **3**: Upgrade akun Alight Motion:
     - Masukkan email akun target.
     - Tunggu pengiriman link verifikasi ke inbox / spam email.
     - Klik kanan / copy tautan tombol verifikasi email (jangan buka link di browser).
     - Paste tautan ke terminal.
     - Akun Alight Motion langsung aktif Pro!
