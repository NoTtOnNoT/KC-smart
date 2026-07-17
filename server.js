const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// 1. ใส่ข้อมูลจาก my.telegram.org ของคุณ
const apiId = 39376007; 
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; 
// 🔑 นำข้อความ Session String ยาวๆ จากขั้นตอนที่ 1 มาแปะใส่ตรงนี้
// ตัวอย่างการใส่ที่ถูกต้อง (ต้องเป็นตัวอักษรยาวเหยียดของจริงทั้งหมด ห้ามมีจุดไข่ปลาตรงกลาง)
const stringSession = new StringSession("1BQANOTEuMTA4LjU2LjE2NGg7Fa3D4bItVcFmVci+tHPVz72zTZfVNJbKodT8VNgZJxtdXWiSfZWTn3XEv3e2AecSsqDKaJBuWs5+jZq8r17XtYFG1XbjhwLSLPmLf8trhlDDvIIOTWOh+dDotaEi2+PsHn1nk4yujRZWwAhbYiLnHN9R//KByK0XJ3gstgtIB0LnpZFR5BnHf7cCbbNfThY+C7iDYXOrEZnKDMA0zmwiGgOfjcoMc21P/WRuAbyJ4L4ZvjuTUTRuPmjDfqmDHbv12hjtcoy0jLDCmzOkr3SGghQHLq4HlYvyxF7GIuf+Y5lBVN9cb8eV+pDgwFnVYyH7Q0Gb0Xv20gBynqCtekiaA==");
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

  await client.start({
    phoneNumber: async () => await input.text("กรุณาใส่เบอร์โทรศัพท์ Telegram (เช่น +66812345678): "),
    password: async () => await input.text("กรุณาใส่รหัสผ่าน 2FA (ถ้ามี): "),
    phoneCode: async () => await input.text("กรุณาใส่รหัส OTP ที่ได้รับใน Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("🟢 เชื่อมต่อ Telegram สำเร็จและพร้อมดักฟังข้อความแล้ว!");

  // 3. ดักจับข้อความใหม่
  client.addEventHandler(async (event) => {
    // ✨ เพิ่มจุดนี้: ถ้าเหตุการณ์ที่เข้ามาไม่มีข้อความ (เช่น คนกดอ่านแชท, ดึงข้อมูลเก่า) ให้ข้ามไปเลย ไม่ต้องรันต่อ
    if (!event.message) return; 

    const message = event.message;
    
    try {
      const sender = await message.getSender();
      if (sender && sender.username === 'Kc_broadcast_Bot_bot') {
        const text = message.text;
        console.log(`🔔 มีแจ้งเตือนใหม่: "${text}"`);

        // 4. ส่ง Web Push หาผู้ใช้เว็บทุกคนผ่าน Firebase (Topic: announcements)
        const pushMessage = {
          notification: {
            title: '📢 มีแจ้งเตือนใหม่!',
            body: text
          },
          topic: 'announcements'
        };

        const response = await getMessaging().send(pushMessage);
        console.log('🚀 ส่งแจ้งเตือน Web Push สำเร็จ! ID:', response);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดักจับคนส่ง:", err.message);
    }
  });
})();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.send('เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢');
});

app.listen(PORT, () => {
  console.log(`ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});