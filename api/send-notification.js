const crypto = require("node:crypto");

const DATABASE_URL = "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app";
const HOME_URL = "https://kc-smart.smtekc.com/";
const INVALID_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

function reply(res, status, data) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(data);
}

function authorized(header, expected) {
  if (typeof expected !== "string" || expected.length < 16 ||
      typeof header !== "string" || !header.startsWith("Bearer ")) return false;
  const supplied = header.slice(7);
  const a = crypto.createHash("sha256").update(supplied).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

module.exports = async function sendNotification(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, {error: "ใช้ POST เท่านั้น"});
  }
  if (!process.env.ADMIN_BROADCAST_PASSWORD || process.env.ADMIN_BROADCAST_PASSWORD.length < 16 ||
      !process.env.FIREBASE_CREDENTIALS) {
    return reply(res, 503, {error: "เซิร์ฟเวอร์ยังไม่ได้ตั้งค่าการส่งแจ้งเตือน"});
  }
  if (!authorized(req.headers.authorization, process.env.ADMIN_BROADCAST_PASSWORD)) {
    return reply(res, 401, {error: "รหัสส่งประกาศไม่ถูกต้อง"});
  }

  let input;
  try {
    if (Number(req.headers["content-length"] || 0) > 4096) throw new Error("too large");
    input = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (_) {
    return reply(res, 400, {error: "รูปแบบข้อมูลไม่ถูกต้อง"});
  }
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  const body = typeof input?.body === "string" ? input.body.trim() : "";
  if (!title || !body || title.length > 80 || body.length > 500) {
    return reply(res, 400, {error: "กรอกหัวข้อ 1–80 ตัวอักษร และข้อความ 1–500 ตัวอักษร"});
  }

  try {
    const admin = require("firebase-admin");
    if (!admin.apps.length) {
      const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
        projectId: credentials.project_id,
        databaseURL: DATABASE_URL,
      });
    }
    const db = admin.database();
    const snapshot = await db.ref("fcm_tokens").once("value");
    const unique = new Map();
    for (const [key, entry] of Object.entries(snapshot.val() || {})) {
      if (!entry || typeof entry.token !== "string" || !entry.token) continue;
      if (!unique.has(entry.token)) unique.set(entry.token, []);
      unique.get(entry.token).push(key);
    }
    const targets = Array.from(unique, ([token, keys]) => ({token, keys}));
    if (!targets.length) return reply(res, 200, {success: 0, failure: 0, total: 0});

    let success = 0;
    let failure = 0;
    const staleKeys = [];
    for (let offset = 0; offset < targets.length; offset += 500) {
      const batch = targets.slice(offset, offset + 500);
      const result = await admin.messaging().sendEachForMulticast({
        tokens: batch.map(item => item.token),
        data: {title, body, icon: `${HOME_URL}KCsmartปก.png`, url: HOME_URL},
      });
      success += result.successCount;
      failure += result.failureCount;
      result.responses.forEach((item, index) => {
        if (!item.success && INVALID_TOKEN_CODES.has(item.error?.code)) {
          staleKeys.push(...batch[index].keys);
        }
      });
    }
    if (staleKeys.length) {
      await Promise.allSettled(staleKeys.map(key => db.ref(`fcm_tokens/${key}`).remove()));
    }
    return reply(res, 200, {success, failure, total: targets.length});
  } catch (error) {
    console.error("Admin broadcast failed:", error.code || error.message);
    return reply(res, 500, {error: "ส่งแจ้งเตือนไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Firebase และลองอีกครั้ง"});
  }
};
