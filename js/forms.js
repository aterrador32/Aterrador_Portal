"use strict";
document.getElementById("yr").textContent = new Date().getFullYear();

const FALLBACK_FORMS = [
  {
    id: "sample-1",
    title: "Sample Form — Registration",
    category: "General",
    icon: "📋",
    desc: "This is a sample form.",
    organiser: "Batch Admin",
    seats: null,
    deadline: null,
    status: "closed",
    color: "#FF6B00",
    formUrl: "#",
  },
  {
    id: "sample-2",
    title: "Another Sample — Feedback",
    category: "Event",
    icon: "💬",
    desc: "Sample feedback form.",
    organiser: "Portal Team",
    seats: null,
    deadline: null,
    status: "closed",
    color: "#64A0FF",
    formUrl: "#",
  },
];

let FORMS = []; // filled by loadForms()

/* ══════ HELPERS ══════ */
const MOS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function pad(n) {
  return String(n).padStart(2, "0");
}
function fmtDL(iso) {
  const d = new Date(iso);
  const h = d.getHours(),
    m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${d.getDate()} ${MOS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${pad(m)} ${ampm}`;
}

/* ══════ RENDER CARDS ══════ */
function render() {
  const grid = document.getElementById("forms-grid");
  grid.innerHTML = "";

  const ST = {
    open: { label: "Open", dot: true },
    closed: { label: "Closed", dot: false },
    soon: { label: "Coming Soon", dot: true },
  };

  FORMS.forEach((f) => {
    const st = ST[f.status] || ST.closed;
    const isOpen = f.status === "open";
    const showCD = f.deadline && f.status !== "closed";

    const card = document.createElement("div");
    card.className = "fcard";
    card.setAttribute("role", "listitem");
    card.setAttribute("data-status", f.status);
    card.setAttribute("data-category", f.category);
    card.id = `card-${f.id}`;

    card.innerHTML = `
      <div class="fc-bar" style="background:${f.color}"></div>

      <div class="fc-body">
        <div class="fc-top">
          <div class="fc-ico" style="border-color:${f.color}30;background:${f.color}10">${f.icon}</div>
          <div class="fc-title-block">
            <div class="fc-badges">
              <span class="fc-status-badge">
                ${st.dot ? '<span class="fc-status-dot"></span>' : ""}
                ${st.label}
              </span>
              <span class="fc-cat">${f.category}</span>
            </div>
            <div class="fc-title">${f.title}</div>
          </div>
        </div>
        <p class="fc-desc">${f.desc}</p>
        <div class="fc-meta">
          ${f.deadline ? `<div class="fc-meta-item">📅 <strong>${fmtDL(f.deadline)}</strong></div>` : ""}
          ${f.seats ? `<div class="fc-meta-item">👥 ${f.seats}</div>` : ""}
          <div class="fc-meta-item">📌 ${f.organiser}</div>
        </div>
      </div>

      ${
        showCD
          ? `
        <div class="fc-countdown" id="cd-${f.id}">
          <div class="fcd-label">⏱ Time left to fill up</div>
          <div class="fcd-dials" id="dials-${f.id}">
            <div class="fcd-unit"><div class="fcd-num" id="D-${f.id}">--</div><div class="fcd-lbl">Days</div></div>
            <div class="fcd-sep">:</div>
            <div class="fcd-unit"><div class="fcd-num" id="H-${f.id}">--</div><div class="fcd-lbl">Hours</div></div>
            <div class="fcd-sep">:</div>
            <div class="fcd-unit"><div class="fcd-num" id="M-${f.id}">--</div><div class="fcd-lbl">Mins</div></div>
            <div class="fcd-sep">:</div>
            <div class="fcd-unit"><div class="fcd-num" id="S-${f.id}">--</div><div class="fcd-lbl">Secs</div></div>
          </div>
        </div>
      `
          : ""
      }

      <div class="fc-actions">
        <button class="fc-btn-fill" style="background:${f.color}"
          onclick="openModal('${f.id}')"
          ${!isOpen ? "disabled" : ""}
          aria-label="${f.title}">
          ${
            f.status === "closed"
              ? "🔒 Registration Closed"
              : f.status === "soon"
                ? "🔜 Not Open Yet"
                : "📋 Fill Up Form"
          }
        </button>
        ${
          isOpen
            ? `
          <button class="fc-btn-ext"
            onclick="openExt('${f.id}')"
            title="Open Google Form in new tab"
            aria-label="Open in new tab">↗</button>
        `
            : ""
        }
      </div>
    `;
    grid.appendChild(card);
  });

  updateCount();
}

/* ══════ COUNTDOWN TICK ══════ */
function tick() {
  const now = Date.now();
  FORMS.forEach((f) => {
    if (!f.deadline || f.status === "closed") return;
    const cd = document.getElementById(`cd-${f.id}`);
    if (!cd) return;
    const diff = new Date(f.deadline).getTime() - now;
    if (diff <= 0) {
      cd.innerHTML = '<div class="fcd-expired">⛔ Deadline passed</div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(v);
    };
    set(`D-${f.id}`, d);
    set(`H-${f.id}`, h);
    set(`M-${f.id}`, m);
    set(`S-${f.id}`, s);
    cd.classList.toggle("urgent", d === 0);

    // keep modal bar in sync
    if (activeId === f.id) syncModalCD(diff);
  });
}

/* ══════ MODAL ══════ */
let activeId = null;

function openModal(id) {
  const f = FORMS.find((x) => x.id === id);
  if (!f || f.status !== "open") return;
  activeId = id;

  document.getElementById("fm-ico").textContent = f.icon;
  document.getElementById("fm-title").textContent = f.title;
  document.getElementById("fm-meta").textContent =
    `${f.category} · ${f.organiser}`;

  // ext link — strip embedded param so it opens normally
  document.getElementById("fm-ext").href = f.formUrl
    .replace("?embedded=true", "")
    .replace("&embedded=true", "");

  // modal countdown bar
  const cdBar = document.getElementById("fm-cd-bar");
  cdBar.style.display = f.deadline ? "" : "none";
  if (f.deadline) syncModalCD(new Date(f.deadline) - Date.now());

  // load iframe fresh
  const iframe = document.getElementById("fm-iframe");
  iframe.src = "";
  document.getElementById("fm-loader").classList.remove("gone");
  setTimeout(() => {
    iframe.src = f.formUrl;
  }, 60);

  document.getElementById("form-modal").classList.add("open");
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", escHandler);
}

function closeModal() {
  document.getElementById("form-modal").classList.remove("open");
  document.getElementById("fm-iframe").src = "";
  document.body.style.overflow = "";
  document.removeEventListener("keydown", escHandler);
  activeId = null;
}

function escHandler(e) {
  if (e.key === "Escape") closeModal();
}

function syncModalCD(diff) {
  const el = document.getElementById("fm-cd-bar");
  if (!el) return;
  if (diff <= 0) {
    el.textContent = "⛔ Deadline passed";
    el.classList.add("urgent");
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.textContent = `⏱ ${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s left`;
  el.classList.toggle("urgent", d === 0);
}

function openExt(id) {
  const f = FORMS.find((x) => x.id === id);
  if (!f) return;
  window.open(
    f.formUrl.replace("?embedded=true", "").replace("&embedded=true", ""),
    "_blank",
    "noopener,noreferrer",
  );
}

/* ══════ FILTER ══════ */
let curF = "all";
function setF(f, btn) {
  curF = f;
  document.querySelectorAll(".ftag").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  apply();
}
function apply() {
  let vis = 0;
  document.querySelectorAll(".fcard").forEach((c) => {
    const show =
      curF === "all"
        ? true
        : ["open", "soon", "closed"].includes(curF)
          ? c.dataset.status === curF
          : c.dataset.category === curF;
    c.classList.toggle("hidden", !show);
    if (show) vis++;
  });
  updateCount(vis);
}
function updateCount(vis) {
  const n = FORMS.length;
  document.getElementById("fb-count").textContent =
    vis !== undefined && vis !== n ? `${vis} of ${n} forms` : `${n} forms`;
}

/* ══════ HAMBURGER ══════ */
const burger = document.getElementById("burger");
const mob = document.getElementById("mob-nav");
function tog(f) {
  const o = f !== undefined ? f : !mob.classList.contains("open");
  mob.classList.toggle("open", o);
  burger.classList.toggle("open", o);
  burger.setAttribute("aria-expanded", String(o));
  burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
  document.body.style.overflow = o ? "hidden" : "";
}
burger.addEventListener("click", () => tog());
document.addEventListener("click", (e) => {
  if (
    mob.classList.contains("open") &&
    !mob.contains(e.target) &&
    !burger.contains(e.target)
  )
    tog(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mob.classList.contains("open")) tog(false);
});
mob
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => tog(false)));
const hdr = document.querySelector("header");
window.addEventListener(
  "scroll",
  () => {
    hdr.style.boxShadow =
      window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

/* Loading state helpers */
function showLoading() {
  document.getElementById("fm-loading").style.display = "flex";
  document.getElementById("fm-error").style.display = "none";
  document.getElementById("fm-main").style.display = "none";
}
function showError() {
  document.getElementById("fm-loading").style.display = "none";
  document.getElementById("fm-error").style.display = "block";
  document.getElementById("fm-main").style.display = "none";
}
function showMain() {
  document.getElementById("fm-loading").style.display = "none";
  document.getElementById("fm-error").style.display = "none";
  document.getElementById("fm-main").style.display = "block";
}

async function loadForms() {
  showLoading();

  try {
    const res = await fetch(apiUrl("Forms"), { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    FORMS = rows
      .filter((r) => r.id && r.title)
      .map((r) => ({
        id: String(r.id).trim(),
        title: String(r.title).trim(),
        category: String(r.category || "General").trim(),
        icon: String(r.icon || "📋").trim(),
        desc: String(r.desc || "").trim(),
        organiser: String(r.organiser || "").trim(),
        seats: r.seats ? String(r.seats).trim() : null,
        deadline: r.deadline ? String(r.deadline).trim() : null,
        status: String(r.status || "closed")
          .trim()
          .toLowerCase(),
        color: String(r.color || "#FF6B00").trim(),
        formUrl: String(r.formUrl || "").trim(),
      }));

    showMain();
    render();
    setInterval(tick, 1000);
  } catch (err) {
    console.error("[Forms] Fetch failed — using fallback:", err);
    FORMS = FALLBACK_FORMS;
    showMain();
    render();
    setInterval(tick, 1000);
  }
}

/* Kick off */
loadForms();

(async function loadSemester() {
  if (window.location.protocol === "file:") return;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(apiUrl("Settings"), {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    if (!res.ok) return;
    const rows = await res.json();
    const row = rows.find(
      (r) =>
        String(r.key || "")
          .trim()
          .toLowerCase() === "semester",
    );
    if (!row) return;
    const sem = String(row.value || "").trim();
    if (!sem) return;
    document.querySelectorAll("[data-semester]").forEach((el) => {
      el.textContent = sem;
    });
    console.info("[Forms] Semester:", sem);
  } catch (e) {
    /* silent */
  }
})();
