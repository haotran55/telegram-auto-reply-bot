const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const response = 'Xin chào! Đây là tin nhắn tự động.';
  bot.sendMessage(chatId, response);
});

app.get('/', (req, res) => {
  res.send('Bot đang chạy!');
});

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
