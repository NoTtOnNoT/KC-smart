/**
 * load-script.js 
 * สำหรับใช้ในหน้า load.html เพื่อโชว์ Splash Screen Animation โดยเฉพาะ
 */

async function runSplashPreview() {
    const splash = document.getElementById('splash-screen');
    const typingElement = document.getElementById('typing-text');
    const fullText = "Sadao Khanchai Kamphalanon Anusorn School";

    // --- 1. ฟังก์ชันพิมพ์ข้อความ (Typing Effect) ---
    const typeWriter = (text) => {
        return new Promise((resolve) => {
            let i = 0;
            typingElement.innerHTML = '';
            typingElement.classList.add('is-typing');

            function type() {
                if (i < text.length) {
                    typingElement.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, 40); // ความเร็วในการพิมพ์
                } else {
                    setTimeout(() => {
                        typingElement.classList.remove('is-typing');
                        resolve();
                    }, 1000); // พิมพ์จบแล้วค้างไว้ 1 วินาที
                }
            }
            type();
        });
    };

    if (splash) {
        // [Step 1] เริ่มแอนิเมชันโลโก้เด้ง
        requestAnimationFrame(() => {
            splash.classList.add('start-anim');
        });

        // [Step 2] รอโลโก้เด้ง (800ms) แล้วกางข้อความ KC SMART
        await new Promise(res => setTimeout(res, 800));
        splash.classList.add('show-text');

        // [Step 3] รอกางข้อความเสร็จ (800ms) แล้วเริ่มพิมพ์ชื่อโรงเรียน
        await new Promise(res => setTimeout(res, 800));
        await typeWriter(fullText);
        
        // --- ส่วนที่ปรับปรุง: ทำให้มันค้างไว้โชว์ หรือวนลูป ---
        console.log("Splash Animation Preview Finished.");
        
        /* ถ้าคุณอยากให้มันเล่นใหม่เรื่อยๆ (Loop) ให้เปิด Comment ด้านล่างนี้ครับ:
           setTimeout(() => {
               splash.classList.remove('start-anim', 'show-text');
               typingElement.innerHTML = '';
               runSplashPreview(); 
           }, 3000); 
        */
    }
}

// รันทันทีเมื่อโหลดหน้าจอเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    runSplashPreview();
    
    // ปิดระบบคลิกขวา/ลากวาง เพื่อให้เหมือนหน้าแอปจริง
    document.oncontextmenu = () => false;
    document.onselectstart = () => false;
    document.ondragstart = () => false;
});