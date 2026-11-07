import telebot
from client import AlightMotionAPI

BOT_TOKEN = "TOKEN_BOT_TELEGRAM"
API_URL = "https://api.wky.me"
API_KEY = "am_live_KEY_ANDA"

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
    d = res["data"]
    bot.reply_to(m, f"User: {d['name']}\nSisa kuota: {d['remaining_quota']}\nTotal upgrade: {d['total_created']}\nMasa aktif: {d['expires_at'] or 'Lifetime'}")

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
