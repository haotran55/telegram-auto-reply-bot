import os
import telebot
import threading
from flask import Flask

TOKEN = os.getenv("TOKEN")  # Lấy token từ biến môi trường

if not TOKEN:
    raise ValueError("⚠️ Biến môi trường TOKEN chưa được đặt!")

bot = telebot.TeleBot(TOKEN)

#Xóa webhook nếu có
bot.remove_webhook()

# Fake server để Render nhận diện cổng
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Chào mừng bạn đến với bot!")

@bot.message_handler(commands=['spam'])
def spam(message):
    bot.reply_to(message, "Lệnh Đang Cập Nhật!")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, message.text)

# Hàm chạy bot Telegram
def run_bot():
    bot.polling()

