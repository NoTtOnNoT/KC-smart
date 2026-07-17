// นำเข้า Firebase SDK สำหรับ Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// ใส่ Firebase Config ของคุณตรงนี้
const firebaseConfig = {
  apiKey: "AIzaSyA8G5AS0EOAwFSh6krkiZlOrxEZ_pwL2ng",
  authDomain: "kc-smart.firebaseapp.com",
  databaseURL: "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kc-smart",
  storageBucket: "kc-smart.firebasestorage.app",
  messagingSenderId: "972939980061",
  appId: "1:972939980061:web:3a114c024c9ed19a4545f4"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// ดักจับข้อความเมื่อแอปอยู่เบื้องหลัง (Background) หรือปิดไปแล้ว
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] ได้รับข้อความเบื้องหลัง: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/KClogo.png' // ใส่โลโก้เว็บของคุณที่นี่
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});