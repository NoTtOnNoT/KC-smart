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
  './screenshot1.png',
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