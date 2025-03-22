const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// BOT TOKEN của bạn
const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';

// Khởi tạo bot
const bot = new TelegramBot(token, { polling: false });

// Set Webhook URL (replace with your Render domain)
const webHookUrl = 'https://telegram-auto-reply-bot.onrender.com/' + token;
bot.setWebHook(webHookUrl);

let users = {};

// Load số dư từ file
const loadUsers = () => {
  if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
  }
};

// Lưu số dư vào file
const saveUsers = () => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

loadUsers();

// Middleware Express để UptimeRobot ping
app.get('/', (req, res) => {
  res.send('Bot đang chạy!');
});

app.use(express.json());

// Xử lý webhook
app.post('/' + token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server đang chạy tại cổng ${port}`);
});

// Các lệnh bot

// Lệnh start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  if (!users[chatId]) {
    users[chatId] = { balance: 1000 }; // Số dư mặc định
    saveUsers();
  }
  bot.sendMessage(chatId, `Chào mừng! Bạn có ${users[chatId].balance} xu.`);
});

// Kiểm tra số dư
bot.onText(/\/sodu/, (msg) => {
  const chatId = msg.chat.id;
  const balance = users[chatId] ? users[chatId].balance : 0;
  bot.sendMessage(chatId, `Số dư của bạn: ${balance} xu.`);
});

// Lệnh xúc xắc
bot.onText(/\/xucsac/, (msg) => {
  const chatId = msg.chat.id;
  const dice = Math.floor(Math.random() * 6) + 1;
  bot.sendMessage(chatId, `Bạn tung được số: ${dice}`);
});
