const apps = [
    { n: "ตารางเรียน", u: "https://studentskc.sadaokc.com/", img: "pic1.jpg" },
    { n: "ตารางสอน", u: "https://teacherkc.sadaokc.com/", img: "pic2.jpg" },
    { n: "ตารางสอบ", u: "https://examschedule.sadaokc.com/", img: "pic3.jpg" },
    { n: "KC Music", u: "https://script.google.com/macros/s/AKfycbyrzFJhQZWMNKXdd7D5be5zSl0SVEuGVsGbCkRRa7tUBaxq7gv6aXGfJW0vZRmCCyyD/exec", img: "pic4.jpg" },
    { n: "Portfolio", u: "https://doportkc.sadaokc.com/", img: "pic5.jpg" },
    { n: "คำนวณเกรด", u: "https://calgrade.sadaokc.com/", img: "pic6.jpg" },
    { n: "LearnUp", u: "https://kclearnup.sadaokc.com/", img: "pic7.jpg" },
    { n: "รายชื่อ", u: "https://script.google.com/macros/s/AKfycbwjFJ_Sw9fy8ciWUqccQ9ypdJgPsgtJ_c6Ab5cB0ACz21ybMu6lPmcEbuVdVrEhW4gQ/exec", img: "pic8.jpg" },
    { n: "คู่มือ", u: "https://script.google.com/macros/s/AKfycbwCVMLiKr2RmWXHMeohO6tdGjuaNeeASn8PGm6zGjlDqgLFwIdbyoae7hfmErAG3MulvQ/exec", img: "pic9.jpg" },
    { n: "ข่าวสาร", u: "https://script.google.com/macros/s/AKfycbz1rmB_ZaYszuwFHAvpMP6oAS7IVGr93KV2QuFhsKRqR-jrUBcE-slfzM6gXE5Nr9eu/exec", img: "pic10.jpg" },
    { n: "ห้องสมุด", u: "http://khanchai.vlcloud.net/", img: "pic11.jpg" },
    { n: "เกรด ม.", u: "http://www.dograde.online/khanchai/", img: "pic12.jpg" },
    { n: "ภาพกิจกรรม", u: "https://script.google.com/macros/s/AKfycbz_rtqBkrrFVoDmIkGHzAldYU1BpMBjp16gTsGxLcoueiygrEAMK_0qS2eaEELNPOYW/exec", img: "pic13.jpg" },
    { n: "วารสาร", u: "https://khanchai.ac.th/ebook", img: "pic14.jpg" },
    { n: "เกรด ปวช.", u: "https://script.google.com/macros/s/AKfycbxfEjNfbTZ86Dw1ekrIkz08KO9cwie1zV2khA5GiyeqgMBqCkJ6JESREzrpaVmDYiDQfA/exec", img: "pic15.jpg" },
    { n: "FB โรงเรียน", u: "https://www.facebook.com/share/1CsCUxCFTF/", img: "pic16.jpg" },
    { n: "IDEA BOX", u: "https://topickc.sadaokc.com/submit.php", img: "pic17.jpg" },
    { n: "FB สภา", u: "https://www.facebook.com/share/1Ha43rKgzp/", img: "pic18.jpg" },
    { n: "%มาเรียน", u: "https://search.kc-lovecare.com/", img: "pic19.jpg" },
    { n: "โควตา ม.4", u: "https://quotam4.sadaokc.com/", img: "pic20.jpg" },
    { n: "ผ้าอนามัย", u: "https://freepads.sadaokc.com/", img: "pic21.jpg" },
    { n: "แก้ 0/ร/มผ", u: "https://script.google.com/macros/s/AKfycbyH81mDslsgy78twi-OzpJuyBtWZbTYBL2p5p_kEEKBCqgATztIzVHm3SnTyYv2rxl7/exec", img: "pic22.jpg" }
];

const grid = document.getElementById('main-grid');

// สร้าง App Cards
apps.forEach((app, index) => {
    const card = document.createElement('a');
    card.href = app.u;
    card.className = 'app-card';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
        <div class="icon-container">
            <img src="${app.img}" alt="${app.n}" loading="lazy">
        </div>
        <div class="app-label">${app.n}</div>
    `;
    grid.appendChild(card);
});

// ระบบความปลอดภัยและการล็อก Context Menu
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());