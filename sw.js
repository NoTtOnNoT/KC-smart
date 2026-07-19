// ==========================================
// 1. นำเข้า Firebase SDK สำหรับ Service Worker
// ==========================================
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Config ของโปรเจกต์ KC SMART
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

// ==========================================
// 2. ส่วนของ PWA Caching
// ==========================================
const CACHE_NAME = 'kc-smart-v1.2'; // อัปเดตเวอร์ชันเพื่อรีเฟรชระบบ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './KClogo.png',
  './KCsmart.png',
  './KCsmartปก.png',
  './KCsmartpic/pic1.webp',
  './KCsmartpic/pic2.webp',
  './KCsmartpic/pic3.webp',
  './KCsmartpic/pic4.webp',
  './KCsmartpic/pic5.webp',
  './KCsmartpic/pic6.webp',
  './KCsmartpic/pic7.webp',
  './KCsmartpic/pic8.webp',
  './KCsmartpic/pic9.webp',
  './KCsmartpic/pic10.webp',
  './KCsmartpic/pic11.webp',
  './KCsmartpic/pic12.webp',
  './KCsmartpic/pic13.webp',
  './KCsmartpic/pic14.webp',
  './KCsmartpic/pic15.webp',
  './KCsmartpic/pic16.webp',
  './KCsmartpic/pic17.webp',
  './KCsmartpic/pic18.webp',
  './KCsmartpic/pic19.webp',
  './KCsmartpic/pic20.webp',
  './KCsmartpic/pic21.webp',
  './KCsmartpic/pic22.webp',
  './KCsmartpic/pic23.webp',
  './KCsmartpic/pic24.webp'
];

// ยุบรวม event 'install' ไว้ที่เดียวกัน
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 เคชไฟล์สำเร็จ (v1.2)!');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // บังคับให้ Service Worker ตัวใหม่ทำงานทันที ไม่ต้องรอลูกค้าปิดแอปเก่า
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ==========================================
// 3. ดักจับ Notification (รองรับทั้ง FCM และ DevTools)
// ==========================================
self.addEventListener('push', (event) => {
  let title = '📢 มีแจ้งเตือนใหม่!';
  let body = 'มีข่าวสารใหม่จาก KC_broadcast_Bot';
  let icon = './KCsmartปก.png'; 

  if (event.data) {
    try {
      const data = event.data.json();
      if (data.notification) {
        title = data.notification.title || title;
        body = data.notification.body || body;
        icon = data.notification.icon || icon;
      } else if (data.data) {
        title = data.data.title || title;
        body = data.data.body || body;
      } else {
        body = event.data.text();
      }
    } catch (e) {
      body = event.data.text();
    }
  }

  const options = {
    body: body,
    icon: icon,
    badge: './KClogo.png', 
    vibrate: [200, 100, 200], 
    data: {
      url: '/' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// เมื่อผู้ใช้คลิกที่ตัวแจ้งเตือน
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});