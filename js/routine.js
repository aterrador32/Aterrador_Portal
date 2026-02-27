"use strict";

document.getElementById("yr").textContent = new Date().getFullYear();

/* ── hamburger ── */
const burger = document.getElementById("burger");
const mobNav = document.getElementById("mob-nav");
function toggleMenu(force) {
  const open = force !== undefined ? force : !mobNav.classList.contains("open");
  mobNav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => toggleMenu());
document.addEventListener("click", (e) => {
  if (
    mobNav.classList.contains("open") &&
    !mobNav.contains(e.target) &&
    !burger.contains(e.target)
  )
    toggleMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleMenu(false);
});
mobNav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
const hdr = document.querySelector("header");
window.addEventListener(
  "scroll",
  () => {
    hdr.style.boxShadow =
      window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

/* ══════════════════════════════════════════════════════════
   CONFIG — paste the real URL here
══════════════════════════════════════════════════════════ */
const API_URL =
  "https://script.google.com/macros/s/AKfycbxocBxiKrYnxL_Z7DmlDZID-3BE1jpOBZ8pBhhtLDIF7toILjyFEPFRWYcxK5ZxN9tsfw/exec";

/* ══════════════════════════════════════════════════════════
   TIMETABLE CONSTANTS
══════════════════════════════════════════════════════════ */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function todayName() {
  return DAY_NAMES_FULL[new Date().getDay()];
}

/* ══════════════════════════════════════════════════════════
   FALLBACK COURSE PALETTE
   Used when API not reachable or Palette sheet not present.
   Keys match the "course" column in your Routine sheet.
   To add a new course, add a row in the "Palette" sheet tab.
   bg  = rgba background   bdr = border/dot colour   tx = text colour
══════════════════════════════════════════════════════════ */
const FALLBACK_PALETTE = {
  "CSE 303": { bg: "rgba(255,107,0,.18)", bdr: "#FF6B00", tx: "#FF6B00" },
  "CSE 304": { bg: "rgba(255,107,0,.18)", bdr: "#FF6B00", tx: "#FF6B00" },
  "CSE 305": { bg: "rgba(100,200,255,.16)", bdr: "#64C8FF", tx: "#64C8FF" },
  "CSE 307": { bg: "rgba(100,160,255,.16)", bdr: "#64A0FF", tx: "#64A0FF" },
  "CSE 309": { bg: "rgba(220,100,255,.16)", bdr: "#DC64FF", tx: "#DC64FF" },
  "CSE 310": { bg: "rgba(220,100,255,.16)", bdr: "#DC64FF", tx: "#DC64FF" },
  "CSE 311": { bg: "rgba(255,200,60,.16)", bdr: "#FFC83C", tx: "#FFC83C" },
  "CSE 312": { bg: "rgba(66,200,140,.16)", bdr: "#42C88C", tx: "#42C88C" },
  "CSE 314": { bg: "rgba(255,160,60,.16)", bdr: "#FFA03C", tx: "#FFA03C" },
  "Econ 301": { bg: "rgba(160,220,80,.16)", bdr: "#A0DC50", tx: "#A0DC50" },
  LAB: { bg: "rgba(255,80,80,.16)", bdr: "#FF5050", tx: "#FF5050" },
};

/* Live palette — populated from Palette sheet or fallback */
let PALETTE = {};

/* Helper: get palette entry for a course code, with graceful fallback */
function pal(code) {
  return (
    PALETTE[code] ||
    PALETTE["LAB"] || { // if code contains 'lab' in the name
      bg: "rgba(255,255,255,.08)",
      bdr: "rgba(255,255,255,.3)",
      tx: "#aaaaaa",
    }
  );
}

/* ══════════════════════════════════════════════════════════
   FALLBACK SCHEDULE — actual batch routine
   (used when API unreachable or not yet configured)
══════════════════════════════════════════════════════════ */
const FALLBACK_SCHEDULE = [
  {
    day: "Sunday",
    start: "09:00",
    end: "10:20",
    course: "CSE 303",
    name: "Computer Graphics",
    teacher: "Morium Akhter",
    room: "202",
    type: "Theory",
  },
  {
    day: "Sunday",
    start: "10:25",
    end: "11:45",
    course: "CSE 304",
    name: "Computer Graphics Lab",
    teacher: "Amina, Morium",
    room: "LAB-203",
    type: "Lab",
  },
  {
    day: "Sunday",
    start: "14:00",
    end: "15:20",
    course: "CSE 307",
    name: "Computational Geometry",
    teacher: "Masum Bhuiyan",
    room: "102",
    type: "Theory",
  },
  {
    day: "Monday",
    start: "10:25",
    end: "11:45",
    course: "CSE 307",
    name: "Computational Geometry",
    teacher: "Masum Bhuiyan",
    room: "102",
    type: "Theory",
  },
  {
    day: "Monday",
    start: "11:50",
    end: "13:10",
    course: "CSE 309",
    name: "Operating System",
    teacher: "ASMMR Choyon",
    room: "101",
    type: "Theory",
  },
  {
    day: "Monday",
    start: "14:00",
    end: "16:45",
    course: "CSE 310",
    name: "Operating System Lab",
    teacher: "ASMMR Choyon",
    room: "LAB-203",
    type: "Lab",
  },
  {
    day: "Tuesday",
    start: "09:00",
    end: "10:20",
    course: "CSE 303",
    name: "Computer Graphics",
    teacher: "Morium Akhter",
    room: "202",
    type: "Theory",
  },
  {
    day: "Tuesday",
    start: "10:25",
    end: "13:10",
    course: "CSE 311",
    name: "OOAD",
    teacher: "Sarnali, Musfique",
    room: "LAB-201",
    type: "Theory",
  },
  {
    day: "Tuesday",
    start: "14:00",
    end: "15:20",
    course: "CSE 305",
    name: "Computer Architecture",
    teacher: "Jugal Krishna",
    room: "101",
    type: "Theory",
  },
  {
    day: "Wednesday",
    start: "09:00",
    end: "10:20",
    course: "CSE 305",
    name: "Computer Architecture",
    teacher: "Jugal Krishna",
    room: "101",
    type: "Theory",
  },
  {
    day: "Wednesday",
    start: "10:25",
    end: "16:45",
    course: "CSE 312",
    name: "Web Design Lab",
    teacher: "Rafsan, Shovon",
    room: "LAB-302",
    type: "Lab",
  },
  {
    day: "Thursday",
    start: "11:50",
    end: "13:10",
    course: "CSE 309",
    name: "Operating System",
    teacher: "ASMMR Choyon",
    room: "101",
    type: "Theory",
  },
  {
    day: "Thursday",
    start: "14:00",
    end: "15:20",
    course: "Econ 301",
    name: "Economics",
    teacher: "Anonymous",
    room: "102",
    type: "Theory",
  },
];

let SCHEDULE = []; // populated by loadRoutine()

/* ══════════════════════════════════════════════════════════
   TIME HELPERS
══════════════════════════════════════════════════════════ */
function toMin(t) {
  // Handles both "09:00" and "9:00:00" (Google Sheets quirk)
  if (!t) return 0;
  const parts = String(t).trim().split(":").map(Number);
  return parts[0] * 60 + (parts[1] || 0);
}
function fmtDisplay(t) {
  const parts = String(t).trim().split(":").map(Number);
  const h = parts[0],
    m = parts[1] || 0;
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}
function nowMin() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

/* ── grid time range — recomputed from SCHEDULE in initTimetable() ── */
let GRID_START = 480;
let GRID_END = 1020;
let GRID_SPAN = GRID_END - GRID_START;

const PX_PER_MIN = 1.25;

/* ══════════════════════════════════════════════════════════
   TIMETABLE RENDER
══════════════════════════════════════════════════════════ */
function buildTimeLabels() {
  const slots = [];
  let t = Math.floor(GRID_START / 30) * 30;
  while (t <= GRID_END) {
    if (t >= GRID_START) slots.push(t);
    t += 30;
  }
  return slots;
}

function renderTimetable() {
  const container = document.getElementById("timetable");
  container.innerHTML = "";

  const today = todayName();
  const slots = buildTimeLabels();
  const totalH = GRID_SPAN * PX_PER_MIN;

  /* ── header row ── */
  const timeHead = document.createElement("div");
  timeHead.className = "tt-day-header";
  timeHead.style.cssText = "grid-column:1;grid-row:1";
  timeHead.innerHTML = `<span class="tt-day-name" style="font-size:9px;letter-spacing:2px;color:var(--txd)">TIME</span>`;
  container.appendChild(timeHead);

  DAYS.forEach((day, i) => {
    const isT = day === today;
    const col = document.createElement("div");
    col.className = "tt-day-header";
    col.style.cssText = `grid-column:${i + 2};grid-row:1`;
    col.innerHTML = `
      <span class="tt-day-name ${isT ? "today-name" : ""}">${day}</span>
      ${isT ? '<div class="today-bar"></div>' : ""}
    `;
    container.appendChild(col);
  });

  /* ── time axis column ── */
  const timeCol = document.createElement("div");
  timeCol.style.cssText = `grid-column:1;grid-row:2;position:relative;height:${totalH}px;border-right:2px solid rgba(255,107,0,.2);background:var(--dkr);`;
  slots.forEach((min) => {
    const top = (min - GRID_START) * PX_PER_MIN;
    const isHour = min % 60 === 0;
    const label = document.createElement("div");
    label.style.cssText = `position:absolute;top:${top}px;right:8px;transform:translateY(-50%);font-family:var(--m2);font-size:${isHour ? "10" : "9"}px;color:${isHour ? "rgba(255,107,0,.5)" : "rgba(255,255,255,.12)"};letter-spacing:.5px;white-space:nowrap;line-height:1;`;
    label.textContent = fmtDisplay(
      `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`,
    );
    timeCol.appendChild(label);
    if (isHour) {
      const line = document.createElement("div");
      line.style.cssText = `position:absolute;top:${top}px;left:0;right:0;height:1px;background:rgba(255,107,0,.07);pointer-events:none;`;
      timeCol.appendChild(line);
    }
  });
  container.appendChild(timeCol);

  /* ── day columns ── */
  DAYS.forEach((day, i) => {
    const isT = day === today;
    const col = document.createElement("div");
    col.setAttribute("id", `col-${day}`);
    col.style.cssText = `grid-column:${i + 2};grid-row:2;position:relative;height:${totalH}px;background:${isT ? "rgba(255,107,0,.025)" : "transparent"};border-right:1px solid rgba(255,255,255,.04);`;

    /* half-hour grid lines */
    slots.forEach((min) => {
      const line = document.createElement("div");
      const isHr = min % 60 === 0;
      line.style.cssText = `position:absolute;top:${(min - GRID_START) * PX_PER_MIN}px;left:0;right:0;height:1px;background:${isHr ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.02)"};pointer-events:none;`;
      col.appendChild(line);
    });

    /* class blocks for this day */
    const dayClasses = SCHEDULE.filter((s) => s.day === day);
    dayClasses.forEach((s) => {
      const startM = toMin(s.start);
      const endM = toMin(s.end);
      const dur = endM - startM;
      if (dur <= 0) return;

      const top = (startM - GRID_START) * PX_PER_MIN;
      const h = dur * PX_PER_MIN;
      const c = pal(s.course);
      const isLab = s.type === "Lab";

      const block = document.createElement("div");
      block.className = "tt-block";
      block.style.cssText = `
        position:absolute;
        top:${top}px;
        left:4px;right:4px;
        height:${h}px;
        background:${c.bg};
        border-left:3px solid ${c.bdr};
        border-radius:3px;
        padding:5px 7px;
        overflow:hidden;
        cursor:default;
        transition:filter .15s,transform .15s;
        z-index:2;
      `;
      block.innerHTML = `
        <div style="font-family:var(--m2);font-size:${h > 50 ? "10" : "9"}px;color:${c.tx};letter-spacing:.5px;line-height:1.3;margin-bottom:2px;font-weight:700">${s.course}</div>
        ${h > 40 ? `<div style="font-family:var(--m1);font-size:10px;color:rgba(255,255,255,.7);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>` : ""}
        ${h > 58 ? `<div style="font-family:var(--m2);font-size:9px;color:${c.tx};opacity:.65;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">👤 ${s.teacher}</div>` : ""}
        ${h > 70 ? `<div style="font-family:var(--m2);font-size:9px;color:rgba(255,255,255,.4);margin-top:1px">📍 ${s.room} · ${fmtDisplay(s.start)}–${fmtDisplay(s.end)}</div>` : ""}
        ${isLab ? `<div style="position:absolute;top:4px;right:6px;font-family:var(--m2);font-size:8px;letter-spacing:1px;color:${c.tx};background:${c.bdr}22;border:1px solid ${c.bdr}44;padding:1px 6px;border-radius:2px">LAB</div>` : ""}
      `;
      block.addEventListener("mouseenter", () => {
        block.style.filter = "brightness(1.15)";
        block.style.transform = "translateX(1px)";
      });
      block.addEventListener("mouseleave", () => {
        block.style.filter = "";
        block.style.transform = "";
      });
      col.appendChild(block);
    });

    container.appendChild(col);
  });

  /* now-line */
  drawNowLine();
}

/* ══════════════════════════════════════════════════════════
   NOW LINE
══════════════════════════════════════════════════════════ */
function drawNowLine() {
  document.querySelectorAll(".now-line").forEach((el) => el.remove());
  const now = nowMin();
  if (now < GRID_START || now > GRID_END) return;

  const today = todayName();
  if (!DAYS.includes(today)) return;

  const col = document.getElementById(`col-${today}`);
  if (!col) return;

  const top = (now - GRID_START) * PX_PER_MIN;
  const line = document.createElement("div");
  line.className = "now-line";
  line.style.cssText = `position:absolute;top:${top}px;left:0;right:0;height:2px;background:var(--or);z-index:10;pointer-events:none;`;
  const dot = document.createElement("div");
  dot.style.cssText =
    "position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:var(--or);";
  line.appendChild(dot);
  col.appendChild(line);
}

/* ══════════════════════════════════════════════════════════
   TODAY BANNER + LIVE CLOCK
══════════════════════════════════════════════════════════ */
function updateNowBanner() {
  const today = todayName();
  const el = document.getElementById("today-banner");
  if (el) el.textContent = today;
}

function tick() {
  const now = new Date();
  const timeEl = document.getElementById("live-time");
  if (timeEl) {
    const h = now.getHours(),
      m = now.getMinutes(),
      s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    timeEl.textContent = `${hh}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
  }
  drawNowLine();
  updateNowBanner();
}

/* ══════════════════════════════════════════════════════════
   LOADING STATE HELPERS
══════════════════════════════════════════════════════════ */
function showLoading() {
  document.getElementById("rt-loading").style.display = "flex";
  document.getElementById("rt-error").style.display = "none";
  document.getElementById("rt-main").style.display = "none";
}
function showError() {
  document.getElementById("rt-loading").style.display = "none";
  document.getElementById("rt-error").style.display = "block";
  document.getElementById("rt-main").style.display = "none";
}
function showMain() {
  document.getElementById("rt-loading").style.display = "none";
  document.getElementById("rt-error").style.display = "none";
  document.getElementById("rt-main").style.display = "block";
}

/* ══════════════════════════════════════════════════════════
   INIT — called after SCHEDULE and PALETTE are populated
══════════════════════════════════════════════════════════ */
function initTimetable() {
  if (!SCHEDULE.length) {
    console.warn("[Routine] SCHEDULE is empty — nothing to render.");
    showMain();
    return;
  }
  const allStarts = SCHEDULE.map((s) => toMin(s.start));
  const allEnds = SCHEDULE.map((s) => toMin(s.end));
  GRID_START = Math.min(...allStarts) - 10;
  GRID_END = Math.max(...allEnds) + 10;
  GRID_SPAN = GRID_END - GRID_START;
  showMain();
  renderTimetable();
  renderLegend();
  tick();
  setInterval(tick, 1000);
  setInterval(() => drawNowLine(), 30000);
}

/* ══════════════════════════════════════════════════════════
   DATA LOADER
   Fetches Routine + Palette sheets in parallel.
   Falls back gracefully on any error.

   "Palette" sheet columns:
     course | bg | bdr | tx
     e.g.: CSE 303 | rgba(255,107,0,.18) | #FF6B00 | #FF6B00

   "Routine" sheet columns:
     day | start | end | course | name | teacher | room | type
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   DATA LOADER
   Uses fetch() with no-cors NOT needed — Apps Script with
   "Execute as Me / Anyone" does return CORS headers on the
   final redirect. The issue was JSONP script execution being
   blocked by CSP. fetch() works fine from any served page.

   If opening as file:// locally, fetch still fails — host
   the file on Vercel / GitHub Pages / any server.
══════════════════════════════════════════════════════════ */
async function loadRoutine() {
  showLoading();

  // Try Palette (non-critical, short timeout)
  let palRows = [];
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${API_URL}?sheet=Palette`, {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    if (res.ok) palRows = await res.json();
  } catch (e) {
    // Palette tab missing or slow — silently use fallback colours
  }

  // Load Routine (required)
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(`${API_URL}?sheet=Routine`, {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const routRows = await res.json();

    /* ── Parse Palette ── */
    if (Array.isArray(palRows) && palRows.length) {
      PALETTE = {};
      palRows
        .filter((r) => r.course)
        .forEach((r) => {
          PALETTE[String(r.course).trim()] = {
            bg: String(r.bg || "rgba(255,255,255,.08)").trim(),
            bdr: String(r.bdr || "#888").trim(),
            tx: String(r.tx || "#aaa").trim(),
          };
        });
      console.info("[Routine] Palette loaded:", Object.keys(PALETTE));
    } else {
      PALETTE = FALLBACK_PALETTE;
    }

    /* ── Parse Routine ── */
    SCHEDULE = routRows
      .filter((r) => r.day && r.start && r.end)
      .map((r) => ({
        day: String(r.day).trim(),
        start: normaliseTime(r.start),
        end: normaliseTime(r.end),
        course: String(r.course || "").trim(),
        name: String(r.name || "").trim(),
        teacher: String(r.teacher || "").trim(),
        room: String(r.room || "").trim(),
        type: String(r.type || "Theory").trim(),
      }));

    console.info(`[Routine] Loaded ${SCHEDULE.length} classes.`);
    initTimetable();
  } catch (err) {
    console.warn(
      "[Routine] Sheet load failed — using fallback. Reason:",
      err.message,
    );
    PALETTE = FALLBACK_PALETTE;
    SCHEDULE = FALLBACK_SCHEDULE;
    initTimetable();
  }
}

/* ── normalise time strings from Sheets ──────────────────
   Handles ALL formats Apps Script can return:
     "09:00"                      → typed as plain text ✓
     "9:00:00"                    → plain text with seconds ✓
     "Sat Dec 30 1899 09:00:00…"  → Date.toString() from old script ✓
   Extracts HH:MM in every case.
──────────────────────────────────────────────────────── */
function normaliseTime(t) {
  if (!t) return "00:00";
  const s = String(t).trim();

  // Format: "Sat Dec 30 1899 09:00:00 GMT+0553 ..."
  // Apps Script serialised a Date object — extract HH:MM from the time part
  const dateStr = s.match(/\d{4}\s+(\d{1,2}):(\d{2}):\d{2}/);
  if (dateStr) {
    return String(parseInt(dateStr[1])).padStart(2, "0") + ":" + dateStr[2];
  }

  // Format: "09:00" or "9:00" or "9:00:00"
  const parts = s.split(":");
  const h = String(parseInt(parts[0]) || 0).padStart(2, "0");
  const m = String(parseInt(parts[1]) || 0).padStart(2, "0");
  return `${h}:${m}`;
}

/* ══════════════════════════════════════════════════════════
   IFRAME EMBED (JU Academic Calendar)
   iframeReady / iframeBlocked are no longer used via inline
   onload/onerror (removed to avoid strict CSP errors).
   Instead we use a simple timeout: if the iframe is still
   0px tall after 4 s we assume it was blocked and show the
   fallback message.
══════════════════════════════════════════════════════════ */
function iframeReady() {
  /* kept for safety — not called */
}
function iframeBlocked() {
  showCalBlocked();
}
function showCalBlocked() {
  const blocked = document.getElementById("cal-blocked");
  if (blocked) blocked.style.display = "flex";
}

window.addEventListener("load", () => {
  const iframe = document.getElementById("cal-iframe");
  if (!iframe) return;
  setTimeout(() => {
    try {
      // If cross-origin block, contentDocument is null
      if (
        !iframe.contentDocument ||
        !iframe.contentDocument.body ||
        iframe.contentDocument.body.innerHTML === ""
      ) {
        showCalBlocked();
      }
    } catch (e) {
      // SecurityError = cross-origin block — show fallback
      showCalBlocked();
    }
  }, 4000);
});

/* ══════════════════════════════════════════════════════════
   DYNAMIC LEGEND — updates after palette loads from sheet
══════════════════════════════════════════════════════════ */
function renderLegend() {
  const leg = document.querySelector(".legend");
  if (!leg || !Object.keys(PALETTE).length) return;
  // Build legend items from PALETTE + SCHEDULE (only courses that appear)
  const used = [...new Set(SCHEDULE.map((s) => s.course))];
  const legTtl = leg.querySelector(".leg-ttl");
  leg.innerHTML = "";
  if (legTtl) leg.appendChild(legTtl);
  else {
    const t = document.createElement("span");
    t.className = "leg-ttl";
    t.textContent = "Legend:";
    leg.appendChild(t);
  }
  used.forEach((code) => {
    const c = pal(code);
    const item = document.createElement("div");
    item.className = "leg-item";
    item.innerHTML = `<div class="l-swatch" style="background:${c.bg};border-color:${c.bdr}"></div>${code}`;
    leg.appendChild(item);
  });
}

/* ── kick off ── */
loadRoutine();

/* ══════════════════════════════════════════════════════════
   SEMESTER — loaded from Settings sheet
   key: semester  →  e.g. "5th Semester"
   Updates every [data-semester] span on the page.
   Silent on failure — hardcoded text stays as fallback.
══════════════════════════════════════════════════════════ */
(async function loadSettings() {
  if (window.location.protocol === "file:") return;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(API_URL + "?sheet=Settings", {
      cache: "no-cache",
      signal: ctrl.signal,
    });
    if (!res.ok) return;
    const rows = await res.json();
    console.log("[Routine] Settings:", rows);

    // Build key→value map (lowercase keys for safety)
    const cfg = {};
    rows.forEach((r) => {
      const k = String(r.key || "")
        .trim()
        .toLowerCase();
      if (k) cfg[k] = String(r.value || "").trim();
    });

    // ── semester text ──
    if (cfg.semester) {
      document.querySelectorAll("[data-semester]").forEach((el) => {
        el.textContent = cfg.semester;
      });
      console.info("[Routine] Semester:", cfg.semester);
    }

    // ── university calendar URL ──
    const univUrl = cfg.universitycalendarurl || "";
    if (univUrl) {
      const calIframe = document.getElementById("cal-iframe");
      const calBtn = document.getElementById("univ-cal-btn");
      const calExt = document.querySelector(".cal-ext-btn");
      if (calIframe) calIframe.src = univUrl;
      if (calBtn) calBtn.href = univUrl;
      if (calExt) calExt.href = univUrl;
      console.info("[Routine] University calendar URL:", univUrl);
    }

    // ── academic sheet embed ──
    const sheetEmbed = cfg.academicsheetembed || "";
    const sheetLoader = document.getElementById("sheet-loader");
    const sheetBlocked = document.getElementById("sheet-blocked");
    const sheetIframe = document.getElementById("sheet-iframe");
    const sheetOpenBtn = document.getElementById("sheet-open-btn");

    if (sheetEmbed) {
      if (sheetIframe) {
        sheetIframe.src = sheetEmbed;
        sheetIframe.style.display = "block";
        sheetIframe.onload = () => {
          if (sheetLoader) sheetLoader.classList.add("gone");
        };
      }
      // "Open in Sheets" button — convert /pubhtml or /edit embed URL to a viewable link
      const viewUrl = sheetEmbed
        .replace("/pubhtml", "/edit")
        .replace("?widget=true&headers=false", "");
      if (sheetOpenBtn) {
        sheetOpenBtn.href = viewUrl;
        sheetOpenBtn.style.visibility = "visible";
      }
      // Also set from academicSheetUrl if provided separately
      if (cfg.academicsheeturl && sheetOpenBtn)
        sheetOpenBtn.href = cfg.academicsheeturl;
    } else {
      // No embed configured — show the blocked/unconfigured state
      if (sheetLoader) sheetLoader.style.display = "none";
      if (sheetBlocked) sheetBlocked.classList.add("show");
    }
  } catch (e) {
    console.warn("[Routine] Settings load failed:", e.message);
    // Show unconfigured state for sheet
    const sl = document.getElementById("sheet-loader");
    const sb = document.getElementById("sheet-blocked");
    const bm = document.getElementById("sheet-blocked-msg");
    if (sl) sl.style.display = "none";
    if (bm) bm.textContent = "Could not load settings";
    if (sb) sb.classList.add("show");
  }
})();
