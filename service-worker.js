// บังคับให้ Service Worker ตัวใหม่ทำงานทันที ไม่ต้องรอลูกค้าปิดแอปเก่า
self.addEventListener('install', event => {
  self.skipWaiting();
});

// ==========================================
// 1. ส่วนของ FIREBASE BACKGROUND MESSAGING
// ==========================================

// นำเข้าไลบรารี Firebase SDK เวอร์ชันเดียวกับหน้าเว็บ (9.23.0 Compat)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// 💡 [จุดสำคัญ] ก๊อปปี้เอาค่า firebaseConfig จากในไฟล์ script.js ของคุณมาวางตรงนี้
const firebaseConfig = {
  apiKey: "AIzaSyA8G5AS0EOAwFSh6krkiZlOrxEZ_pwL2ng",
  authDomain: "kc-smart.firebaseapp.com",
  databaseURL: "https://kc-smart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kc-smart",
  storageBucket: "kc-smart.firebasestorage.app",
  messagingSenderId: "972939980061",
  appId: "1:972939980061:web:3a114c024c9ed19a4545f4"
};

// เริ่มการทำงานของ Firebase ใน Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ฟังก์ชันดักจับข้อความแจ้งเตือนเมื่อแอปอยู่เบื้องหลัง (Background / ปิดหน้าจอ)
messaging.onBackgroundMessage((payload) => {
    console.log('🔔 ได้รับการแจ้งเตือนเบื้องหลัง:', payload);

    const notificationTitle = payload.notification.title || "ประกาศจาก KC SMART";
    const notificationOptions = {
        body: payload.notification.body || "คุณมีข้อความใหม่",
        icon: payload.notification.icon || 'KClogo.png', // รูปไอคอนที่จะโชว์ในการแจ้งเตือน
        badge: 'KClogo.png',                            // ไอคอนเล็กๆ บนแถบสถานะของ Android
        data: payload.data                              // ส่งข้อมูลแนบไป เผื่อใช้เปิดลิงก์
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// ฟังก์ชันเมื่อผู้ใช้ "คลิก" ที่การแจ้งเตือน -> ให้เปิดแอป KC SMART ขึ้นมา
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // ปิดแถบแจ้งเตือน

    // สั่งให้เปิดหน้าเว็บ/แอป หรือถ้าเปิดอยู่แล้วให้เด้งไปที่หน้านั้นทันที
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});


// ==========================================
// 2. ส่วนของ PWA OFFLINE CACHING (โค้ดเดิมของคุณ)
// ==========================================

const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
]

const getFixedUrl = (req) => {
    var now = Date.now()
    var url = new URL(req.url)
    url.protocol = self.location.protocol

    if (url.hostname === self.location.hostname) {
        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now
    }
    return url.href
}

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        event.respondWith(
            Promise.race([fetched.catch(_ => cached), cached])
                .then(resp => resp || fetched)
                .catch(_ => { /* eat any errors */ })
        )

        event.waitUntil(
            Promise.all([fetchedCopy, caches.open("pwa-cache")])
                .then(([response, cache]) => response.ok && cache.put(event.request, response))
                .catch(_ => { /* eat any errors */ })
        )
    }
})