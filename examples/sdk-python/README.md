# Alight Motion SDK (Python)

Modul client SDK Python untuk berinteraksi dengan **Alight Motion API**. Cocok diintegrasikan ke framework backend (FastAPI, Flask, Django) maupun bot automasi (Telebot, Discord.py).

---

## File

- `client.py`: Class `AlightMotionAPI` berbasis `requests.Session`.
- `example.py`: Contoh kode pemanggilan method SDK.
- `requirements.txt`: Dependensi library Python (`requests`).

---

## Instalasi

```bash
pip install -r requirements.txt
```

---

## Contoh Penggunaan

```python
from client import AlightMotionAPI

api = AlightMotionAPI("https://api.wky.me", "am_live_xxxxxxxx")

# 1. Cek Kuota
me = api.get_quota()
print("Sisa Kuota:", me["data"]["remaining_quota"])

# 2. Cek Daftar Paket
plans = api.get_plans()
print("Paket:", plans)

# 3. Kirim Link Verifikasi
api.send_verification_link("user@gmail.com")

# 4. Eksekusi Upgrade ke Pro
res = api.upgrade_to_pro(
    "user@gmail.com",
    "https://alightcreative.com?link=...",
    "2_bulan"
)
print(res["message"])
```

---

## Menjalankan Contoh Demo

```bash
python example.py
```
