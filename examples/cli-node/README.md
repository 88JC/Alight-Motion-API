# Alight Motion CLI (Node.js / Bun)

Tool CLI interaktif untuk mengecek kuota akun, melihat daftar paket, dan mengeksekusi upgrade akun Alight Motion ke Pro langsung dari terminal.

**Zero Dependencies**: Tidak membutuhkan instalasi modul npm eksternal, hanya memanfaatkan modul native `node:readline/promises` dan `fetch` bawaan.

---

## Prasyarat

- Node.js v18.0.0+ atau [Bun](https://bun.sh/)

---

## Cara Menjalankan

### Menggunakan Node.js
```bash
node cli.js
# atau
npm start
```

### Menggunakan Bun
```bash
bun cli.js
# atau
bun start
```

---

## Alur Penggunaan

1. Masukkan Base URL API (default: `https://api.wky.me`).
2. Masukkan API Key kamu (atau cukup **kosongkan / ketik `free`** untuk Free Tier gratis 10x/hari).
3. Pilih menu yang diinginkan:
   - **Menu 1**: Cek sisa kuota, total upgrade, dan masa aktif API key.
   - **Menu 2**: Cek daftar durasi paket yang tersedia.
   - **Menu 3**: Proses upgrade akun:
     - Masukkan email target.
     - Bot/CLI mengirim link verifikasi ke email.
     - Salin tautan tombol verifikasi dari inbox/spam email (jangan buka link di browser).
     - Paste link atau kode oob ke prompt CLI.
     - Akun Alight Motion otomatis aktif Pro!
