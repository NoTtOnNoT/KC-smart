const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events"); 
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // import ตัวหลักที่นี่

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
    process.exit(1); 
}

// --- Initialize Firebase ---
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// --- 1. ข้อมูลการเชื่อมต่อ Telegram ---
const apiId = 39376007; 
const apiHash = "4bbfdf3c89267e34312cd5cec276442d"; 
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");
const TARGET_BOT_USERNAME = 'KCSmartAlert_bot';

// --- ฟังก์ชันส่ง Multicast ---
async function sendToAllDevices(text) {
  try {
    const snapshot = await db.ref('fcm_tokens').once('value');
    const data = snapshot.val();

    if (!data) {
      console.log("⚠️ ไม่มี Token ใน Database เลย ข้ามการส่ง");
      return;
    }

    // ดึงค่า token ออกมาจาก object ข้างใน
    const tokens = Object.values(data)
                         .map(item => item.token)
                         .filter(token => token); 

    if (tokens.length === 0) {
      console.log("⚠️ ไม่พบข้อมูล Token ภายใน Database");
      return;
    }

    // ส่ง batch ทีละ 500
    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500);
      const message = {
        notification: {
          title: '📢 มีแจ้งเตือนใหม่จากระบบ!',
          body: text
        },
        tokens: batch
      };

      const response = await admin.messaging().sendMulticast(message);
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
    await db.ref('fcm_tokens/' + Date.now()).set({ token: token, device: "Android", timestamp: Date.now() });
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
      
      if (!message) return;
      
      console.log("📥 [DEBUG] ได้รับ Event ใหม่! ข้อความ:", message.text);

      if (!message.text) return;

      try {
        const sender = await message.getSender();
        const username = sender && sender.username ? sender.username : "ไม่มี Username";
        console.log(`📥 [DEBUG] ข้อความจาก: ${username} (ID: ${message.senderId})`);
        
        if (username === TARGET_BOT_USERNAME || username === 'KCSmartAlert_bot') {
            console.log(`🚀 พบข้อความจากบอท กำลังส่งเข้า Firebase: ${message.text}`);
            await sendToAllDevices(message.text);
        } else {
            console.log(`ℹ️ ข้อความจาก ${username} ไม่ใช่เป้าหมาย ข้ามไป`);
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