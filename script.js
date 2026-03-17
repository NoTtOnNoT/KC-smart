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
// ระบบติดตั้งแอป KC SMART (Premium Version)
// ==========================================

(function () {
    // 1. ประกาศตัวแปรหลัก
    let deferredPrompt = null;
    const installContainer = document.querySelector('.install-fab-container');
    const btnInstall = document.getElementById('btnInstall');

    // ตัวแปรสำหรับ Custom Modal
    const customModal = document.getElementById('custom-install-modal');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');

    /**
     * ฟังก์ชันตรวจสอบว่ารันอยู่ในโหมด App หรือไม่
     */
    const isStandalone = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://');
    };

    /**
     * ฟังก์ชันสำหรับปิด Modal อย่างนุ่มนวล
     */
    const closeModal = () => {
        if (customModal) {
            customModal.classList.remove('active');
            setTimeout(() => {
                customModal.style.display = 'none';
            }, 300);
        }
    };

    // --- เริ่มต้นการทำงาน ---

    // A. เช็คโหมด Standalone ทันทีที่โหลด
    if (isStandalone()) {
        console.log('📱 App Mode: เข้าใช้งานผ่านแอปที่ติดตั้งแล้ว');
        if (installContainer) installContainer.style.display = 'none';
    }

    // B. ดักจับเหตุการณ์ก่อนติดตั้ง (PWA Trigger)
    window.addEventListener('beforeinstallprompt', (e) => {
        // ป้องกัน Browser แสดง Prompt เอง
        e.preventDefault();

        // เก็บสิทธิ์ไว้ใช้งาน
        deferredPrompt = e;

        // แสดงปุ่มติดตั้งเฉพาะเมื่อไม่ได้อยู่ในโหมด Standalone
        if (installContainer && !isStandalone()) {
            installContainer.style.display = 'flex';
            console.log('✅ PWA: ระบบพร้อมสำหรับการติดตั้ง');
        }
    });

    // C. การจัดการปุ่มติดตั้งหลักบนหน้าเว็บ
    if (btnInstall) {
        btnInstall.addEventListener('click', () => {
            console.log('🔘 คลิกปุ่มติดตั้งหลัก');

            if (deferredPrompt) {
                // แสดง Custom Modal ของเรา
                if (customModal) {
                    customModal.style.display = 'flex';
                    // ให้ Browser render display:flex ก่อนจึงใส่ class active
                    requestAnimationFrame(() => {
                        customModal.classList.add('active');
                    });
                }
            } else {
                // กรณีไม่มีสิทธิ์ (ติดตั้งแล้ว/iOS/Browser ไม่รองรับ)
                const msg = isStandalone()
                    ? 'แอปนี้ถูกติดตั้งและใช้งานอยู่แล้วจ้าาา'
                    : 'ขออภัย! ขณะนี้ระบบติดตั้งอัตโนมัติไม่พร้อมใช้งาน คุณสามารถติดตั้งได้ด้วยตนเองผ่านเมนู "เพิ่มลงในหน้าจอหลัก" ของเบราว์เซอร์ได้เลยครับ';
                alert(msg);
            }
        });
    }

    // D. กดยืนยันใน Custom Modal
    if (modalConfirm) {
        modalConfirm.addEventListener('click', async () => {
            console.log('🔘 กดยืนยันการติดตั้ง');
            closeModal();

            if (deferredPrompt) {
                // เรียก Prompt ของระบบ (Native)
                deferredPrompt.prompt();

                try {
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`👤 ผู้ใช้ตัดสินใจ: ${outcome}`);

                    if (outcome === 'accepted') {
                        if (installContainer) installContainer.style.display = 'none';
                    }
                } catch (err) {
                    console.error('Error during installation:', err);
                } finally {
                    deferredPrompt = null;
                }
            }
        });
    }

    // E. กดยกเลิกใน Custom Modal
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }

    // F. คลิกพื้นที่ว่างนอก Modal เพื่อปิด
    if (customModal) {
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) closeModal();
        });
    }

    // G. เมื่อติดตั้งสำเร็จสมบูรณ์
    window.addEventListener('appinstalled', (evt) => {
        console.log('🚀 ยินดีด้วย! KC SMART ติดตั้งลงเครื่องสำเร็จ');
        deferredPrompt = null;
        if (installContainer) installContainer.style.display = 'none';
        closeModal();
    });

})();