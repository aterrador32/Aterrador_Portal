"use strict";
document.getElementById("yr").textContent = new Date().getFullYear();

/* ── hamburger ── */
const burger = document.getElementById("burger");
const mobNav = document.getElementById("mob-nav");
function toggleMenu(f) {
  const open = f !== undefined ? f : !mobNav.classList.contains("open");
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

let PALETTE = {};

/* Build palette */
function buildPaletteEntry(colorStr) {
  const c = colorStr.trim();
  // Parse hex to RGB so we can make a translucent bg
  let r = 136,
    g = 136,
    b = 136;
  const hex = c.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    const v = hex[1];
    if (v.length === 3) {
      r = parseInt(v[0] + v[0], 16);
      g = parseInt(v[1] + v[1], 16);
      b = parseInt(v[2] + v[2], 16);
    } else {
      r = parseInt(v.slice(0, 2), 16);
      g = parseInt(v.slice(2, 4), 16);
      b = parseInt(v.slice(4, 6), 16);
    }
  }
  return {
    bg: `rgba(${r},${g},${b},.15)`,
    bdr: c,
    tx: c,
  };
}

/* Load palette */
async function loadPalette(signal) {
  try {
    const res = await fetch(apiUrl("Palette"), {
      cache: "no-cache",
      signal,
    });
    if (!res.ok) return;
    const rows = await res.json();
    rows.forEach((row) => {
      const code = String(
        row.course || row.courseCode || row.code || "",
      ).trim();
      const color = String(
        row.bdr || row.color || row.Color || row.colour || "",
      ).trim();
      if (code && color) {
        PALETTE[code] = buildPaletteEntry(color);
      }
    });
    console.info(
      "[Exams] Palette loaded:",
      Object.keys(PALETTE).length,
      "courses",
    );
  } catch (e) {
    console.warn(
      "[Exams] Palette fetch failed — using fallback colours. Reason:",
      e.message,
    );
  }
}

function pal(code) {
  return (
    PALETTE[code] || { bg: "rgba(255,255,255,.08)", bdr: "#888", tx: "#aaa" }
  );
}

/* ══════════════════════════════════════════
   DATE HELPERS
══════════════════════════════════════════ */
const MONTHS = [
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
const MFULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseDate(str) {
  // expects "YYYY-MM-DD"
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function parseDateTime(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:MM" 24h
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0);
}
function fmtDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtDateDisplay(dateStr) {
  if (dateStr === "NOT_ANNOUNCED" || !dateStr) {
    return "Not Announced";
  }
  return fmtDate(dateStr);
}
function fmtTime12(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM",
    hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}
function dayOfWeek(d) {
  return WEEKDAYS[d.getDay()];
}
function isToday(dateStr) {
  const d = parseDate(dateStr),
    n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}
function isPast(dateStr, timeStr) {
  const target = timeStr ? parseDateTime(dateStr, timeStr) : parseDate(dateStr);
  // for dates without time, treat whole day as past if tomorrow
  if (!timeStr) {
    const d = parseDate(dateStr);
    d.setDate(d.getDate() + 1);
    return new Date() > d;
  }
  return new Date() > target;
}
function daysUntil(dateStr) {
  const d = parseDate(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - now) / (1000 * 60 * 60 * 24));
}

const FALLBACK_TUTORIAL = [];

let TUTORIAL_EXAMS = [];

const FALLBACK_FINAL = [];

let FINAL_EXAMS = [];

/* ══════════════════════════════════════════
   COUNTDOWN ENGINE
══════════════════════════════════════════ */
function buildCountdown(exams, getTarget, wrapId, listId, isFinal) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  // find next upcoming
  const now = new Date();
  const upcoming = exams
    .filter((e) => e.date !== "NOT_ANNOUNCED")
    .map((e) => ({ ...e, _target: getTarget(e) }))
    .filter((e) => e._target > now)
    .sort((a, b) => a._target - b._target);
  const next = upcoming[0];

  /* ── big countdown card ── */
  const card = document.createElement("div");
  card.className = "countdown-card";

  if (!next) {
    const notAnnounced = exams.filter((e) => e.date === "NOT_ANNOUNCED");
    if (notAnnounced.length > 0) {
      card.innerHTML = `<div class="no-upcoming" style="width:100%">
        ⏳ ${notAnnounced.length} exam(s) — Date Not Announced
      </div>`;
    } else {
      card.innerHTML = `<div class="no-upcoming" style="width:100%">
        ✓ All exams completed — great work!
      </div>`;
    }
  } else {
    const c = pal(next.course);
    card.innerHTML = `
      <div class="cc-label">
        <div class="cc-next">Next Upcoming Exam</div>
        <div class="cc-name">${next.name}</div>
        <div class="cc-code" style="background:${c.bg};border:1px solid ${c.bdr};color:${c.tx}">${next.course}</div>
        <div class="cc-meta">
          📅 <span>${dayOfWeek(next._target)}, ${fmtDate(next._target)}</span><br>
          ${isFinal ? `⏰ <span>${fmtTime12(next.startTime)}</span><br>📍 <span>${next.room}</span>` : `👤 <span>${next.teacher}</span>`}
        </div>
      </div>
      <div class="dials" id="${wrapId}-dials" aria-live="polite" aria-label="Countdown timer">
        <div class="dial"><div class="dial-num" id="${wrapId}-d">00</div><div class="dial-lbl">Days</div></div>
        <div class="dial-sep">:</div>
        <div class="dial"><div class="dial-num" id="${wrapId}-h">00</div><div class="dial-lbl">Hours</div></div>
        <div class="dial-sep">:</div>
        <div class="dial"><div class="dial-num" id="${wrapId}-m">00</div><div class="dial-lbl">Mins</div></div>
        <div class="dial-sep">:</div>
        <div class="dial"><div class="dial-num" id="${wrapId}-s">00</div><div class="dial-lbl">Secs</div></div>
      </div>
    `;

    /* live tick */
    function tick() {
      const diff = next._target - new Date();
      if (diff <= 0) {
        renderCard();
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const set = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(v).padStart(2, "0");
      };
      set(`${wrapId}-d`, days);
      set(`${wrapId}-h`, hours);
      set(`${wrapId}-m`, mins);
      set(`${wrapId}-s`, secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  wrap.appendChild(card);

  /* ── upcoming mini list ── */
  if (exams.length > 0) {
    const listTitle = document.createElement("div");
    listTitle.className = "sec-hd";
    listTitle.style.marginTop = "8px";
    listTitle.innerHTML = `<span class="sec-tag">// All ${isFinal ? "Final" : "Tutorial"} Exams</span><div class="sec-ln"></div>`;
    wrap.appendChild(listTitle);

    const list = document.createElement("div");
    list.className = "upcoming-list";
    const sorted = [...exams].sort((a, b) => {
      if (a.date === "NOT_ANNOUNCED") return 1;
      if (b.date === "NOT_ANNOUNCED") return -1;
      return getTarget(a) - getTarget(b);
    });
    sorted.forEach((e, i) => {
      const target =
        e.date === "NOT_ANNOUNCED" ? new Date(8640000000000000) : getTarget(e);
      const past = target < now;
      const todayE = isToday(e.date);
      const isNext = next && target.getTime() === next._target.getTime();
      const du = e.date === "NOT_ANNOUNCED" ? null : daysUntil(e.date);
      const c = pal(e.course);

      const item = document.createElement("div");
      item.className = `upc-item${isNext ? " next-up" : ""}${past ? " " : ""}`;

      let statusHtml = "";
      if (past) statusHtml = `<span class="done-tag">Done ✓</span>`;
      else if (todayE)
        statusHtml = `<span class="upc-days" style="color:#42C88C">TODAY</span>`;
      else if (isNext)
        statusHtml = `<span class="upc-days" style="color:var(--or)">Next · ${du}d away</span>`;
      else
        statusHtml = `<span class="upc-days" style="color:var(--txd)">${du !== null ? du + "d away" : "Date TBA"}</span>`;

      item.innerHTML = `
        <span class="upc-code" style="background:${c.bg};border:1px solid ${c.bdr};color:${c.tx}">${e.course}</span>
        <span class="upc-name">${e.name}</span>
        <span class="upc-date">${e.date === "NOT_ANNOUNCED" ? "Date TBA" : `${dayOfWeek(target).slice(0, 3)}, ${fmtDate(target)}${isFinal ? ` · ${fmtTime12(e.startTime)}` : ""}`}${isFinal ? ` · ${fmtTime12(e.startTime)}` : ""}</span>
        ${statusHtml}
      `;
      list.appendChild(item);
    });
    wrap.appendChild(list);
  }
}

/* ══════════════════════════════════════════
   TUTORIAL CARD RENDERER
══════════════════════════════════════════ */
function renderTutorialGrid() {
  const grid = document.getElementById("tut-grid");
  if (!grid) return;
  const sorted = [...TUTORIAL_EXAMS].sort((a, b) => {
    // Put NOT_ANNOUNCED exams at the end
    if (a.date === "NOT_ANNOUNCED") return 1;
    if (b.date === "NOT_ANNOUNCED") return -1;
    return parseDate(a.date) - parseDate(b.date);
  });

  sorted.forEach((e) => {
    const c = pal(e.course);
    const isNotAnnounced = e.date === "NOT_ANNOUNCED";
    const tod = !isNotAnnounced && isToday(e.date);
    const past = !isNotAnnounced && isPast(e.date, e.startTime);

    let statusHtml;
    if (isNotAnnounced) {
      statusHtml = `<div class="tut-status not-announced">
        <div class="mode-dot" style="background:#585858"></div>
        Date Not Announced
      </div>`;
    } else if (tod) {
      statusHtml = `<div class="tut-status today">
        <div class="mode-dot" style="background:#42C88C"></div>
        Today!
      </div>`;
    } else if (past) {
      statusHtml = `<div class="tut-status done">✓ Completed</div>`;
    } else {
      statusHtml = `<div class="tut-status upcoming">
        <div class="mode-dot"></div>
        Upcoming · ${daysUntil(e.date)}d at ${fmtTime12(e.startTime)}
      </div>`;
    }

    const card = document.createElement("div");
    card.className = `tut-card${isNotAnnounced ? " not-announced" : ""}${past && !tod ? " past" : ""}`;
    card.style.borderColor = isNotAnnounced
      ? "rgba(88,88,88,.3)"
      : past && !tod
        ? "rgba(255,255,255,.05)"
        : `${c.bdr}40`;

    card.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${isNotAnnounced ? "#585858" : c.bdr};opacity:${isNotAnnounced ? ".5" : past ? ".3" : "1"}"></div>
      <div class="tut-date-block">
        <div class="tut-day-num">${isNotAnnounced ? "?" : String(parseDate(e.date).getDate()).padStart(2, "0")}</div>
        <div class="tut-day-right">
          <div class="tut-day-name">${isNotAnnounced ? "Date" : WEEKDAYS[parseDate(e.date).getDay()]}</div>
          <div class="tut-month">${isNotAnnounced ? "TBA" : `${MFULL[parseDate(e.date).getMonth()]} ${parseDate(e.date).getFullYear()}`}</div>
        </div>
      </div>
      <div class="tut-course-code" style="background:${c.bg};border:1px solid ${c.bdr};color:${c.tx}">${e.course}</div>
      <div class="tut-course-name">${e.name}</div>
      <div class="tut-meta">
        👤 <span>${e.teacher}</span> <br>
        📝 Marks: <span>${e.marks}</span> <br>
        📌 <span style="color:var(--txd);font-size:10px">${e.notes}</span>
      </div>
      ${statusHtml}
    `;
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════
   FINAL EXAM TABLE RENDERER
══════════════════════════════════════════ */
function renderFinalTable() {
  const tbody = document.getElementById("fin-tbody");
  if (!tbody) return;
  const sorted = [...FINAL_EXAMS].sort((a, b) => {
    // Put NOT_ANNOUNCED exams at the end
    if (a.date === "NOT_ANNOUNCED") return 1;
    if (b.date === "NOT_ANNOUNCED") return -1;
    return parseDate(a.date) - parseDate(b.date);
  });

  const now = new Date();
  sorted.forEach((e) => {
    const isNotAnnounced = e.date === "NOT_ANNOUNCED";
    const d = isNotAnnounced ? null : parseDate(e.date);
    const end = isNotAnnounced
      ? null
      : new Date(
          parseDateTime(e.date, e.startTime).getTime() + e.duration * 60000,
        );
    const past = !isNotAnnounced && end < now;
    const tod = !isNotAnnounced && isToday(e.date);
    const isNow =
      !isNotAnnounced &&
      tod &&
      new Date() >= parseDateTime(e.date, e.startTime) &&
      new Date() < end;
    const c = pal(e.course);
    const dur = `${Math.floor(e.duration / 60)}h${e.duration % 60 ? ` ${e.duration % 60}m` : ""}`;
    const endT = isNotAnnounced
      ? ""
      : `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

    let statusHtml;
    if (isNotAnnounced) {
      statusHtml = `<span class="f-status-pill not-announced">⏳ Date TBA</span>`;
    } else if (isNow) {
      statusHtml = `<span class="f-status-pill today">In Progress</span>`;
    } else if (tod) {
      statusHtml = `<span class="f-status-pill today">Today</span>`;
    } else if (past) {
      statusHtml = `<span class="f-status-pill done">Done ✓</span>`;
    } else {
      statusHtml = `<span class="f-status-pill upcoming">${daysUntil(e.date)}d away</span>`;
    }

    const tr = document.createElement("tr");
    tr.className = `${tod ? "today-row" : ""}${isNotAnnounced ? "not-announced-row" : ""}${past && !tod ? "past-row" : ""}`;
    tr.innerHTML = `
      <td>
        <div class="f-date-cell">
          <span class="f-date-main">${isNotAnnounced ? "Not Announced" : `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}</span>
          <span class="f-date-day">${isNotAnnounced ? "Check back later" : WEEKDAYS[d.getDay()]}</span>
        </div>
      </td>
      <td><span class="f-code-pill" style="background:${c.bg};border:1px solid ${c.bdr};color:${c.tx}">${e.course}</span></td>
      <td style="font-family:var(--m1);font-size:13px;color:#fff">${e.name}</td>
      <td>
        <div class="f-time-cell">
          <span class="f-time-main">${isNotAnnounced ? "—" : `${fmtTime12(e.startTime)} – ${fmtTime12(endT)}`}</span>
          <span class="f-time-dur">${dur}</span>
        </div>
      </td>
      <td><span class="f-room">${isNotAnnounced ? "—" : e.room}</span></td>
      <td>${statusHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ══════════════════════════════════════════════════════════
   LOADING STATE HELPERS
══════════════════════════════════════════════════════════ */
function showLoading() {
  document.getElementById("es-loading").style.display = "flex";
  document.getElementById("es-error").style.display = "none";
  document.getElementById("es-main").style.display = "none";
}
function showError() {
  document.getElementById("es-loading").style.display = "none";
  document.getElementById("es-error").style.display = "block";
  document.getElementById("es-main").style.display = "none";
}
function showMain() {
  document.getElementById("es-loading").style.display = "none";
  document.getElementById("es-error").style.display = "none";
  document.getElementById("es-main").style.display = "block";
}
function normDate(v) {
  if (!v || v === "" || v === null || v === undefined) return "NOT_ANNOUNCED";
  const s = String(v).trim().toLowerCase();
  if (!s) return "NOT_ANNOUNCED";

  // Check for "Not Announced", "TBA", "TBD", "Pending" keywords
  if (
    s === "not announced" ||
    s === "tba" ||
    s === "tbd" ||
    s === "pending" ||
    s === "na" ||
    s === "n/a"
  ) {
    return "NOT_ANNOUNCED";
  }

  // Already YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // ISO string with time
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];

  // Month name format (e.g., "Jul 6, 2025")
  const mo = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const dm = s.match(/(\w{3})\s+(\d{1,2})\s+(\d{4})/);
  if (dm) {
    return (
      dm[3] + "-" + (mo[dm[1]] || "01") + "-" + String(dm[2]).padStart(2, "0")
    );
  }

  return "NOT_ANNOUNCED";
}
function normTime(v) {
  if (!v && v !== 0) return "09:00";

  // Handle actual Date objects
  if (v instanceof Date) {
    if (!isNaN(v.getTime())) {
      return (
        String(v.getHours()).padStart(2, "0") +
        ":" +
        String(v.getMinutes()).padStart(2, "0")
      );
    }
  }

  // Handle Date stringified by JSON (e.g. "Sat Dec 30 1899 08:45:00 GMT+0553 ...")
  const s0 = String(v);
  const dtMatch = s0.match(/\d{1,2}:\d{2}:\d{2}/);
  if (dtMatch) {
    const [h, m] = dtMatch[0].split(":").map(Number);
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }
  const num = parseFloat(v);
  if (!isNaN(num) && num >= 0 && num < 1) {
    const totalMins = Math.round(num * 24 * 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  const s = String(v).trim();

  // Already HH:MM or HH:MM:SS
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
    const p = s.split(":");
    return String(parseInt(p[0])).padStart(2, "0") + ":" + p[1];
  }

  // 12h format like "10:00 AM"
  const ampm = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = ampm[2];
    const period = ampm[3].toUpperCase();
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return String(h).padStart(2, "0") + ":" + m;
  }

  return "09:00";
}
async function loadExams() {
  showLoading();

  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 15000);

    await loadPalette(ctrl.signal);

    const [tutRes, finRes, setRes] = await Promise.all([
      fetch(apiUrl("TutorialExams"), {
        cache: "no-cache",
        signal: ctrl.signal,
      }),
      fetch(apiUrl("FinalExams"), { cache: "no-cache", signal: ctrl.signal }),
      fetch(apiUrl("Settings"), { cache: "no-cache", signal: ctrl.signal }),
    ]);
    clearTimeout(tid);

    if (!tutRes.ok) throw new Error(`TutorialExams HTTP ${tutRes.status}`);
    if (!finRes.ok) throw new Error(`FinalExams HTTP ${finRes.status}`);

    const tutRows = await tutRes.json();
    const finRows = await finRes.json();
    const setRows = await setRes.json().catch(() => []);

    TUTORIAL_EXAMS = tutRows
      .filter((r) => r.course || r.Course)
      .map((r) => {
        console.log("[DEBUG] raw date:", r.date, typeof r.date);
        return {
          date: normDate(r.date || r.Date || ""),
          startTime: normTime(r.startTime || r.StartTime || "09:00"),
          course: String(r.course || r.Course || "").trim(),
          name: String(r.name || r.Name || "").trim(),
          teacher: String(r.teacher || r.Teacher || "").trim(),
          marks: String(r.marks || r.Marks || "").trim(),
          notes: String(r.notes || r.Notes || "").trim(),
        };
      });

    FINAL_EXAMS = finRows
      .filter((r) => r.course)
      .map((r) => ({
        date: normDate(r.date),
        startTime: normTime(r.startTime),
        duration: Number(r.duration) || 180,
        course: String(r.course || "").trim(),
        name: String(r.name || "").trim(),
        room: String(r.room || "").trim(),
      }));

    // Read examMode from Settings tab (default: tutorial)
    const modeSetting = Array.isArray(setRows)
      ? setRows.find(
          (r) =>
            String(r.key || "")
              .trim()
              .toLowerCase() === "exammode",
        )
      : null;
    const mode = modeSetting
      ? String(modeSetting.value).trim().toLowerCase()
      : "tutorial";

    // Update semester text from Settings
    const semRow = Array.isArray(setRows)
      ? setRows.find(
          (r) =>
            String(r.key || "")
              .trim()
              .toLowerCase() === "semester",
        )
      : null;
    if (semRow && semRow.value) {
      const sem = String(semRow.value).trim();
      if (sem)
        document.querySelectorAll("[data-semester]").forEach((el) => {
          el.textContent = sem;
        });
      console.info("[Exams] Semester:", sem);
    }

    showMain();
    initExams(mode);
  } catch (err) {
    console.warn(
      "[Exams] Sheet load failed — using fallback. Reason:",
      err.message,
    );
    TUTORIAL_EXAMS = FALLBACK_TUTORIAL;
    FINAL_EXAMS = FALLBACK_FINAL;
    showMain();
    initExams("tutorial");
  }
}

/* ══════════════════════════════════════════
   INIT — correct section based on mode
═══════════════════════════════════════════ */
function initExams(mode) {
  mode = (mode || "tutorial").toLowerCase().trim();
  console.info("[Exams] Mode:", mode);

  const tutSec = document.getElementById("section-tutorial");
  const finSec = document.getElementById("section-final");

  if (mode === "final") {
    if (tutSec) tutSec.style.display = "none";
    if (finSec) finSec.style.display = "";
    buildCountdown(
      FINAL_EXAMS,
      (e) => parseDateTime(e.date, e.startTime),
      "fin-countdown-wrap",
      "fin-list",
      true,
    );
    renderFinalTable();
  } else {
    // default: tutorial
    if (finSec) finSec.style.display = "none";
    if (tutSec) tutSec.style.display = "";
    buildCountdown(
      TUTORIAL_EXAMS,
      (e) => parseDateTime(e.date, e.startTime),
      "tut-countdown-wrap",
      "tut-list",
      false,
    );
    renderTutorialGrid();
  }
}

loadExams();
