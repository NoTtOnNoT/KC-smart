// [ส่วนที่ 1] ข้อมูลแอปทั้งหมด
const apps = [
    { n: "ตารางเรียน", u: "https://studentskc.sadaokc.com/", img: "KCsmartpic/pic1.webp" },
    { n: "ตารางสอน", u: "https://teacherkc.sadaokc.com/", img: "KCsmartpic/pic2.webp" },
    { n: "ตารางสอบ", u: "https://examschedule.sadaokc.com/", img: "KCsmartpic/pic3.webp" },
    { n: "KC Music", u: "https://script.google.com/macros/s/AKfycbyrzFJhQZWMNKXdd7D5be5zSl0SVEuGVsGbCkRRa7tUBaxq7gv6aXGfJW0vZRmCCyyD/exec", img: "KCsmartpic/pic4.webp" },
    { n: "Portfolio", u: "https://doportkc.sadaokc.com/", img: "KCsmartpic/pic5.webp" },
    { n: "คำนวณเกรด", u: "https://calgrade.sadaokc.com/", img: "KCsmartpic/pic6.webp" },
    { n: "KC LearnUp", u: "https://kclearnup.sadaokc.com/", img: "KCsmartpic/pic7.webp" },
    { n: "รายชื่อนักเรียน", u: "https://script.google.com/macros/s/AKfycbwjFJ_Sw9fy8ciWUqccQ9ypdJgPsgtJ_c6Ab5cB0ACz21ybMu6lPmcEbuVdVrEhW4gQ/exec", img: "KCsmartpic/pic8.webp" },
    { n: "คู่มือนักเรียน", u: "https://script.google.com/macros/s/AKfycbwCVMLiKr2RmWXHMeohO6tdGjuaNeeASn8PGm6zGjlDqgLFwIdbyoae7hfmErAG3MulvQ/exec", img: "KCsmartpic/pic9.webp" },
    { n: "แจ้งข่าวสาร", u: "https://script.google.com/macros/s/AKfycbz1rmB_ZaYszuwFHAvpMP6oAS7IVGr93KV2QuFhsKRqR-jrUBcE-slfzM6gXE5Nr9eu/exec", img: "KCsmartpic/pic10.webp" },
    { n: "ห้องสมุดออนไลน์", u: "http://khanchai.vlcloud.net/", img: "KCsmartpic/pic11.webp" },
    { n: "งานทะเบียน", u: "https://sites.google.com/view/sadaokc-registrar", img: "KCsmartpic/pic23.webp" },
    { n: "ดูเกรดมัธยม", u: "http://www.dograde.online/khanchai/", img: "KCsmartpic/pic12.webp" },
    { n: "ภาพกิจกรรม", u: "https://script.google.com/macros/s/AKfycbz_rtqBkrrFVoDmIkGHzAldYU1BpMBjp16gTsGxLcoueiygrEAMK_0qS2eaEELNPOYW/exec", img: "KCsmartpic/pic13.webp" },
    { n: "วารสารโรงเรียน", u: "https://khanchai.ac.th/ebook", img: "KCsmartpic/pic14.webp" },
    { n: "ดูเกรดปวช.", u: "https://script.google.com/macros/s/AKfycbxfEjNfbTZ86Dw1ekrIkz08KO9cwie1zV2khA5GiyeqgMBqCkJ6JESREzrpaVmDYiDQfA/exec", img: "KCsmartpic/pic15.webp" },
    { n: "เพจโรงเรียน", u: "https://www.facebook.com/share/1CsCUxCFTF/", img: "KCsmartpic/pic16.webp" },
    { n: "IDEA BOX", u: "https://topickc.sadaokc.com/submit.php", img: "KCsmartpic/pic17.webp" },
    { n: "เพจสภา", u: "https://www.facebook.com/share/1Ha43rKgzp/", img: "KCsmartpic/pic18.webp" },
    { n: "KC ScoreHub", u: "https://myscores.sadaokc.com/", img: "KCsmartpic/pic24.webp" },
    { n: "% มาเรียน", u: "https://search.kc-lovecare.com/", img: "KCsmartpic/pic19.webp" },
    { n: "โควตา ม.4", u: "https://quotam4.sadaokc.com/", img: "KCsmartpic/pic20.webp" },
    { n: "ผ้าอนามัย", u: "https://freepads.sadaokc.com/", img: "KCsmartpic/pic21.webp" },
    { n: "แก้ 0/ร/มผ", u: "https://script.google.com/macros/s/AKfycbyH81mDslsgy78twi-OzpJuyBtWZbTYBL2p5p_kEEKBCqgATztIzVHm3SnTyYv2rxl7/exec", img: "KCsmartpic/pic22.webp" }
];

// [ส่วนที่ 2] ฟังก์ชันสร้าง Grid
function createAppGrid() {
    const grid = document.getElementById('main-grid');
    const popup = document.getElementById('loading-popup');
    const appNameDisplay = document.getElementById('target-app-name');

    if (!grid) return;

    // เคลียร์ Grid ก่อนเผื่อรันซ้ำ
    grid.innerHTML = '';

    apps.forEach((app, index) => {
        const card = document.createElement('a');
        card.href = app.u || "javascript:void(0)";
        card.className = 'app-card';

        // ปรับ Delay เริ่มต้นที่ 0.1s หลังจากหน้าโหลดจางหายไป
        card.style.animationDelay = `${(index * 0.03) + 0.1}s`;

        card.innerHTML = `
            <div class="icon-container">
                <img src="${app.img}" alt="${app.n}" fetchpriority="high" decoding="async">
            </div>
            <div class="app-label">${app.n}</div>
        `;

        // Event Listeners สำหรับ Mobile
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
                    // Reset สถานะเผื่อผู้ใช้กดย้อนกลับ
                    setTimeout(() => popup.classList.remove('active'), 2000);
                }, 400);
            }
        });
        grid.appendChild(card);
    });
}

// [ส่วนที่ 3] ฟังก์ชันจัดการ Splash Screen และลำดับการรัน
async function initApp() {
    const splash = document.getElementById('splash-screen');
    const typingElement = document.getElementById('typing-text');
    const fullText = "Sadao Khanchai Kamphalanon Anusorn School";

    // --- 1. ฟังก์ชันพิมพ์ข้อความ (Typing Effect) ---
    const typeWriter = (text) => {
        return new Promise((resolve) => {
            let i = 0;
            typingElement.innerHTML = '';

            // --- เพิ่มบรรทัดนี้: เปิดขีดพิมพ์เมื่อเริ่มฟังก์ชัน ---
            typingElement.classList.add('is-typing');

            function type() {
                if (i < text.length) {
                    typingElement.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, 35);
                } else {
                    // พิมพ์จบแล้ว รอแป๊บนึงค่อยเอาขีดออก
                    setTimeout(() => {
                        // --- แก้ไขตรงนี้: ลบ Class ออกเพื่อให้ขีดหายไป ---
                        typingElement.classList.remove('is-typing');
                        resolve();
                    }, 500);
                }
            }
            type();
        });
    };

    // --- 2. ฟังก์ชันโหลดรูป (Background Decoding) ---
    const loadImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.decode()
                .then(() => resolve(img))
                .catch(() => resolve());
        });
    };

    // --- 3. เริ่มกระบวนการแอนิเมชันและโหลดข้อมูล ---

    // โหลดรูปสำคัญรอไว้เบื้องหลัง (ไม่ขัดจังหวะแอนิเมชัน)
    const criticalImages = [
        'KClogo.png',
        'KCsmart.png',
        ...apps.slice(0, 8).map(app => app.img)
    ];
    const loadAssetsTask = Promise.all(criticalImages.map(url => loadImage(url)));

    if (splash) {
        // [จังหวะที่ 1] แสดงโลโก้ 2 อันเด้งออกมา (ชิดกัน)
        // ใช้ requestAnimationFrame เพื่อให้ Browser เตรียมตัวทัน
        requestAnimationFrame(() => {
            splash.classList.add('start-anim');
        });

        // [จังหวะที่ 2] รอให้โลโก้เด้งเสร็จ (800ms) แล้วกางข้อความ KC SMART แทรกตรงกลาง
        await new Promise(res => setTimeout(res, 800));
        splash.classList.add('show-text');

        // [จังหวะที่ 3] รอให้ข้อความกางเสร็จ (อีก 800ms) แล้วเริ่มพิมพ์ชื่อโรงเรียน
        await new Promise(res => setTimeout(res, 800));
        await typeWriter(fullText);
    }

    // [จังหวะที่ 4] รอให้รูปภาพโหลดเสร็จ (ถ้าแอนิเมชันจบก่อน) และเผื่อเวลาดูผลงาน
    await loadAssetsTask;
    await new Promise(res => setTimeout(res, 600));

    // --- 4. ปิด Splash Screen และเริ่มแสดงหน้าแอป ---
    createAppGrid();

    if (splash) {
        splash.classList.add('fade-out');
        document.body.classList.add('app-loaded');

        // ลบ Element ออกจากหน้าจอเพื่อความลื่นไหลของเครื่องผู้ใช้
        setTimeout(() => {
            splash.remove();
        }, 1000);
    }

    // โหลดรูปที่เหลือแบบ Background
    apps.slice(8).forEach(app => loadImage(app.img));

    // ระบบความปลอดภัย
    document.oncontextmenu = () => false;
    document.onselectstart = () => false;
    document.ondragstart = () => false;
}

// [ส่วนที่ 4] รันระบบ
document.addEventListener('DOMContentLoaded', () => {
    // รันเฉพาะ Splash/Init ก่อน เพื่อความเร็วในการตอบสนองแรก
    initApp();

    // เรียกชุดควบคุม Search UI ที่ปลอดภัย
    initSearchControls();
});

function initSearchControls() {
    const searchBox = document.getElementById('searchBox');
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.getElementById('appSearch');
    const mainFooter = document.querySelector('.special-footer');

    if (!searchBox || !searchToggle || !searchInput || !mainFooter) {
        console.warn('Search UI หรือ footer ไม่ครบ');
        return;
    }

    const toggleSearch = (show) => {
        if (show) {
            mainFooter.classList.add('expanded');
            searchBox.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        } else {
            mainFooter.classList.remove('expanded');
            searchBox.classList.remove('active');
            searchInput.value = '';
            filterApps('');
        }
    };

    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanding = !mainFooter.classList.contains('expanded');
        toggleSearch(isExpanding);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainFooter.classList.contains('expanded')) {
            toggleSearch(false);
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
            toggleSearch(false);
        }
    });

    searchInput.addEventListener('input', function () {
        filterApps(this.value);
    });
}

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
if (header) {
    header.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const buttons = document.querySelectorAll('button, .line-button');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (navigator.vibrate) {
            navigator.vibrate(10); // สั่นเบามาก 10 มิลลิวินาที
        }
    });
});

// ==========================================
// ระบบติดตั้งแอป KC SMART (Ultimate Hybrid Version - Fixed iPadOS)
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

    // 2. ฟังก์ชันตรวจสอบอุปกรณ์ (รองรับ iPhone และ iPadOS รุ่นใหม่)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

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

        // กรณี iOS/iPadOS: บังคับโชว์ปุ่มทันที เพราะระบบไม่มี Event อัตโนมัติ
        if (isIOS) {
            if (installContainer) {
                // ใช้ setProperty เพื่อให้มั่นใจว่า CSS display จะถูกทับแน่นอน
                installContainer.style.setProperty('display', 'flex', 'important');
            }
            console.log('🍎 iOS/iPadOS Mode: Show button immediately');
        }
    };

    // รันเช็คเบื้องต้นทันที
    initInstallUI();

    // 3. สำหรับ Android/Chrome: ดักจับ Event (มักจะมาช้าตามรอบเบราว์เซอร์)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // ถ้าไม่ใช่ iOS และยังไม่ได้ติดตั้ง ให้แสดงปุ่มเมื่อ Event มาถึง
        if (!isIOS && installContainer && !isStandalone()) {
            installContainer.style.setProperty('display', 'flex', 'important');
            console.log('🤖 Android Mode: Prompt Ready');
        }
    });

    // 4. เมื่อคลิกปุ่มติดตั้งหลัก
    if (btnInstall) {
        btnInstall.addEventListener('click', () => {
            if (isIOS) {
                // เนื้อหาพิเศษสำหรับ iOS/iPadOS
                if (modalTitle) modalTitle.innerText = "ติดตั้ง KC Smart บน ios";
                if (modalBody) modalBody.innerHTML = "1. กดปุ่ม <b>'แชร์' (Share)</b> ด้านบนขวาของเบราว์เซอร์<br>2. เลือกเมนู <b>'เพิ่มลงในหน้าจอโฮม'</b><br>(Add to Home Screen)";

                // ซ่อนปุ่ม "ติดตั้งเลย" เพราะ iOS บังคับให้กดผ่านเมนู Safari เท่านั้น
                if (modalConfirm) modalConfirm.style.display = 'none';

                customModal.style.display = 'flex';
                requestAnimationFrame(() => customModal.classList.add('active'));
            }
            else if (deferredPrompt) {
                // เนื้อหาปกติสำหรับ Android
                if (modalTitle) modalTitle.innerText = "ติดตั้ง KC Smart";
                if (modalBody) modalBody.innerText = "เพิ่ม KC Smart ไว้บนหน้าจอหลัก เพื่อสามารถเข้าใช้งานได้อย่างรวดเร็วจ้าาา!";
                if (modalConfirm) {
                    modalConfirm.style.display = 'block';
                    modalConfirm.innerText = "ติดตั้งเลย";
                }

                customModal.style.display = 'flex';
                requestAnimationFrame(() => customModal.classList.add('active'));
            } else {
                alert('ขออภัย! ระบบยังไม่พร้อมติดตั้งในขณะนี้ หรือคุณได้ติดตั้งแอปไปแล้วครับ');
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registered!', reg))
            .catch(err => console.log('Service Worker Registration Failed:', err));
    });
}
