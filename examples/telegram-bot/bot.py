import os
from dotenv import load_dotenv
import telebot
from client import AlightMotionAPI

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "TOKEN_BOT_TELEGRAM")
API_URL = os.getenv("ALIGHT_API_URL", "https://api.wky.me")
API_KEY = os.getenv("ALIGHT_API_KEY", "")  # Kosongkan atau isi 'free' jika menggunakan Free Tier

bot = telebot.TeleBot(BOT_TOKEN)
api = AlightMotionAPI(API_URL, API_KEY)
sessions = {}

@bot.message_handler(commands=["start", "help"])
def handle_start(m):
    bot.reply_to(m, "Bot Alight Motion Pro\n\nCommand:\n/upgrade - Upgrade akun ke Pro\n/kuota - Cek sisa kuota API\n/paket - Daftar durasi")

@bot.message_handler(commands=["kuota"])
def handle_kuota(m):
    res = api.get_quota()
    if not res.get("success"):
        return bot.reply_to(m, f"Error: {res.get('error')}")
    d = res.get("data", {})
    if d.get("tier"):
        text = (
            f"Status: {d.get('tier')}\n"
            f"Sisa hari ini: {d.get('remaining_today')} / {d.get('daily_limit')} upgrade\n"
            f"Terpakai: {d.get('used_today')}\n"
            f"IP: {d.get('ip')}"
        )
    else:
        text = (
            f"User: {d.get('name', 'User')}\n"
            f"Sisa kuota: {d.get('remaining_quota')}\n"
            f"Total upgrade: {d.get('total_created')}\n"
            f"Masa aktif: {d.get('expires_at') or 'Lifetime'}"
        )
    bot.reply_to(m, text)

@bot.message_handler(commands=["paket"])
def handle_paket(m):
    plans = api.get_plans()
    text = "\n".join(f"• {p['id']} (s/d {p['label']})" for p in plans)
    bot.reply_to(m, f"Paket yang tersedia:\n{text}")

@bot.message_handler(commands=["upgrade"])
def handle_upgrade(m):
    sent = bot.reply_to(m, "Kirim email Alight Motion kamu:")
    bot.register_next_step_handler(sent, step_email)

def step_email(m):
    email = m.text.strip()
    if "@" not in email:
        return bot.reply_to(m, "Format email salah. Ulangi dengan /upgrade")

    bot.send_message(m.chat.id, f"Mengirim link verifikasi ke {email}...")
    res = api.send_verification_link(email)
    if not res.get("success"):
        return bot.send_message(m.chat.id, f"Gagal kirim link: {res.get('error')}")

    sessions[m.chat.id] = email
    sent = bot.send_message(m.chat.id, "Link sudah dikirim ke email.\n\nCek inbox/spam, copy link verifikasinya (jangan dibuka di browser), lalu kirim link-nya ke sini:")
    bot.register_next_step_handler(sent, step_link)

def step_link(m):
    email = sessions.pop(m.chat.id, None)
    if not email:
        return bot.send_message(m.chat.id, "Sesi habis. Ketik /upgrade lagi.")

    bot.send_message(m.chat.id, "Memproses aktivasi Pro...")
    res = api.upgrade_to_pro(email, m.text.strip(), "2_bulan")
    if res.get("success"):
        d = res["data"]
        bot.send_message(m.chat.id, f"Sukses! Akun {d['email']} sekarang Pro.\nAktif s/d: {d['expires_estimated']}\nSisa kuota: {d['remaining_quota']}")
    else:
        bot.send_message(m.chat.id, f"Aktivasi gagal: {res.get('error')}")

if __name__ == "__main__":
    print("Bot Telegram berjalan...")
    bot.infinity_polling()
