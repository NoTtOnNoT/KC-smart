const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { NewMessage } = require("telegram/events"); 
const express = require('express');

// 1. ข้อมูลการเชื่อมต่อ Telegram
const apiId = 39376007; 
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; 
// ดึงจาก Environment Variable บน Render โดยตรง
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");// 🔍 กำหนดเป้าหมายที่ต้องการดักจับ (เลือกใช้อย่างใดอย่างหนึ่ง)
const TARGET_BOT_USERNAME = 'KCSmartAlert_bot'; // ชื่อ username ของบอตที่ส่งมา (ไม่ต้องใส่ @)
// const TARGET_CHAT_ID = '123456789'; // หรือใส่รหัส ID ของแชต/กลุ่มตรงๆ (ถ้าทราบ)

// 2. ตั้งค่า Firebase Admin
const path = require('path');
const serviceAccount = require('/etc/secrets/kc-smart-firebase-adminsdk-fbsvc-02c865dc06.json');
initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  console.log("⏳ กำลังเชื่อมต่อ Telegram...");
  
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    useWSS: true 
  });

  try {
    await client.start({
      phoneNumber: async () => "",
      password: async () => "",
      phoneCode: async () => "",
      onError: (err) => console.error("⚠️ Client Start Error:", err.message),
    });

    console.log("🟢 [Telegram] เชื่อมต่อสำเร็จและพร้อมดักฟังข้อความแล้ว!");

    // 3. ดักจับข้อความใหม่
    client.addEventHandler(async (event) => {
      const message = event.message;
      if (!message || !message.text) return;

      try {
        // ดึงข้อมูลผู้ส่งในรูปแบบ Entity (ปลอดภัยและไม่ทำให้สคริปต์ค้างช้า)
        const sender = await message.getSender();
        const text = message.text;
        
        // ตรวจสอบว่ามีข้อมูลผู้ส่งหรือไม่
        if (!sender) return;

        // เช็คเงื่อนไข: ดักจับเฉพาะข้อความจากบอตโรงเรียนที่เรากำหนดไว้
        const isTargetBot = sender.username && sender.username.toLowerCase() === TARGET_BOT_USERNAME.toLowerCase();
        const isTargetId = sender.id && sender.id.toString() === (typeof TARGET_CHAT_ID !== 'undefined' ? TARGET_CHAT_ID : '');

        if (isTargetBot || isTargetId) {
          console.log(`📥 [พบข้อความตรงเงื่อนไข]: "${text}"`);

          // 4. ส่ง Web Push หาผู้ใช้เว็บทุกคนผ่าน Firebase
          const pushMessage = {
            notification: {
              title: '📢 มีแจ้งเตือนใหม่จากระบบ!',
              body: text
            },
            topic: 'announcements'
          };

          const response = await getMessaging().send(pushMessage);
          console.log('🚀 ยิง Web Push สำเร็จ! ID:', response);
        }

      } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดในการประมวลผลข้อความ:", err.message);
      }
    }, new NewMessage({}));

    // 🛡️ ป้องกันคีย์ค้าง: ตัดการเชื่อมต่ออย่างปลอดภัยเมื่อเซิร์ฟเวอร์โดนสั่งปิด (Render Restart)
    process.on('SIGINT', async () => {
      console.log('⏳ กำลังปิดการเชื่อมต่อ Telegram...');
      await client.disconnect();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('⏳ กำลังปิดการเชื่อมต่อ Telegram...');
      await client.disconnect();
      process.exit(0);
    });

  } catch (connectError) {
    console.error("❌ ไม่สามารถเชื่อมต่อกับ Telegram ได้:", connectError.message);
    if (connectError.message.includes("AUTH_KEY_DUPLICATED")) {
      console.error("🚨 รหัสล็อกอินซ้ำซ้อน! กรุณาปิดสคริปต์นี้บนเครื่องคอมพิวเตอร์ของคุณ หรือทำ Clear cache บน Render");
    }
  }
})();

// 5. เซิร์ฟเวอร์สำหรับ UptimeRobot
app.get('/ping', (req, res) => {
  res.status(200).send('เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢');
});

app.listen(PORT, () => {
  console.log(`📡 ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});