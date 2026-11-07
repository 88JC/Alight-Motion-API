# Panduan Integrasi API (Untuk Client / User)

API ini dipakai untuk meng-upgrade akun Alight Motion biasa menjadi Pro. Kamu bisa integrasikan API ini ke bot Discord, bot Telegram, web dashboard, atau script automaton.

---

## Cara Kerja Singkat

Alurnya sangat simpel:
1. Panggil endpoint kirim link ke email target.
2. User buka email, salin URL tombol verifikasi dari Alight Motion (jangan dibuka di browser).
3. Kirim email + link tersebut ke endpoint upgrade API. Akun langsung aktif Pro.

Kuota API kamu **cuma berkurang 1** kalau proses upgrade berhasil (HTTP 200). Kalau gagal atau link basi, kuota nggak bakal kepotong.

---

## Pilihan Tingkat Akses (Tiers)

API ini punya 2 mode akses:

### 1. Free Tier (Publik / Gratis)
- **Cara Pakai:** Kirim header `x-api-key: free` atau `x-api-key: public` (atau tanpa header API key).
- **Limit:** Dibatasi maksimal **10x create/upgrade akun per hari per users**.
- **Reset:** Kuota direset otomatis setiap 24 jam.

### 2. Private Tier (API Key Pribadi)
- **Cara Pakai:** Kirim header `x-api-key: am_live_xxxxxxxxxxxxxxxxxxxxxxxx`.
- **Kelebihan:** Kuota akun khusus milik kamu sendiri, **bebas dari cooldown/rate-limit email spam**, dan **tidak terikat limit 10x per hari per users**.

---

## Otentikasi Header

- **Untuk Free Tier:** Kirim `x-api-key: free` atau kosongkan header.
- **Untuk Private Tier:** Kirim `x-api-key: am_live_xxxxxxxxxxxxxxxxxxxxxxxx` atau `Authorization: Bearer am_live_xxxxxxxxxxxxxxxxxxxxxxxx`.

---

## Pilihan Paket Durasi

Tersedia beberapa pilihan durasi saat upgrade akun:

| Plan ID | Masa Aktif | Keterangan |
| :--- | :--- | :--- |
| `2_bulan` | 1 Oktober 2026 | Default jika opsi plan dikosongkan |
| `6_bulan` | 2 Februari 2027 | Paket durasi sedang |
| `11_bulan`| 2 Juli 2027 | Paket durasi panjang |
| `12_bulan`| 2 Agustus 2027 | Paket durasi 1 tahun |

---

## Endpoints

### 1. Cek Daftar Paket (`GET /api/plans`)
Endpoint ini publik, nggak butuh API key.

```bash
curl -X GET "https://api.wky.me/api/plans"
```

Contoh response (200):
```json
{
  "success": true,
  "data": [
    { "id": "2_bulan", "label": "1 Oktober 2026", "productId": "am.full.sub.annual.19q4" },
    { "id": "6_bulan", "label": "2 Februari 2027", "productId": "alightcreative.motion.1y_t50" },
    { "id": "11_bulan", "label": "2 Juli 2027", "productId": "am.full.sub.annual.19q4" },
    { "id": "12_bulan", "label": "2 Agustus 2027", "productId": "am.full.sub.annual.19q4" }
  ]
}
```

---

### 2. Cek Sisa Kuota Sendiri (`GET /api/me`)
Cek sisa kuota dan masa aktif API Key sebelum proses pesanan user.

```bash
curl -X GET "https://api.wky.me/api/me" \
  -H "x-api-key: am_live_xxxxxxxxxxxxxxxxxxxxxxxx"
```

Contoh response (200):
```json
{
  "success": true,
  "data": {
    "name": "Member VIP",
    "remaining_quota": 19,
    "total_created": 1,
    "expires_at": "2026-12-07T15:30:00.000Z",
    "created_at": "2026-11-07T15:30:00.000Z"
  }
}
```
*(Kalau `remaining_quota` isinya `"unlimited"`, berarti kuota kamu bebas tanpa batas)*

---

### 3. Kirim Link ke Email Target (`POST /api/auth/send-link`)
Trigger sistem Alight Motion buat kirim email verifikasi login ke target.

```bash
curl -X POST "https://api.wky.me/api/auth/send-link" \
  -H "Content-Type: application/json" \
  -H "x-api-key: am_live_xxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{"email": "user@gmail.com"}'
```

Contoh response (200):
```json
{
  "success": true,
  "message": "Link verifikasi udah dikirim ke user@gmail.com. Cek inbox/spam, terus copas URL link-nya ke sini."
}
```

---

### 4. Eksekusi Upgrade ke Pro (`POST /api/subscription/upgrade`)
Kirim email target dan URL link yang didapat dari email. Endpoint ini yang memotong kuota 1 poin saat sukses.

```bash
curl -X POST "https://api.wky.me/api/subscription/upgrade" \
  -H "Content-Type: application/json" \
  -H "x-api-key: am_live_xxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "email": "user@gmail.com",
    "link": "https://alightcreative.page.link/?link=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%3FoobCode%3DAbCdEf123...",
    "plan": "2_bulan"
  }'
```

> **Tips Link Email:**
> Kirimkan URL lengkap apa adanya di parameter `"link"`. API sudah otomatis mengekstrak kode `oobCode` dari link redirect Google/Firebase tersebut. Kamu nggak perlu pusing parse regex manual.

Contoh response sukses (200):
```json
{
  "success": true,
  "message": "Mantap! Akun berhasil di-upgrade ke Pro.",
  "data": {
    "email": "user@gmail.com",
    "plan": "2_bulan",
    "expires_estimated": "1 Oktober 2026",
    "remaining_quota": 18
  }
}
```

---

## Contoh Kode Integrasi

### Python (requests)
```python
import requests

API_URL = "https://api.wky.me"
API_KEY = "am_live_xxxxxxxxxxxxxxxxxxxxxxxx"
headers = {"Content-Type": "application/json", "x-api-key": API_KEY}

# 1. Kirim verifikasi ke email
email = "target@gmail.com"
requests.post(f"{API_URL}/api/auth/send-link", json={"email": email}, headers=headers)

# 2. Upgrade akun (link disalin dari email target)
link_email = "https://alightcreative.com?link=..."
res = requests.post(
    f"{API_URL}/api/subscription/upgrade",
    json={"email": email, "link": link_email, "plan": "2_bulan"},
    headers=headers
).json()

if res.get("success"):
    print("Akun sukses aktif Pro s/d:", res["data"]["expires_estimated"])
else:
    print("Gagal:", res.get("error"))
```

### TypeScript / JavaScript (Node.js / Bun)
```typescript
const API_URL = 'https://api.wky.me';
const API_KEY = 'am_live_xxxxxxxxxxxxxxxxxxxxxxxx';

async function upgradeAkun(email: string, linkDariEmail: string, plan = '2_bulan') {
  const res = await fetch(`${API_URL}/api/subscription/upgrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ email, link: linkDariEmail, plan }),
  });
  return await res.json();
}
```

---

## Kode Error dan Solusinya

| HTTP Code | Pesan Error | Cara Mengatasi |
| :--- | :--- | :--- |
| `400` | Format email salah | Cek lagi ketikan email target, pastikan ada tanda `@` dan domain yang benar. |
| `400` | Link verifikasi nggak valid atau udah basi | Link email cuma berlaku ~15 menit dan cuma bisa dipakai 1x. Minta user kirim link baru lewat `/api/auth/send-link`. |
| `401` | Butuh API Key | Kamu belum pasang header `x-api-key` atau `Authorization: Bearer`. |
| `401` | API Key salah atau udah dinonaktifkan | Key yang kamu pakai salah ketik atau dinonaktifkan admin. |
| `403` | Kuota API Key kamu udah habis | Kuota kamu tinggal 0. Hubungi admin buat top up kuota. |
| `403` | Masa aktif API Key udah habis | Tanggal masa aktif key kamu udah lewat. Hubungi admin buat perpanjang. |
| `500` | Gagal aktivasi Pro dari server Alight Motion | Server Google/Alight lagi padat atau throttle. Tunggu 5-10 detik lalu coba klik submit lagi. |
