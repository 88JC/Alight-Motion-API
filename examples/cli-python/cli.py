import sys
import requests

DEFAULT_API_URL = "https://api.wky.me"

class AlightMotionClient:
    def __init__(self, base_url: str, api_key: str = ""):
        self.base_url = base_url.rstrip("/")
        self.headers = {"Content-Type": "application/json"}
        if api_key.strip():
            self.headers["x-api-key"] = api_key.strip()

    def get_plans(self):
        return requests.get(f"{self.base_url}/api/plans", timeout=15).json()

    def get_me(self):
        return requests.get(f"{self.base_url}/api/me", headers=self.headers, timeout=15).json()

    def send_link(self, email: str):
        return requests.post(f"{self.base_url}/api/auth/send-link", json={"email": email}, headers=self.headers, timeout=25).json()

    def upgrade_account(self, email: str, link_or_code: str, plan: str = "2_bulan"):
        payload = {"email": email, "plan": plan}
        if link_or_code.startswith("http"):
            payload["link"] = link_or_code
        else:
            payload["oobCode"] = link_or_code
        return requests.post(f"{self.base_url}/api/subscription/upgrade", json=payload, headers=self.headers, timeout=35).json()

def main():
    print("=" * 45)
    print("  Alight Motion Pro Upgrade - CLI Helper")
    print("=" * 45)

    api_url = input(f"Base API URL [{DEFAULT_API_URL}]: ").strip() or DEFAULT_API_URL
    raw_api_key = input("API Key kamu (am_live_... atau Enter / ketik 'free' untuk Free Tier): ").strip()
    api_key = "free" if raw_api_key.lower() == "free" else raw_api_key

    client = AlightMotionClient(api_url, api_key)

    # Cek koneksi awal
    print("\nCek akun...")
    me = client.get_me()
    if not me.get("success"):
        print(f"Gagal koneksi/cek akun: {me.get('error', 'Key tidak valid')}")
        sys.exit(1)

    info = me.get("data", {})
    if info.get("tier"):
        print(f"\nStatus     : {info.get('tier')}")
        print(f"Sisa hari  : {info.get('remaining_today')} / {info.get('daily_limit')} upgrade")
        print(f"IP         : {info.get('ip')}")
    else:
        print(f"Halo, {info.get('name', 'User')}!")
        print(f"Sisa kuota : {info.get('remaining_quota')}")
        print(f"Masa aktif : {info.get('expires_at') or 'Lifetime'}")

    while True:
        print("\nPilih aksi:")
        print("1. Cek sisa kuota")
        print("2. Lihat daftar paket durasi")
        print("3. Upgrade akun Alight Motion")
        print("4. Keluar")

        pilihan = input("Pilih [1-4]: ").strip()

        if pilihan == "1":
            cur = client.get_me().get("data", {})
            if cur.get("tier"):
                print(f"\nStatus     : {cur.get('tier')}")
                print(f"Sisa hari  : {cur.get('remaining_today')} / {cur.get('daily_limit')} upgrade")
                print(f"Terpakai   : {cur.get('used_today')}")
                print(f"IP         : {cur.get('ip')}")
                print(f"Catatan    : {cur.get('note', '-')}")
            else:
                print(f"\nAkun       : {cur.get('name')}")
                print(f"Sisa kuota : {cur.get('remaining_quota')}")
                print(f"Total jadi : {cur.get('total_created')} akun")
                print(f"Masa aktif : {cur.get('expires_at') or 'Lifetime'}")

        elif pilihan == "2":
            plans = client.get_plans().get("data", [])
            print("\nPilihan durasi:")
            for p in plans:
                print(f"- {p['id']} -> aktif s/d {p['label']}")

        elif pilihan == "3":
            print("\n[Langkah 1] Kirim link ke email")
            email = input("Masukkan email target: ").strip()
            if not email or "@" not in email:
                print("Format email salah.")
                continue

            print(f"Kirim link ke {email}...")
            send_res = client.send_link(email)
            if not send_res.get("success"):
                print(f"Gagal kirim link: {send_res.get('error')}")
                continue

            print(f"Link sukses terkirim ke {email}.")
            print("\n[Langkah 2] Buka email target (cek inbox / spam)")
            print("PENTING: Jangan buka link di browser. Cukup klik kanan / tahan tombol, lalu pilih 'Copy Link Address'.")
            link = input("Paste URL link-nya di sini: ").strip()

            if not link:
                print("Link kosong, proses dibatalkan.")
                continue

            print("\nPilih paket durasi:")
            print("1. 2_bulan  (Aktif s/d Okt 2026) [Rekomendasi]")
            print("2. 6_bulan  (Aktif s/d Feb 2027)")
            print("3. 11_bulan (Aktif s/d Jul 2027)")
            print("4. 12_bulan (Aktif s/d Agu 2027)")
            opt = input("Pilihan [1/2/3/4, default 1]: ").strip()
            plan_map = {"1": "2_bulan", "2": "6_bulan", "3": "11_bulan", "4": "12_bulan"}
            selected_plan = plan_map.get(opt, "2_bulan")

            print(f"\nLagi proses upgrade ke paket {selected_plan}...")
            res = client.upgrade_account(email, link, selected_plan)

            if res.get("success"):
                d = res.get("data", {})
                print("\n" + "-" * 40)
                print("BERHASIL! Akun target udah jadi Pro.")
                print(f"Email      : {d.get('email')}")
                print(f"Paket      : {d.get('plan')}")
                print(f"Aktif s/d  : {d.get('expires_estimated')}")
                print(f"Sisa kuota : {d.get('remaining_quota')}")
                print("-" * 40)
            else:
                print(f"Gagal upgrade: {res.get('error')}")
                if "detail" in res:
                    print(f"Detail: {res.get('detail')}")

        elif pilihan == "4":
            print("Keluar. Sampai jumpa!")
            break
        else:
            print("Pilihan salah, coba lagi.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nBatal.")
        sys.exit(0)
