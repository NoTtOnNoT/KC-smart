// [ส่วนที่ 1] ข้อมูลแอปทั้งหมด
const apps = [
    { n: "ตารางเรียน", u: "https://studentskc.sadaokc.com/", img: "KCsmartpic/pic1.png" },
    { n: "ตารางสอน", u: "https://teacherkc.sadaokc.com/", img: "KCsmartpic/pic2.png" },
    { n: "ตารางสอบ", u: "https://examschedule.sadaokc.com/", img: "KCsmartpic/pic3.png" },
    { n: "KC Music", u: "https://script.google.com/macros/s/AKfycbyrzFJhQZWMNKXdd7D5be5zSl0SVEuGVsGbCkRRa7tUBaxq7gv6aXGfJW0vZRmCCyyD/exec", img: "KCsmartpic/pic4.png" },
    { n: "Portfolio", u: "https://doportkc.sadaokc.com/", img: "KCsmartpic/pic5.png" },
    { n: "คำนวณเกรด", u: "https://calgrade.sadaokc.com/", img: "KCsmartpic/pic6.png" },
    { n: "KC LearnUp", u: "https://kclearnup.sadaokc.com/", img: "KCsmartpic/pic7.png" },
    { n: "รายชื่อนักเรียน", u: "https://script.google.com/macros/s/AKfycbwjFJ_Sw9fy8ciWUqccQ9ypdJgPsgtJ_c6Ab5cB0ACz21ybMu6lPmcEbuVdVrEhW4gQ/exec", img: "KCsmartpic/pic8.png" },
    { n: "คู่มือนักเรียน", u: "https://script.google.com/macros/s/AKfycbwCVMLiKr2RmWXHMeohO6tdGjuaNeeASn8PGm6zGjlDqgLFwIdbyoae7hfmErAG3MulvQ/exec", img: "KCsmartpic/pic9.png" },
    { n: "แจ้งข่าวสาร", u: "https://script.google.com/macros/s/AKfycbz1rmB_ZaYszuwFHAvpMP6oAS7IVGr93KV2QuFhsKRqR-jrUBcE-slfzM6gXE5Nr9eu/exec", img: "KCsmartpic/pic10.png" },
    { n: "ห้องสมุดออนไลน์", u: "http://khanchai.vlcloud.net/", img: "KCsmartpic/pic11.png" },
    { n: "งานทะเบียน", u: "#", img: "KCsmartpic/pic23.png" },
    { n: "ดูเกรดมัธยม", u: "http://www.dograde.online/khanchai/", img: "KCsmartpic/pic12.png" },
    { n: "ภาพกิจกรรม", u: "https://script.google.com/macros/s/AKfycbz_rtqBkrrFVoDmIkGHzAldYU1BpMBjp16gTsGxLcoueiygrEAMK_0qS2eaEELNPOYW/exec", img: "KCsmartpic/pic13.png" },
    { n: "วารสารโรงเรียน", u: "https://khanchai.ac.th/ebook", img: "KCsmartpic/pic14.png" },
    { n: "ดูเกรดปวช.", u: "https://script.google.com/macros/s/AKfycbxfEjNfbTZ86Dw1ekrIkz08KO9cwie1zV2khA5GiyeqgMBqCkJ6JESREzrpaVmDYiDQfA/exec", img: "KCsmartpic/pic15.png" },
    { n: "เพจโรงเรียน", u: "https://www.facebook.com/share/1CsCUxCFTF/", img: "KCsmartpic/pic16.png" },
    { n: "IDEA BOX", u: "https://topickc.sadaokc.com/submit.php", img: "KCsmartpic/pic17.png" },
    { n: "เพจสภา", u: "https://www.facebook.com/share/1Ha43rKgzp/", img: "KCsmartpic/pic18.png" },
    { n: "KC ScoreHub", u: "https://myscores.sadaokc.com/", img: "KCsmartpic/pic24.jpg" },
    { n: "% มาเรียน", u: "https://search.kc-lovecare.com/", img: "KCsmartpic/pic19.png" },
    { n: "โควตา ม.4", u: "https://quotam4.sadaokc.com/", img: "KCsmartpic/pic20.png" },
    { n: "ผ้าอนามัย", u: "https://freepads.sadaokc.com/", img: "KCsmartpic/pic21.png" },
    { n: "แก้ 0/ร/มผ", u: "https://script.google.com/macros/s/AKfycbyH81mDslsgy78twi-OzpJuyBtWZbTYBL2p5p_kEEKBCqgATztIzVHm3SnTyYv2rxl7/exec", img: "KCsmartpic/pic22.png" }
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

// ควบคุมปุ่มค้นหา
const searchBox = document.getElementById('searchBox');
const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('appSearch');
const mainFooter = document.querySelector('.special-footer');

searchToggle.addEventListener('click', function (e) {
    e.preventDefault();

    // เช็คว่ามี mainFooter ไหมก่อนรัน
    if (!mainFooter) return;

    const isExpanding = !mainFooter.classList.contains('expanded');
    mainFooter.classList.toggle('expanded');

    if (isExpanding) {
        // ใช้ชื่อ searchInput ให้ตรงกับที่ประกาศไว้ข้างบน
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    } else {
        if (searchInput) {
            searchInput.blur();
            searchInput.value = '';
        }
    }
});

// (ตัวเลือก) ปิดหน้าจอค้นหาเมื่อกดปุ่ม ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainFooter.classList.contains('expanded')) {
        mainFooter.classList.remove('expanded');
    }
});

// คลิกเปิด-ปิด
searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBox.classList.toggle('active');
    if (searchBox.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 300);
    } else {
        // เมื่อปิด ให้เคลียร์ช่องค้นหาและรีเซ็ตการกรอง
        searchInput.value = '';
        filterApps('');
    }
});

// คลิกข้างนอกให้หดกลับ
document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
        searchBox.classList.remove('active');
        searchInput.value = ''; // เคลียร์ช่องค้นหาเมื่อปิด
        filterApps(''); // รีเซ็ตการกรอง
    }
});

// ระบบค้นหา (กรองข้อมูล)
searchInput.addEventListener('input', function () {
    filterApps(this.value);
});

// ฟังก์ชันสำหรับกรองข้อมูลแอป (คุณต้องแก้ไข Class ให้ตรงกับของเดิม)
function filterApps(query) {
    const searchTerm = query.toLowerCase();
    const cards = document.querySelectorAll('.app-item, .app-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = ""; // ใช้ display เพื่อประหยัดพื้นที่
            // ใช้ requestAnimationFrame เพื่อให้ Browser รอจังหวะเรนเดอร์ opacity
            requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            });
        } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.8)";
            // รอให้ Animation จบก่อนค่อยสั่ง display: none
            setTimeout(() => {
                if (card.style.opacity === "0") card.style.display = "none";
            }, 300);
        }
    });
}

const header = document.querySelector('header');
header.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const buttons = document.querySelectorAll('button, .line-button');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (navigator.vibrate) {
            navigator.vibrate(10); // สั่นเบามาก 10 มิลลิวินาที
        }
    });
});

// ==========================================
// ระบบติดตั้งแอป KC SMART (Ultimate Hybrid Version)
// ==========================================

(function () {
    // 1. ประกาศตัวแปรหลัก
    let deferredPrompt = null;
    const installContainer = document.querySelector('.install-fab-container');
    const btnInstall = document.getElementById('btnInstall');

    // Elements ของ Custom Modal
    const customModal = document.getElementById('custom-install-modal');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const modalTitle = customModal?.querySelector('.modal-body h3');
    const modalBody = customModal?.querySelector('.modal-body p');

    // 2. ฟังก์ชันตรวจสอบสถานะและอุปกรณ์
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    const isStandalone = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    };

    const closeModal = () => {
        if (customModal) {
            customModal.classList.remove('active');
            setTimeout(() => { customModal.style.display = 'none'; }, 300);
        }
    };

    // --- เริ่มต้นการทำงาน (Hybrid Logic) ---

    const initInstallUI = () => {
        // ถ้าติดตั้งแอปแล้ว ไม่ต้องทำอะไรต่อ
        if (isStandalone()) {
            if (installContainer) installContainer.style.display = 'none';
            return;
        }

        // กรณี iOS: บังคับโชว์ปุ่มทันที เพราะ iOS ไม่มี Event อัตโนมัติ
        if (isIOS) {
            if (installContainer) installContainer.style.display = 'flex';
            console.log('🍎 iOS Mode: Show button immediately');
        }
    };

    // รันเช็คเบื้องต้นทันที
    initInstallUI();

    // 3. สำหรับ Android/Chrome: ดักจับ Event (มักจะมาช้า 5-15 วิ)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // ถ้าไม่ใช่ iOS และยังไม่ได้ติดตั้ง ให้แสดงปุ่มเมื่อ Event มาถึง
        if (!isIOS && installContainer && !isStandalone()) {
            installContainer.style.display = 'flex';
            console.log('🤖 Android Mode: Prompt Ready');
        }
    });

    // 4. เมื่อคลิกปุ่มติดตั้งหลัก
    if (btnInstall) {
        btnInstall.addEventListener('click', () => {
            if (isIOS) {
                // เนื้อหาพิเศษสำหรับ iOS
                if (modalTitle) modalTitle.innerText = "ติดตั้งบน iPhone / iPad";
                if (modalBody) modalBody.innerHTML = "แอปนี้ยังไม่ได้ติดตั้งในเครื่องของคุณ<br><br>1. กดปุ่ม <b>'แชร์' (Share)</b> <img src='https://img.icons8.com/ios/20/ffffff/share-rounded.png' style='vertical-align:middle'> ด้านล่าง<br>2. เลือกเมนู <b>'เพิ่มลงในหน้าจอโฮม'</b><br>(Add to Home Screen)";
                
                // ซ่อนปุ่ม "ติดตั้งเลย" เพราะ iOS บังคับให้กดผ่านเมนูเบราว์เซอร์เท่านั้น
                if (modalConfirm) modalConfirm.style.display = 'none'; 
                
                customModal.style.display = 'flex';
                requestAnimationFrame(() => customModal.classList.add('active'));
            } 
            else if (deferredPrompt) {
                // เนื้อหาปกติสำหรับ Android
                if (modalTitle) modalTitle.innerText = "ติดตั้ง KC SMART";
                if (modalBody) modalBody.innerText = "เพิ่มแอปไว้บนหน้าจอหลักเพื่อการใช้งานที่รวดเร็ว และดูสวยงามเหมือนแอปจริงในเครื่องคุณ";
                if (modalConfirm) modalConfirm.style.display = 'block';
                
                customModal.style.display = 'flex';
                requestAnimationFrame(() => customModal.classList.add('active'));
            } else {
                // กรณีฉุกเฉิน: ถ้าไม่มี prompt และไม่ใช่ iOS
                alert('เบราว์เซอร์ของคุณยังไม่พร้อมติดตั้ง หรือคุณได้ติดตั้งแอปไปแล้วครับ');
            }
        });
    }

    // 5. กดยืนยันติดตั้ง (เฉพาะ Android/PC)
    if (modalConfirm) {
        modalConfirm.addEventListener('click', async () => {
            if (deferredPrompt) {
                closeModal();
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    if (installContainer) installContainer.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });
    }

    if (modalCancel) modalCancel.addEventListener('click', closeModal);

    // ปิดเมื่อคลิกนอก Modal
    customModal?.addEventListener('click', (e) => {
        if (e.target === customModal) closeModal();
    });

    // 6. ซ่อนปุ่มเมื่อติดตั้งสำเร็จ
    window.addEventListener('appinstalled', () => {
        if (installContainer) installContainer.style.display = 'none';
        closeModal();
        console.log('🚀 Installed successfully');
    });

})();

// โค้ดสำหรับเช็คปัญหาบน iOS โดยเฉพาะ
(function() {
    const container = document.querySelector('.install-fab-container');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    if (!container) {
        alert("❌ ไม่พบ Class .install-fab-container ในหน้า HTML");
    } else if (isStandalone) {
        alert("✅ ตอนนี้คุณรันอยู่ในโหมดแอป (Standalone) แล้ว ปุ่มจึงไม่โชว์");
    } else if (isIOS) {
        container.style.display = 'flex';
        container.style.backgroundColor = 'red'; // ลองเปลี่ยนเป็นสีแดงดูว่าเห็นไหม
        alert("🍎 นี่คือ iOS และเครื่องควรจะโชว์ปุ่มสีแดงแล้ว ถ้ายังไม่เห็นแสดงว่า CSS ตัวอื่นบังอยู่");
    } else {
        alert("🤖 นี่ไม่ใช่ iOS (อาจเป็น Android หรือ PC)");
    }
})();