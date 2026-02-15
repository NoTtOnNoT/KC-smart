// [ส่วนที่ 1] ข้อมูลแอปทั้งหมด
const apps = [
    { n: "ตารางเรียน", u: "https://studentskc.sadaokc.com/", img: "pic1.png" },
    { n: "ตารางสอน", u: "https://teacherkc.sadaokc.com/", img: "pic2.png" },
    { n: "ตารางสอบ", u: "https://examschedule.sadaokc.com/", img: "pic3.png" },
    { n: "KC Music", u: "https://script.google.com/macros/s/AKfycbyrzFJhQZWMNKXdd7D5be5zSl0SVEuGVsGbCkRRa7tUBaxq7gv6aXGfJW0vZRmCCyyD/exec", img: "pic4.png" },
    { n: "Portfolio", u: "https://doportkc.sadaokc.com/", img: "pic5.png" },
    { n: "คำนวณเกรด", u: "https://calgrade.sadaokc.com/", img: "pic6.png" },
    { n: "KC LearnUp", u: "https://kclearnup.sadaokc.com/", img: "pic7.png" },
    { n: "รายชื่อนักเรียน", u: "https://script.google.com/macros/s/AKfycbwjFJ_Sw9fy8ciWUqccQ9ypdJgPsgtJ_c6Ab5cB0ACz21ybMu6lPmcEbuVdVrEhW4gQ/exec", img: "pic8.png" },
    { n: "คู่มือนักเรียน", u: "https://script.google.com/macros/s/AKfycbwCVMLiKr2RmWXHMeohO6tdGjuaNeeASn8PGm6zGjlDqgLFwIdbyoae7hfmErAG3MulvQ/exec", img: "pic9.png" },
    { n: "แจ้งข่าวสาร", u: "https://script.google.com/macros/s/AKfycbz1rmB_ZaYszuwFHAvpMP6oAS7IVGr93KV2QuFhsKRqR-jrUBcE-slfzM6gXE5Nr9eu/exec", img: "pic10.png" },
    { n: "ห้องสมุดออนไลน์", u: "http://khanchai.vlcloud.net/", img: "pic11.png" },
    { n: "งานทะเบียน", u: "#", img: "pic23.png" },
    { n: "ดูเกรดมัธยม", u: "http://www.dograde.online/khanchai/", img: "pic12.png" },
    { n: "ภาพกิจกรรม", u: "https://script.google.com/macros/s/AKfycbz_rtqBkrrFVoDmIkGHzAldYU1BpMBjp16gTsGxLcoueiygrEAMK_0qS2eaEELNPOYW/exec", img: "pic13.png" },
    { n: "วารสารโรงเรียน", u: "https://khanchai.ac.th/ebook", img: "pic14.png" },
    { n: "ดูเกรดปวช.", u: "https://script.google.com/macros/s/AKfycbxfEjNfbTZ86Dw1ekrIkz08KO9cwie1zV2khA5GiyeqgMBqCkJ6JESREzrpaVmDYiDQfA/exec", img: "pic15.png" },
    { n: "เพจโรงเรียน", u: "https://www.facebook.com/share/1CsCUxCFTF/", img: "pic16.png" },
    { n: "IDEA BOX", u: "https://topickc.sadaokc.com/submit.php", img: "pic17.png" },
    { n: "เพจสภา", u: "https://www.facebook.com/share/1Ha43rKgzp/", img: "pic18.png" },
    { n: "KC ScoreHub", u: "https://myscores.sadaokc.com/", img: "pic24.jpg" },
    { n: "% มาเรียน", u: "https://search.kc-lovecare.com/", img: "pic19.png" },
    { n: "โควตา ม.4", u: "https://quotam4.sadaokc.com/", img: "pic20.png" },
    { n: "ผ้าอนามัย", u: "https://freepads.sadaokc.com/", img: "pic21.png" },
    { n: "แก้ 0/ร/มผ", u: "https://script.google.com/macros/s/AKfycbyH81mDslsgy78twi-OzpJuyBtWZbTYBL2p5p_kEEKBCqgATztIzVHm3SnTyYv2rxl7/exec", img: "pic22.png" }
];

// [ส่วนที่ 2] ฟังก์ชันสร้าง Grid
function createAppGrid() {
    const grid = document.getElementById('main-grid');
    const popup = document.getElementById('loading-popup');
    const appNameDisplay = document.getElementById('target-app-name');

    if (!grid) return;

    apps.forEach((app, index) => {
        const card = document.createElement('a');
        card.href = app.u || "javascript:void(0)";
        card.className = 'app-card';

        // ปรับ Delay ให้สั้นลงเพื่อให้รู้สึกเร็วขึ้น (0.03s แทน 0.04s)
        card.style.animationDelay = `${(index * 0.03) + 0.6}s`;

        card.innerHTML = `
            <div class="icon-container">
                <img src="${app.img}" alt="${app.n}" fetchpriority="high" decoding="async">
            </div>
            <div class="app-label">${app.n}</div>
        `;

        // Event Listeners สำหรับสัมผัส
        card.addEventListener('touchstart', () => card.classList.add('active'), { passive: true });
        card.addEventListener('touchend', () => card.classList.remove('active'), { passive: true });

        card.addEventListener('click', (e) => {
            if (app.u && app.u !== "#") {
                e.preventDefault();
                if (navigator.vibrate) navigator.vibrate(50);
                if (appNameDisplay) appNameDisplay.innerText = `กำลังเปิด ${app.n}...`;
                if (popup) popup.classList.add('active');

                setTimeout(() => {
                    window.location.href = app.u;
                    // ล้างสถานะเมื่อ User กด Back กลับมา
                    setTimeout(() => popup.classList.remove('active'), 2000);
                }, 400); // ลดเวลาหน่วงก่อนเปลี่ยนหน้าให้กระชับขึ้น
            }
        });
        grid.appendChild(card);
    });
}

// [ส่วนที่ 3] ฟังก์ชันเริ่มระบบและจัดการ Splash Screen
async function initApp() {
    const splashScreen = document.getElementById('splash-screen');

    // 1. เริ่ม Preload รูปภาพทั้งหมดทันทีเบื้องหลัง
    const preloadAllImages = apps.map(app => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = app.img;
            img.onload = resolve;
            img.onerror = resolve; // ข้ามรูปที่เสีย
        });
    });

    // 2. กำหนดเวลาขั้นต่ำที่ต้องโชว์ Splash (เพื่อให้ไม่กระพริบเร็วเกินไป)
    const minimumDisplayTime = new Promise(resolve => setTimeout(resolve, 800));

    // 3. รอจนกว่า: (รูปภาพ 8 รูปแรกโหลดเสร็จ) AND (เวลาขั้นต่ำผ่านไป)
    // การรอแค่ 8 รูปแรกช่วยให้แอปเปิดเร็วขึ้นในขณะที่รูปที่เหลือจะทยอยตามมาเอง
    const criticalImages = preloadAllImages.slice(0, 8);

    await Promise.all([...criticalImages, minimumDisplayTime]);

    if (splashScreen) {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.remove();
        }, 300);
    }

    // ระบบความปลอดภัย
    document.oncontextmenu = () => false;
    document.onselectstart = () => false;
    document.ondragstart = () => false;
}

// [ส่วนที่ 4] รันระบบ
document.addEventListener('DOMContentLoaded', () => {
    createAppGrid();
    initApp();
});