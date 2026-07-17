import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8G5AS0EOAwFSh6krkiZlOrxEZ_pwL2ng",
  authDomain: "kc-smart.firebaseapp.com",
  databaseURL: "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kc-smart",
  storageBucket: "kc-smart.firebasestorage.app",
  messagingSenderId: "972939980061",
  appId: "1:972939980061:web:3a114c024c9ed19a4545f4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ฟังก์ชันขอสิทธิ์แจ้งเตือนและรับ Token
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('ผู้ใช้ยอมรับการแจ้งเตือนแล้ว');
      
      // ดึง Token ของผู้ใช้เครื่องนี้ (ต้องใส่ VAPID Key ที่ได้จาก Firebase Console)
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BGJa_Jny-1OLkMSdTNcv-xhkaxGqLnH8RTXWFCDb-mIudG02l4HfwaRRy3frG5DT_fKmTbUn29DkhukOpt07ptw' 
      });

      if (currentToken) {
        console.log('FCM Token ของผู้ใช้:', currentToken);
        // TODO: ส่ง Token นี้ไปเก็บที่ฐานข้อมูลของคุณ หรือสั่งให้สมัครเข้า Topic 'announcements'
        await subscribeToTopic(currentToken);
      } else {
        console.log('ไม่ได้รับ Token สิทธิ์อาจถูกปฏิเสธ');
      }
    } else {
      console.log('ผู้ใช้ปฏิเสธการแจ้งเตือน');
    }
  } catch (err) {
    console.log('เกิดข้อผิดพลาดในการขอสิทธิ์:', err);
  }
}

// แนะนำให้เรียกฟังก์ชันนี้ตอนที่ผู้ใช้กดปุ่มยอมรับบนหน้าเว็บของคุณ
// requestNotificationPermission();