const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN; // BOT TOKEN của bạn


// Set Webhook URL (replace with your Render domain)
const webHookUrl = 'https://telegram-auto-reply-bot.onrender.com/';
bot.setWebHook(webHookUrl){});

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

app.listen(port, () => {
  console.log(`Server đang chạy tại cổng ${port}`);
});

// Bắt đầu bot
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
  bot.sendMessage(chatId, `🎲 Kết quả xúc xắc: ${dice}`);
});

// Lệnh tài xỉu
bot.onText(/\/taixiu (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const choice = match[1].toLowerCase();
  if (!users[chatId]) users[chatId] = { balance: 1000 };
  if (users[chatId].balance < 100) {
    return bot.sendMessage(chatId, `Bạn không đủ xu để chơi (cần 100 xu).`);
  }
  const dice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
  const result = dice <= 6 ? 'xỉu' : 'tài';
  let message = `🎲 Tổng điểm: ${dice} (${result.toUpperCase()})\n`;

  if (choice === result) {
    users[chatId].balance += 100;
    message += `Bạn thắng! +100 xu.\n`;
  } else {
    users[chatId].balance -= 100;
    message += `Bạn thua! -100 xu.\n`;
  }
  saveUsers();
  message += `Số dư hiện tại: ${users[chatId].balance} xu.`;
  bot.sendMessage(chatId, message);
});

// Nạp thêm tiền (mua tiền)
bot.onText(/\/nap (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const amount = parseInt(match[1]);
  if (!users[chatId]) users[chatId] = { balance: 1000 };
  users[chatId].balance += amount;
  saveUsers();
  bot.sendMessage(chatId, `Bạn đã nạp thành công ${amount} xu.\nSố dư mới: ${users[chatId].balance} xu.`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
