const CACHE_NAME = 'kc-smart-v1.1'; // เปลี่ยนเลขเวอร์ชันเวลาอัปเดตรูปใหม่
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './KClogo.png',
  './KCsmart.png',
  './KCsmartปก.png',
  // รายการรูปในโฟลเดอร์
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

// 1. ติดตั้งและเก็บไฟล์ลง Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 เคชไฟล์สำเร็จ!');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // ให้แอปอัปเดตเวอร์ชันใหม่ทันที
});

// 2. ลบ Cache เก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน (ป้องกันเครื่องเต็ม)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. ดึงไฟล์จาก Cache มาโชว์ (หัวใจของความเร็ว)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // ถ้ามีใน Cache ให้ใช้เลย ถ้าไม่มีให้ไปดึงจากเน็ต
      return response || fetch(event.request);
    })
  );
});

// ==========================================
// 4. ดักจับ Notification (Web Push / FCM)
// ==========================================
self.addEventListener('push', (event) => {
  let title = '📢 มีแจ้งเตือนใหม่!';
  let body = 'มีข่าวสารใหม่จาก KC_broadcast_Bot';
  let icon = './KClogo.png'; // ไอคอนที่จะแสดงในแจ้งเตือน

  if (event.data) {
    try {
      // แปลงข้อมูลเป็น JSON (กรณีส่งมาจาก Firebase / Node.js)
      const data = event.data.json();
      
      // ดักจับโครงสร้างข้อความจาก Firebase Cloud Messaging
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
      // ถ้าข้อมูลที่ส่งมาไม่ใช่ JSON ให้มองเป็นข้อความธรรมดา
      body = event.data.text();
    }
  }

  const options = {
    body: body,
    icon: icon,
    badge: './KClogo.png', // ไอคอนเล็กๆ บน Status bar ของแอนดรอยด์
    vibrate: [200, 100, 200], // รูปแบบการสั่น (สั่น-หยุด-สั่น)
    data: {
      url: '/' // ลิงก์ที่จะเปิดเมื่อผู้ใช้กดที่ข้อความแจ้งเตือน
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ==========================================
// 5. เมื่อผู้ใช้คลิกที่ตัวแจ้งเตือน
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // ปิดแจ้งเตือนเมื่อคลิก
  
  // ให้เปิดหน้าเว็บหรือดึงหน้าเว็บเดิมขึ้นมาแสดง
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});