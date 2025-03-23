import os
import telebot

# Lấy token từ biến môi trường
TOKEN = os.getenv("8127007530:AAG1b4w__xXvIrAr7woZjN8BrC_l3g1hBwI")
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Chào mừng bạn đến với bot!")

@bot.message_handler(commands=['spam'])
def spam(message) 
    bot.reply_to(message, "Lệnh Đang Cập Nhật!")


@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, message.text)

if __name__ == "__main__":
    bot.polling()
