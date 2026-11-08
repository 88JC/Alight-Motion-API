import os
from client import AlightMotionAPI

API_URL = os.getenv("ALIGHT_API_URL", "https://api.wky.me")
API_KEY = os.getenv("ALIGHT_API_KEY", "free")

def main():
    api = AlightMotionAPI(API_URL, API_KEY)

    print("--- 1. Cek Kuota & Info Akun ---")
    me = api.get_quota()
    if me.get("success") and me.get("data"):
        data = me["data"]
        if data.get("tier"):
            print(f"Status: {data.get('tier')}")
            print(f"Sisa Hari Ini: {data.get('remaining_today')} / {data.get('daily_limit')}")
            print(f"IP: {data.get('ip')}")
        else:
            print(f"User: {data.get('name')}")
            print(f"Sisa Kuota: {data.get('remaining_quota')}")
            print(f"Masa Aktif: {data.get('expires_at') or 'Lifetime'}")
    else:
        print(f"Gagal cek kuota: {me.get('error')}")

    print("\n--- 2. Cek Daftar Paket ---")
    plans = api.get_plans()
    for p in plans:
        print(f"- {p.get('id')} (label: {p.get('label')})")

    # Contoh pengiriman link verifikasi:
    # print("\n--- 3. Kirim Link Verifikasi ---")
    # send_res = api.send_verification_link("target@gmail.com")
    # print(send_res)

    # Contoh eksekusi upgrade:
    # print("\n--- 4. Eksekusi Upgrade ---")
    # upgrade_res = api.upgrade_to_pro("target@gmail.com", "https://alightcreative.com?link=...", "2_bulan")
    # print(upgrade_res)

if __name__ == "__main__":
    main()
