const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { NewMessage } = require("telegram/events"); 

// 1. ใส่ข้อมูลจาก my.telegram.org ของคุณ
const apiId = 39376007; 
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; 
// 🔑 ฝังรหัสกุญแจตัวล่าสุดที่คุณส่งมาให้เรียบร้อยแล้วครับ
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE2NgG7nqnw3S0GPaGazrUIT5jG+/4JbcedYQughIp3MOwFJUSEuI9hu8hcRHsZ2O004Xy1B/UuRuZ7kuu83yNuL8CXtyh13UoVB1MoO4Iwy/WSHxSilxc8MZCJ7O7jH/MKIFN7JluT+ew7Ti407GRRx5cMUsUqic9lPfVl91oV1hmZwoeABrCflWhsFGI3ORpuILO14Z8xeIQaWZLFr/eoOQO4yOspTKSuCCxEzYsL6RYrdW5PRsTsLDaiAI2j4IAh8xS6BAK714WLaVVx4l/sYdWOwCp2B57u15jfqt/bpfYjIA4e39vFlRpKLvEyvnX8HpiEbBnQ0A5dJLDaoUDkaqt0bw==");

// 2. ตั้งค่า Firebase Admin
const serviceAccount = require('./kc-smart-firebase-adminsdk-fbsvc-02c865dc06.json');
initializeApp({
  credential: cert(serviceAccount)
});

(async () => {
  console.log("กำลังเชื่อมต่อ Telegram...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // ใช้กุญแจรันได้เลย ไม่ต้องรอ input OTP อีกต่อไป
  await client.start({
    phoneNumber: async () => "",
    password: async () => "",
    phoneCode: async () => "",
    onError: (err) => console.log(err),
  });

  console.log("🟢 [Telegram] เชื่อมต่อสำเร็จและพร้อมดักฟังข้อความแล้ว!");

  // 3. ดักจับข้อความใหม่จากบอทครู
  client.addEventHandler(async (event) => {
    const message = event.message;
    if (!message) return; 

    try {
      const sender = await message.getSender();
      if (sender && sender.username === 'Kc_broadcast_Bot_bot') { 
        const text = message.text;
        console.log(`🔔 มีแจ้งเตือนใหม่จากบอทครู: "${text}"`);

        // 4. ส่ง Web Push หาผู้ใช้เว็บทุกคนผ่าน Firebase (Topic: announcements)
        const pushMessage = {
          notification: {
            title: '📢 มีแจ้งเตือนใหม่!',
            body: text
          },
          topic: 'announcements'
        };

        const response = await getMessaging().send(pushMessage);
        console.log('🚀 ยิง Web Push สำเร็จ! ID:', response);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดักจับคนส่ง:", err.message);
    }
  }, new NewMessage({})); 
})();

// 5. ระบบเซิร์ฟเวอร์ Express สำหรับให้ UptimeRobot คอยยิงปลุกฟรี 24 ชั่วโมง
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.send('เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢');
});

app.listen(PORT, () => {
  console.log(`ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});