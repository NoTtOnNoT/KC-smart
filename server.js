console.log("🚀 Server is starting..."); // เพิ่มบรรทัดนี้บรรทัดแรกสุดเลยครับ

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

if (!admin || !admin.credential) {
  console.error(
    "❌ CRITICAL: firebase-admin ไม่สามารถโหลดได้! กำลังตรวจสอบ...",
  );
  // ถ้าใช้ v12 แล้วยังพัง ให้ลองเช็คว่ามันโหลดแบบนี้ไหม
  // กรณีนี้เราปล่อยให้โปรแกรมพังเพื่อดู Log รอบหน้า
}

// --- Setup Express ---
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Load Firebase Credentials ---
let serviceAccount;
try {
  if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error("FIREBASE_CREDENTIALS environment variable is missing!");
  }
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (e) {
  console.error("❌ Firebase Credentials Error:", e.message);
  process.exit(1);
}

// --- Initialize Firebase ---
// ลบเงื่อนไขเช็ค admin.apps.length ออก เพื่อป้องกัน Error
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id, // <--- เพิ่มบรรทัดนี้เข้าไปครับ (ดึงจาก JSON)
  databaseURL:
    "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();

// --- Telegram Configuration ---
const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
if (!apiId || !apiHash) {
  throw new Error("ตั้งค่า TELEGRAM_API_ID และ TELEGRAM_API_HASH ใน Environment Variables ก่อนเปิดเซิร์ฟเวอร์");
}
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");
const TARGET_BOT_USERNAME = "Kc_broadcast_Bot_bot";

// --- ฟังก์ชันส่ง Multicast (Firebase) ---
// เปลี่ยนจากเดิมในฟังก์ชัน sendToAllDevices เป็นแบบนี้ครับ
async function sendToAllDevices(text) {
  try {
    const snapshot = await db.ref("fcm_tokens").once("value");
    const entries = Object.entries(snapshot.val() || {}).filter(([, item]) =>
      item && typeof item.token === "string" && item.token.length > 0);
    const unique = new Map();
    for (const [key, item] of entries) {
      if (!unique.has(item.token)) unique.set(item.token, []);
      unique.get(item.token).push(key);
    }
    const targets = Array.from(unique, ([token, keys]) => ({ token, keys }));
    if (!targets.length) return console.log("ไม่มี FCM token ให้ส่ง");
    const messageText = String(text).slice(0, 2000);
    for (let i = 0; i < targets.length; i += 500) {
      const batch = targets.slice(i, i + 500);
      const response = await admin.messaging().sendEachForMulticast({
        data: {
          title: "📢 แจ้งเตือนใหม่จาก KC SMART",
          body: messageText,
          icon: "https://kc-smart.smtekc.com/KCsmartปก.png",
          url: "https://kc-smart.smtekc.com/"
        },
        tokens: batch.map(item => item.token),
      });
      console.log(`FCM ส่งสำเร็จ ${response.successCount}, ล้มเหลว ${response.failureCount}`);
      const obsolete = [];
      response.responses.forEach((result, index) => {
        if (result.success) return;
        const code = result.error?.code || "unknown";
        console.warn(`FCM ล้มเหลว: ${code}`);
        if (["messaging/registration-token-not-registered", "messaging/invalid-registration-token"].includes(code)) {
          obsolete.push(...batch[index].keys);
        }
      });
      if (obsolete.length) await Promise.all(obsolete.map(key => db.ref(`fcm_tokens/${key}`).remove()));
    }
  } catch (err) {
    console.error("ส่งแจ้งเตือน FCM ไม่สำเร็จ:", err);
  }
}

// --- API Endpoints ---
app.get("/ping", (req, res) =>
  res.status(200).send("เซิร์ฟเวอร์ตื่นอยู่จ้า! 🟢"),
);

// --- ระบบ Telegram Client ---
(async () => {
  console.log("⏳ กำลังเชื่อมต่อ Telegram...");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    useWSS: true,
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
        const username =
          sender && sender.username ? sender.username : "ไม่มี Username";

        if (
          username === TARGET_BOT_USERNAME ||
          username === "Kc_broadcast_Bot_bot"
        ) {
          console.log(
            `🚀 พบข้อความจากบอท กำลังส่งเข้า Firebase: ${message.text}`,
          );
          await sendToAllDevices(message.text);
        }
      } catch (err) {
        console.error("❌ Error ในการประมวลผลข้อความ:", err.message);
      }
    }, new NewMessage({}));
  } catch (connectError) {
    console.error(
      "❌ ไม่สามารถเชื่อมต่อกับ Telegram ได้:",
      connectError.message,
    );
  }
})();

app.listen(PORT, () => {
  console.log(`📡 ระบบเว็บปลุกทำงานที่พอร์ต ${PORT}`);
});
