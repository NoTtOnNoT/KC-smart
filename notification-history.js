// ประวัติประกาศสาธารณะ: อ่านอย่างเดียวจาก Firebase; การเขียนทำที่ API แอดมิน
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("notificationHistoryModal");
  const list = document.getElementById("notificationHistoryList");
  const detail = document.getElementById("notificationHistoryDetail");
  const openButton = document.getElementById("openNotificationHistory");
  const closeButton = document.getElementById("closeNotificationHistory");
  const historyRef = firebase.database().ref("broadcastHistory");
  let announcements = {};
  let pendingId = new URL(location.href).searchParams.get("notification");
  const validId = id => typeof id === "string" && /^[-A-Za-z0-9_]{20}$/.test(id);
  const dateLabel = time => Number.isFinite(Number(time)) && Number(time) > 0
    ? new Date(Number(time)).toLocaleString("th-TH", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok",
    }) : "ไม่ทราบวันเวลา";

  function showModal() {
    modal.style.display = "flex";
    requestAnimationFrame(() => modal.classList.add("active"));
    document.body.classList.add("notification-modal-open");
    closeButton.focus();
  }
  function showList() {
    detail.hidden = true;
    list.hidden = false;
    showModal();
  }
  function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("notification-modal-open");
    setTimeout(() => { if (!modal.classList.contains("active")) modal.style.display = "none"; }, 300);
    if (new URL(location.href).searchParams.has("notification")) {
      const url = new URL(location.href);
      url.searchParams.delete("notification");
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }
  function renderList() {
    list.replaceChildren();
    const records = Object.entries(announcements)
      .filter(([, item]) => item && item.status === "sent")
      .sort((a, b) => Number(b[1].timestamp || 0) - Number(a[1].timestamp || 0));
    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "notification-empty";
      empty.textContent = "ยังไม่มีประกาศในประวัติ";
      list.appendChild(empty);
      return;
    }
    for (const [id, item] of records) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "notification-history-item";
      const icon = document.createElement("span");
      icon.className = "notification-history-icon";
      icon.textContent = "🔔";
      const summary = document.createElement("span");
      summary.className = "notification-history-summary";
      const title = document.createElement("strong");
      title.textContent = item.title || "ประกาศจาก KC SMART";
      const body = document.createElement("span");
      body.textContent = item.body || "";
      const time = document.createElement("time");
      time.textContent = dateLabel(item.timestamp);
      summary.append(title, body, time);
      button.append(icon, summary);
      button.addEventListener("click", () => showDetail(id));
      list.appendChild(button);
    }
  }

  async function showDetail(id) {
    showModal();
    list.hidden = true;
    detail.hidden = false;
    detail.replaceChildren();
    const item = validId(id) ? announcements[id] : null;
    if (!item || item.status !== "sent") {
      const message = document.createElement("p");
      message.className = "notification-empty";
      message.textContent = "ไม่พบประกาศนี้ในประวัติ";
      detail.appendChild(message);
    } else {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "notification-back";
      back.textContent = "← ประวัติทั้งหมด";
      back.addEventListener("click", showList);
      const time = document.createElement("time");
      time.className = "notification-detail-time";
      time.textContent = dateLabel(item.timestamp);
      const title = document.createElement("h3");
      title.textContent = item.title;
      const body = document.createElement("p");
      body.className = "notification-detail-body";
      body.textContent = item.body;
      detail.append(back, time, title, body);
      if (item.hasImage) {
        const image = document.createElement("img");
        image.className = "notification-detail-image";
        image.alt = `รูปประกอบ: ${item.title}`;
        image.loading = "lazy";
        detail.appendChild(image);
        try {
          const snapshot = await firebase.database().ref(`broadcastImages/${id}`).once("value");
          if (!detail.contains(image)) return;
          const source = snapshot.val();
          if (typeof source === "string" && /^data:image\/(?:jpeg|png|webp);base64,/.test(source)) image.src = source;
          else image.remove();
        } catch (_) { image.remove(); }
      }
      if (typeof item.link === "string" && /^https?:\/\//i.test(item.link)) {
        const link = document.createElement("a");
        link.className = "notification-detail-link";
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "เปิดลิงก์เพิ่มเติม ↗";
        detail.appendChild(link);
      }
    }
  }

  openButton.addEventListener("click", showList);
  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
  window.addEventListener("kc-open-notification", event => showDetail(event.detail?.id));

  historyRef.on("value", snapshot => {
    announcements = snapshot.val() || {};
    renderList();
    if (pendingId) {
      const id = pendingId;
      pendingId = null;
      showDetail(id);
    }
  }, error => {
    list.textContent = `โหลดประวัติไม่ได้: ${error.message}`;
    if (pendingId) { pendingId = null; showList(); }
  });
});
