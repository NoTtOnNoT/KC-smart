const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { getDatabase } = require('firebase-admin/database');
const { NewMessage } = require("telegram/events"); 
const express = require('express');
const cors = require('cors');

// --- Setup Express ---
const app = express();
app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

// --- Load Firebase Credentials ---
let serviceAccount;
try {
    if (!process.env.FIREBASE_CREDENTIALS) throw new Error("FIREBASE_CREDENTIALS environment variable is missing!");
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (e) {
    console.error("❌ Firebase Credentials Error:", e.message);
    process.exit(1); // หยุดการทำงานถ้า Config พลาด
}

// --- Initialize Firebase ---
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getDatabase();

// --- 1. ข้อมูลการเชื่อมต่อ Telegram ---
const apiId = 39376007; 
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; 
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");
const TARGET_BOT_USERNAME = 'KCSmartAlert_bot';

// --- ฟังก์ชันส่ง Multicast ---
async function sendToAllDevices(text) {
  try {
    const snapshot = await db.ref('devices').once('value');
    const data = snapshot.val();

    if (!data) {
      console.log("⚠️ ไม่มี Token ใน Database เลย ข้ามการส่ง");
      return;
    }

    const tokens = Object.keys(data); 

    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);
      const message = {
        notification: {
          title: '📢 มีแจ้งเตือนใหม่จากระบบ!',
          body: text
        },
        tokens: batch
      };

      const response = await getMessaging().sendMulticast(message);
      console.log(`🚀 ส่งสำเร็จ ${response.successCount} เครื่อง, ล้มเหลว ${response.failureCount} เครื่อง`);
    }
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการส่ง Multicast:", err.message);
  }
}

// --- API สำหรับ PWA ---
app.post('/register-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send("No token provided");
  try {
    await db.ref('devices/' + token).set({ token: token, updatedAt: Date.now() });
    res.status(200).send("Token registered");
  } catch (err) {
    res.status(500).send("Error saving token");
  }
});

app.get('/ping', (req, res) => res.status(200).send('เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢'));

// --- ระบบ Telegram Client ---
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

    console.log("🟢 [Telegram] เชื่อมต่อสำเร็จ!");

    client.addEventHandler(async (event) => {
      const message = event.message;
      if (!message || !message.text) return;

      try {
        const sender = await message.getSender();
        
        // ตรวจสอบ Sender แบบปลอดภัย
        const username = sender && sender.username ? sender.username : "";
        
        if (username === TARGET_BOT_USERNAME || username === 'KCSmartAlert_bot') {
            console.log(`🚀 พบข้อความจากบอท: ${message.text}`);
            await sendToAllDevices(message.text);
        } else {
            console.log(`ℹ️ ได้รับข้อความจาก: ${username || 'Unknown'} (ข้ามการส่ง)`);
        }
      } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดในการตรวจสอบข้อความ:", err.message);
      }
    }, new NewMessage({}));

  } catch (connectError) {
    console.error("❌ ไม่สามารถเชื่อมต่อกับ Telegram ได้:", connectError.message);
  }
})();

app.listen(PORT, () => {
  console.log(`📡 ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});