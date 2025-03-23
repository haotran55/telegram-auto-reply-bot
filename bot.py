import telebot
import os
import threading
from flask import Flask, request

# Lấy TOKEN từ biến môi trường
TOKEN = os.getenv("BOT_TOKEN")
if not TOKEN:
    raise ValueError("Chưa thiết lập biến môi trường BOT_TOKEN")

bot = telebot.TeleBot(TOKEN)
app = Flask(__name__)

# Hàm xử lý tin nhắn từ Telegram
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Xin chào! Đây là bot Telegram đang chạy trên Render.")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, f"Bạn đã gửi: {message.text}")

# API webhook nhận tin nhắn từ Telegram
@app.route(f"/{TOKEN}", methods=["POST"])
def webhook():
    json_str = request.get_data().decode("UTF-8")
    update = telebot.types.Update.de_json(json_str)
    bot.process_new_updates([update])
    return "OK", 200

# Xóa Webhook nếu đang hoạt động và đặt webhook mới
@app.route("/set_webhook", methods=["GET"])
def set_webhook():
    webhook_url = f"https://{os.getenv('RENDER_EXTERNAL_HOSTNAME')}/{TOKEN}"
    bot.remove_webhook()
    bot.set_webhook(url=webhook_url)
    return f"Webhook đã đặt tại {webhook_url}", 200

# Chạy bot bằng polling trong thread khác
def run_bot():
    bot.polling(none_stop=True)

if __name__ == "__main__":
    threading.Thread(target=run_bot).start()
    app.run(host="0.0.0.0", port=5000)
