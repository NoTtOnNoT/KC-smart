const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const admin = require('firebase-admin');

// 1. ใส่ข้อมูลจาก my.telegram.org ของคุณ
const apiId = 39376007; // ใส่ api_id (ตัวเลข)
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; // ใส่ api_hash
const stringSession = new StringSession(""); // ปล่อยว่างไว้ก่อนในครั้งแรก

// 2. ตั้งค่า Firebase Admin
const serviceAccount = require('./kc-smart-firebase-adminsdk-fbsvc-02c865dc06.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

(async () => {
  console.log("กำลังเชื่อมต่อ Telegram...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // ระบบจะขอเบอร์โทรและรหัส OTP ทาง Terminal ในการรันครั้งแรกครั้งเดียว
  await client.start({
    phoneNumber: async () => await input.text("กรุณาใส่เบอร์โทรศัพท์ Telegram (เช่น +66812345678): "),
    password: async () => await input.text("กรุณาใส่รหัสผ่าน 2FA (ถ้ามี): "),
    phoneCode: async () => await input.text("กรุณาใส่รหัส OTP ที่ได้รับใน Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("🟢 เชื่อมต่อ Telegram สำเร็จ!");
  // สำคัญ: ระบบจะสร้าง Token เข้าสู่ระบบมาให้ ให้ก๊อปปี้ค่านี้ไปเก็บไว้เพื่อไม่ต้องล็อกอินใหม่รอบหน้า
  console.log("บันทึก Session String นี้ไว้ใช้ครั้งต่อไปเพื่อไม่ให้ต้องล็อกอินซ้ำ:", client.session.save());

  // 3. ดักจับข้อความใหม่
  client.addEventHandler(async (event) => {
    const message = event.message;
    
    // ตรวจสอบว่าเป็นข้อความจากบอทของครูหรือไม่ (ใส่ Username บอทของครูลงไป)
    const sender = await message.getSender();
    if (sender && sender.username === 'ครู_bot_username') { 
      const text = message.text;
      console.log(`🔔 ดักจับข้อความใหม่จากบอทครูได้: "${text}"`);

      // 4. ส่ง Web Push หาผู้ใช้เว็บทุกคนผ่าน Firebase (Topic: announcements)
      const pushMessage = {
        notification: {
          title: '📢 มีแจ้งเตือนใหม่จากคุณครู!',
          body: text
        },
        topic: 'announcements'
      };

      try {
        const response = await admin.messaging().send(pushMessage);
        console.log('🚀 ส่งแจ้งเตือน Web Push สำเร็จ! ID:', response);
      } catch (error) {
        console.error('❌ ส่งแจ้งเตือนล้มเหลว:', error);
      }
    }
  });
})();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// สร้างหน้าเว็บสั้น ๆ ไว้เช็กว่าเซิร์ฟเวอร์ยังตื่นอยู่ไหม
app.get('/ping', (req, res) => {
  res.send('เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢');
});

app.listen(PORT, () => {
  console.log(`ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});