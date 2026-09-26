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

const formatter = new Intl.NumberFormat("th-TH");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const list = document.getElementById("app-list");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const connection = document.getElementById("connection");
const connectionText = document.getElementById("connection-text");
const fromInput = document.getElementById("date-from");
const toInput = document.getElementById("date-to");
const weekInput = document.getElementById("week-input");
const monthInput = document.getElementById("month-input");
const exportButton = document.getElementById("export-csv");
let appNames = [];
let lifetime = {pageViews: 0, apps: {}};
let days = {};
let period = "all";
let visibleRows = [];
let ready = false;
let serverOffset = 0;

firebase.database().ref(".info/serverTimeOffset").on("value", snapshot => {
  serverOffset = Number(snapshot.val()) || 0;
});

function thaiDayKey(time = Date.now() + serverOffset) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date(time));
  const part = name => parts.find(item => item.type === name).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function dateFromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}
function addDays(key, amount) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
function mondayOf(key) {
  const day = dateFromKey(key).getUTCDay();
  return addDays(key, -(day === 0 ? 6 : day - 1));
}
function isoWeekOf(key) {
  const thursday = dateFromKey(mondayOf(key));
  thursday.setUTCDate(thursday.getUTCDate() + 3);
  const year = thursday.getUTCFullYear();
  const firstThursday = dateFromKey(`${year}-01-04`);
  const firstMonday = mondayOf(firstThursday.toISOString().slice(0, 10));
  return `${year}-W${String(1 + Math.round((dateFromKey(mondayOf(key)) - dateFromKey(firstMonday)) / (7 * 86400000))).padStart(2, "0")}`;
}
function mondayFromWeek(value) {
  if (!/^\d{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$/.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const week = Number(value.slice(6));
  const first = mondayOf(`${year}-01-04`);
  const result = addDays(first, (week - 1) * 7);
  return isoWeekOf(result) === value ? result : null;
}
function monthStart(key) { return `${key.slice(0, 7)}-01`; }
function previousMonthStart(key) {
  const date = dateFromKey(monthStart(key));
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 10);
}
function monthEnd(key) {
  const date = dateFromKey(monthStart(key));
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}
function displayDate(key) {
  return new Intl.DateTimeFormat("th-TH", {timeZone: "Asia/Bangkok", day: "numeric", month: "short", year: "numeric"}).format(dateFromKey(key));
}
function setConnection(state, message) {
  connection.className = `connection ${state}`;
  connectionText.textContent = message;
}
function appKey(index) { return `app_${String(index + 1).padStart(2, "0")}`; }
function sumClicks(apps) {
  return appNames.reduce((sum, _name, i) => sum + (Number(apps?.[appKey(i)]) || 0), 0);
}
function firstDay() {
  return Object.keys(days).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key)).sort()[0] || null;
}
function selectedRange() {
  const today = thaiDayKey();
  switch (period) {
    case "today": return {from: today, to: today, label: "วันนี้"};
    case "seven": return {from: addDays(today, -6), to: today, label: "7 วันล่าสุด"};
    case "week": return {from: mondayOf(today), to: today, label: "สัปดาห์นี้ (เริ่มวันจันทร์)"};
    case "lastWeek": {
      const to = addDays(mondayOf(today), -1);
      return {from: addDays(to, -6), to, label: "สัปดาห์ก่อน"};
    }
    case "month": return {from: monthStart(today), to: today, label: "เดือนนี้"};
    case "lastMonth": {
      const from = previousMonthStart(today);
      return {from, to: monthEnd(from), label: "เดือนก่อน"};
    }
    case "pickWeek": {
      const from = mondayFromWeek(weekInput.value);
      return {from, to: from ? addDays(from, 6) : null, label: "สัปดาห์ที่เลือก"};
    }
    case "pickMonth": {
      const from = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthInput.value) ? `${monthInput.value}-01` : null;
      return {from, to: from ? monthEnd(from) : null, label: "เดือนที่เลือก"};
    }
    case "custom": return {from: fromInput.value, to: toInput.value, label: "ช่วงที่กำหนดเอง"};
    default: return {from: firstDay(), to: today, label: "ยอดรวมทั้งหมด"};
  }
}
function isValidRange(range) {
  if (period !== "custom" && period !== "pickMonth" && period !== "pickWeek") return true;
  const valid = /^\d{4}-\d{2}-\d{2}$/;
  return valid.test(range.from) && valid.test(range.to) && range.from <= range.to;
}
function selectedDays(range) {
  return Object.entries(days).filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key) &&
    range.from && key >= range.from && key <= range.to).sort(([a], [b]) => a.localeCompare(b));
}
function totalFor(range) {
  if (period === "all") return lifetime;
  const apps = {};
  let pageViews = 0;
  for (const [_date, record] of selectedDays(range)) {
    pageViews += Number(record?.pageViews) || 0;
    for (let i = 0; i < 24; i++) {
      const key = appKey(i);
      apps[key] = (apps[key] || 0) + (Number(record?.apps?.[key]) || 0);
    }
  }
  return {pageViews, apps};
}
function animateNumber(element, value) {
  const end = Number(value) || 0;
  const start = Number(element.dataset.value || 0);
  element.dataset.value = String(end);
  if (reduceMotion.matches || !ready || start === end) {
    element.textContent = formatter.format(end);
    return;
  }
  if (element._frame) cancelAnimationFrame(element._frame);
  const begin = performance.now();
  function tick(now) {
    const progress = Math.min((now - begin) / 500, 1);
    element.textContent = formatter.format(Math.round(start + (end - start) * (1 - (1 - progress) ** 3)));
    if (progress < 1) element._frame = requestAnimationFrame(tick);
  }
  element._frame = requestAnimationFrame(tick);
}
function rowsFor(apps) {
  return appNames.map((name, index) => ({name, index: index + 1, count: Number(apps?.[appKey(index)]) || 0}));
}
function drawList(allRows) {
  const query = search.value.trim().toLocaleLowerCase("th-TH");
  const filtered = allRows.filter(row => row.name.toLocaleLowerCase("th-TH").includes(query));
  if (sort.value === "popular") filtered.sort((a, b) => b.count - a.count || a.index - b.index);
  else if (sort.value === "least") filtered.sort((a, b) => a.count - b.count || a.index - b.index);
  document.getElementById("list-summary").textContent = query
    ? `พบ ${formatter.format(filtered.length)} จาก 24 ฟังก์ชัน` : "ดูจำนวนครั้งที่ผู้ใช้กดเปิดแต่ละบริการ";
  list.replaceChildren();
  list.setAttribute("aria-busy", "false");
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "ไม่พบฟังก์ชันที่ค้นหา ลองใช้คำอื่นดูนะ";
    list.appendChild(empty);
    return;
  }
  const max = Math.max(1, ...allRows.map(row => row.count));
  const fragment = document.createDocumentFragment();
  filtered.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "app-item";
    item.style.setProperty("--delay", `${Math.min(index, 10) * 30}ms`);
    const head = document.createElement("div");
    head.className = "app-head";
    const number = document.createElement("span");
    number.className = "app-index";
    number.textContent = String(row.index).padStart(2, "0");
    const name = document.createElement("span");
    name.className = "app-name";
    name.textContent = row.name;
    name.title = row.name;
    const count = document.createElement("span");
    count.className = "app-count";
    count.textContent = formatter.format(row.count);
    count.setAttribute("aria-label", `${formatter.format(row.count)} ครั้ง`);
    head.append(number, name, count);
    const track = document.createElement("div");
    track.className = "app-track";
    track.setAttribute("aria-hidden", "true");
    const fill = document.createElement("div");
    fill.className = "app-fill";
    track.appendChild(fill);
    item.append(head, track);
    fragment.appendChild(item);
    requestAnimationFrame(() => { fill.style.width = `${row.count / max * 100}%`; });
  });
  list.appendChild(fragment);
}
function numberOfDays(range) {
  if (!range.from || !range.to) return 0;
  return Math.floor((dateFromKey(range.to) - dateFromKey(range.from)) / 86400000) + 1;
}
function chartSeries(range) {
  const entries = selectedDays(range);
  if (!entries.length) return {series: [], group: "day"};
  const group = period === "all" || numberOfDays(range) > 90 ? "month" : numberOfDays(range) > 35 ? "week" : "day";
  const grouped = new Map();
  for (const [date, record] of entries) {
    const key = group === "month" ? date.slice(0, 7) : group === "week" ? mondayOf(date) : date;
    const item = grouped.get(key) || {key, views: 0, clicks: 0};
    item.views += Number(record?.pageViews) || 0;
    item.clicks += sumClicks(record?.apps);
    grouped.set(key, item);
  }
  const firstKey = group === "month" ? range.from.slice(0, 7) : group === "week" ? mondayOf(range.from) : range.from;
  const lastKey = group === "month" ? range.to.slice(0, 7) : group === "week" ? mondayOf(range.to) : range.to;
  const allKeys = [];
  let cursor = firstKey;
  while (cursor <= lastKey && allKeys.length < 2500) {
    allKeys.push(cursor);
    if (group === "month") {
      const next = dateFromKey(`${cursor}-01`);
      next.setUTCMonth(next.getUTCMonth() + 1);
      cursor = next.toISOString().slice(0, 7);
    } else cursor = addDays(cursor, group === "week" ? 7 : 1);
  }
  // จำกัดกราฟให้ยังอ่านง่าย แม้ฐานข้อมูลมีข้อมูลหลายปี
  const keys = allKeys.slice(-(group === "month" ? 36 : group === "week" ? 13 : 35));
  return {series: keys.map(key => grouped.get(key) || {key, views: 0, clicks: 0}), group};
}
function chartLabel(key, group) {
  if (group === "month") {
    return new Intl.DateTimeFormat("th-TH", {timeZone: "Asia/Bangkok", month: "short", year: "2-digit"}).format(dateFromKey(`${key}-01`));
  }
  return new Intl.DateTimeFormat("th-TH", {timeZone: "Asia/Bangkok", day: "numeric", month: "short"}).format(dateFromKey(key));
}
function svgElement(type, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}
function drawChart(range) {
  const container = document.getElementById("chart-container");
  const description = document.getElementById("chart-range");
  const {series, group} = chartSeries(range);
  description.textContent = series.length ? `กราฟ${group === "month" ? "รายเดือน" : group === "week" ? "รายสัปดาห์" : "รายวัน"} · ${series.length === 36 ? "แสดง 36 เดือนล่าสุด · " : ""}${chartLabel(series[0].key, group)} ถึง ${chartLabel(series[series.length - 1].key, group)}` : "ข้อมูลรายวันเริ่มเก็บหลังอัปเดตระบบสถิติ";
  container.replaceChildren();
  if (!series.length) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "ยังไม่มีข้อมูลในช่วงนี้";
    container.appendChild(empty);
    return;
  }
  const svg = svgElement("svg", {viewBox: "0 0 800 225", preserveAspectRatio: "none", role: "img", "aria-label": "กราฟยอดเปิดเว็บไซต์และยอดกดฟังก์ชัน"});
  const top = 18, bottom = 178, left = 45, right = 780;
  const max = Math.max(1, ...series.flatMap(item => [item.views, item.clicks]));
  for (let i = 0; i <= 2; i++) {
    const y = top + i * (bottom - top) / 2;
    svg.appendChild(svgElement("line", {x1: left, x2: right, y1: y, y2: y, class: "grid-line"}));
    const label = svgElement("text", {x: 35, y: y + 3, "text-anchor": "end", class: "axis-label"});
    label.textContent = formatter.format(Math.round(max * (1 - i / 2)));
    svg.appendChild(label);
  }
  const indices = [...new Set([0, Math.floor((series.length - 1) / 2), series.length - 1])];
  indices.forEach(i => {
    const label = svgElement("text", {x: series.length === 1 ? (left + right) / 2 : left + i * (right - left) / (series.length - 1), y: 205, "text-anchor": "middle", class: "axis-label"});
    label.textContent = chartLabel(series[i].key, group);
    svg.appendChild(label);
  });
  for (const [field, css] of [["views", "line-views"], ["clicks", "line-clicks"]]) {
    const points = series.map((item, i) => ({
      x: series.length === 1 ? (left + right) / 2 : left + i * (right - left) / (series.length - 1),
      y: bottom - item[field] / max * (bottom - top), item
    }));
    const line = svgElement("polyline", {points: points.map(p => `${p.x},${p.y}`).join(" "), class: `plot-line ${css}`});
    svg.appendChild(line);
    if (series.length <= 31) points.forEach(p => {
      const dot = svgElement("circle", {cx: p.x, cy: p.y, r: 4, class: `plot-dot ${css}`, fill: field === "views" ? "#ffda76" : "#ad83ff"});
      const title = svgElement("title");
      title.textContent = `${chartLabel(p.item.key, group)} · ${field === "views" ? "เปิดเว็บ" : "กดฟังก์ชัน"} ${formatter.format(p.item[field])} ครั้ง`;
      dot.appendChild(title);
      svg.appendChild(dot);
    });
  }
  container.appendChild(svg);
}
function render() {
  const range = selectedRange();
  const error = document.getElementById("range-error");
  const valid = isValidRange(range);
  error.textContent = valid ? "" : "กรุณาเลือกช่วงเวลาที่ถูกต้อง";
  if (!valid) return;
  const total = totalFor(range);
  visibleRows = rowsFor(total.apps);
  const clicks = visibleRows.reduce((sum, row) => sum + row.count, 0);
  animateNumber(document.getElementById("page-views"), total.pageViews);
  animateNumber(document.getElementById("all-clicks"), clicks);
  const top = [...visibleRows].sort((a, b) => b.count - a.count || a.index - b.index)[0];
  document.getElementById("top-app").textContent = top && top.count ? top.name : "ยังไม่มีข้อมูล";
  document.getElementById("top-app-count").textContent = top && top.count ? `${formatter.format(top.count)} ครั้งที่กดเปิด` : "รอการกดฟังก์ชันครั้งแรก";
  document.getElementById("views-note").textContent = period === "all" ? "นับทุกครั้งที่โหลดหน้าเว็บหลัก" : `ยอดเปิดเว็บไซต์ใน${range.label}`;
  document.getElementById("clicks-note").textContent = total.pageViews ? `เฉลี่ย ${(clicks / total.pageViews).toFixed(2)} ครั้งต่อการเปิดเว็บ` : "รวมยอดกดจากทุกฟังก์ชัน";
  const first = firstDay();
  document.getElementById("period-caption").textContent = period === "all"
    ? `ยอดรวมสะสม${first ? ` · ข้อมูลรายวันเริ่ม ${displayDate(first)}` : " · ข้อมูลรายวันจะเริ่มแสดงหลังอัปเดตโค้ด"}`
    : `${range.label} · ${displayDate(range.from)} ถึง ${displayDate(range.to)}`;
  exportButton.disabled = selectedDays(range).length === 0;
  exportButton.title = exportButton.disabled ? "ยังไม่มีข้อมูลรายวันในช่วงนี้" : "ดาวน์โหลดข้อมูลรายวัน";
  drawChart(range);
  drawList(visibleRows);
  ready = true;
}

search.addEventListener("input", () => { if (ready) drawList(visibleRows); });
sort.addEventListener("change", () => { if (ready) drawList(visibleRows); });
document.querySelectorAll(".period-tab").forEach(button => button.addEventListener("click", () => {
  period = button.dataset.period;
  document.querySelectorAll(".period-tab").forEach(tab => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("custom-range").hidden = period !== "custom";
  document.getElementById("week-picker").hidden = period !== "pickWeek";
  document.getElementById("month-picker").hidden = period !== "pickMonth";
  if (ready) render();
}));
[fromInput, toInput].forEach(input => input.addEventListener("change", () => { if (ready && period === "custom") render(); }));
[weekInput, monthInput].forEach(input => input.addEventListener("change", () => { if (ready) render(); }));
const today = thaiDayKey();
fromInput.value = addDays(today, -6);
toInput.value = today;
weekInput.value = isoWeekOf(today);
monthInput.value = today.slice(0, 7);

exportButton.addEventListener("click", () => {
  const range = selectedRange();
  if (!isValidRange(range)) return;
  const records = selectedDays(range);
  if (!records.length) return;
  const quoted = value => `"${String(value).replaceAll('"', '""')}"`;
  const header = ["วันที่", "ยอดเปิดเว็บ", ...appNames].map(quoted).join(",");
  const lines = records.map(([date, record]) => [date, Number(record?.pageViews) || 0,
    ...appNames.map((_name, i) => Number(record?.apps?.[appKey(i)]) || 0)].map(quoted).join(","));
  const blob = new Blob(["\ufeff", header, "\r\n", lines.join("\r\n")], {type: "text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kc-smart-stats-${range.from}-to-${range.to}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

fetch("analytics-apps.json", {cache: "no-store"}).then(response => {
  if (!response.ok) throw new Error("ไม่พบ analytics-apps.json");
  return response.json();
}).then(names => {
  if (!Array.isArray(names) || names.length !== 24) throw new Error("รายชื่อฟังก์ชันต้องมี 24 รายการ");
  appNames = names;
  const root = firebase.database().ref("kcSmartStats");
  // รับข้อมูลทุกโหนดจากต้นเดียว เพื่อไม่ให้หน้าจอแสดงยอดจากคนละจังหวะ
  root.on("value", snapshot => {
    const data = snapshot.val() || {};
    lifetime = {pageViews: Number(data.pageViews) || 0, apps: data.apps || {}};
    days = data.days || {};
    render();
    setConnection("online", "เชื่อมต่อ Firebase · ข้อมูลอัปเดตอัตโนมัติ");
  }, error => {
    list.setAttribute("aria-busy", "false");
    list.textContent = "โหลดข้อมูลไม่ได้ กรุณาตรวจสอบกฎของ Firebase";
    setConnection("error", `อ่านสถิติไม่ได้: ${error.message}`);
  });
}).catch(error => {
  list.setAttribute("aria-busy", "false");
  list.textContent = "โหลดรายการฟังก์ชันไม่ได้";
  setConnection("error", error.message);
});

const broadcastForm = document.getElementById("broadcast-form");
const broadcastBody = document.getElementById("broadcast-body");
const broadcastStatus = document.getElementById("broadcast-status");
const broadcastSubmit = document.getElementById("broadcast-submit");
const broadcastImage = document.getElementById("broadcast-image");
const broadcastPreview = document.getElementById("broadcast-preview");
let previewUrl = null;
broadcastImage.addEventListener("change", () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = broadcastImage.files[0] ? URL.createObjectURL(broadcastImage.files[0]) : null;
  broadcastPreview.hidden = !previewUrl;
  if (previewUrl) broadcastPreview.src = previewUrl;
  else broadcastPreview.removeAttribute("src");
});
function imageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      return reject(new Error("รูปต้องเป็น JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB"));
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement("canvas");
        const factor = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
        canvas.width = Math.max(1, Math.round(image.naturalWidth * factor));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * factor));
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let data = "";
        for (let round = 0; round < 8; round++) {
          data = canvas.toDataURL("image/jpeg", Math.max(.52, .82 - round * .045));
          if (data.length <= 180000) return resolve(data);
          canvas.width = Math.max(1, Math.round(canvas.width * .82));
          canvas.height = Math.max(1, Math.round(canvas.height * .82));
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        reject(new Error("ย่อรูปไม่สำเร็จ ลองใช้รูปที่เล็กลง"));
      } catch (error) { reject(error); }
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("เปิดไฟล์รูปไม่ได้")); };
    image.src = url;
  });
}
broadcastBody.addEventListener("input", () => {
  document.getElementById("broadcast-length").textContent = `${broadcastBody.value.length} / 500 ตัวอักษร`;
});
broadcastForm.addEventListener("submit", async event => {
  event.preventDefault();
  const title = document.getElementById("broadcast-title-input").value.trim();
  const body = broadcastBody.value.trim();
  const link = document.getElementById("broadcast-link").value.trim();
  const password = document.getElementById("broadcast-password").value;
  if (!title || !body || !password) return;
  if (link && !/^https?:\/\//i.test(link)) {
    broadcastStatus.className = "error";
    broadcastStatus.textContent = "ลิงก์ต้องขึ้นต้นด้วย https:// หรือ http://";
    return;
  }
  if (!window.confirm(`ส่งแจ้งเตือนถึงผู้ใช้ทุกเครื่องที่ลงทะเบียน?\n\n${title}\n${body}`)) return;

  broadcastSubmit.disabled = true;
  broadcastSubmit.textContent = "กำลังส่ง...";
  broadcastStatus.className = "";
  broadcastStatus.textContent = "กำลังส่งถึงผู้ใช้ กรุณารอสักครู่";
  try {
    const imageData = await imageAsDataUrl(broadcastImage.files[0]);
    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${password}`},
      body: JSON.stringify({title, body, link, imageData}),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `ส่งไม่สำเร็จ (HTTP ${response.status})`);
    broadcastStatus.className = "success";
    broadcastStatus.textContent = result.total === 0
      ? "บันทึกในประวัติแล้ว · ยังไม่มีอุปกรณ์ลงทะเบียนรับแจ้งเตือน"
      : `บันทึกในประวัติแล้ว · ส่งสำเร็จ ${result.success} เครื่อง · ล้มเหลว ${result.failure} เครื่อง`;
    document.getElementById("broadcast-password").value = "";
    broadcastForm.reset();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    broadcastPreview.hidden = true;
    broadcastPreview.removeAttribute("src");
    document.getElementById("broadcast-length").textContent = "0 / 500 ตัวอักษร";
  } catch (error) {
    broadcastStatus.className = "error";
    broadcastStatus.textContent = error.message;
  } finally {
    broadcastSubmit.disabled = false;
    broadcastSubmit.textContent = "ส่งแจ้งเตือน";
  }
});
