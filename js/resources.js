"use strict";

/* ══════════════════════════════════════════════════════════
   COLOUR MAPS
════════════════════════════════════════════════════════════ */
const TYPE_STYLE = {
  slides: {
    label: "Slides",
    color: "var(--c-slides)",
    border: "rgba(100,160,255,.3)",
  },
  notes: {
    label: "Notes",
    color: "var(--c-notes)",
    border: "rgba(66,200,140,.3)",
  },
  quest: {
    label: "Questions",
    color: "var(--c-quest)",
    border: "rgba(220,100,255,.3)",
  },
  lab: { label: "Lab", color: "var(--c-lab)", border: "rgba(255,88,88,.3)" },
  books: {
    label: "Book",
    color: "var(--c-books)",
    border: "rgba(255,107,0,.3)",
  },
  senior: {
    label: "Senior",
    color: "var(--c-senior)",
    border: "rgba(255,200,60,.3)",
  },
};

let COURSES = [];
let SENIOR_RESOURCES = [];

/* ══════════════════════════════════════════════════════════
   AUTH-GATE LOADING SPINNER
════════════════════════════════════════════════════════════ */
function showGateSpinner(on) {
  let el = document.getElementById("ag-spinner");
  if (on) {
    if (!el) {
      el = document.createElement("div");
      el.id = "ag-spinner";
      el.innerHTML = `
        <div class="ags-ring"></div>
        <div class="ags-txt">Verifying access list…</div>`;
      // Insert just before the sign-in button wrapper
      const btnWrap = document.querySelector(".ag-btn-wrap");
      if (btnWrap) btnWrap.parentNode.insertBefore(el, btnWrap);
    }
    el.style.display = "flex";
  } else {
    if (el) el.style.display = "none";
  }
}

/* ══════════════════════════════════════════════════════════
   RENDER — ROSTER PILLS
════════════════════════════════════════════════════════════ */
function renderRoster() {
  const grid = document.getElementById("ag-roster-grid");
  const countEl = document.querySelector(".ag-roster-count");
  if (!grid) return;

  grid.innerHTML = "";

  ACCESS_ROSTER.forEach(({ hash, label }, i) => {
    const pill = document.createElement("div");
    pill.className = "ag-pill";
    pill.dataset.hash = hash;
    pill.title = label || `Member #${String(i + 1).padStart(2, "0")}`;
    const num = String(i + 1).padStart(2, "0");
    pill.innerHTML = `<span class="ag-pill-num">${num}</span>`;
    grid.appendChild(pill);
  });

  if (countEl) countEl.textContent = `${ACCESS_ROSTER.length} accounts`;
}

/* ══════════════════════════════════════════════════════════
   RENDER — COURSES
════════════════════════════════════════════════════════════ */
function renderCourses() {
  const list = document.getElementById("course-list");
  if (!list) return;
  list.innerHTML = "";

  if (!COURSES.length) {
    list.innerHTML = '<div class="empty-state">No course materials yet</div>';
    return;
  }

  COURSES.forEach((c) => {
    const block = document.createElement("div");
    block.className = "course-block";
    block.dataset.code = c.code.toLowerCase();
    block.dataset.name = c.name.toLowerCase();

    const totalFiles = c.resources.length;
    const newCount = c.resources.filter((r) => r.isNew).length;

    block.innerHTML = `
      <button class="cb-head" onclick="toggleCourse(this)" aria-expanded="false">
        <span class="cb-code" style="background:${c.color}20;border:1px solid ${c.color}40;color:${c.color}">${c.code}</span>
        <span class="cb-name">${c.name}</span>
        <span class="cb-meta">👤 ${c.teacher}</span>
        <span class="cb-count">${totalFiles} file${totalFiles !== 1 ? "s" : ""}${newCount > 0 ? ' · <span style="color:#42C88C">' + newCount + " new</span>" : ""}</span>
        <span class="cb-chevron">▶</span>
      </button>
      <div class="cb-body">
        <div class="cb-grid">
          ${c.resources
            .map((r) => {
              const ts = TYPE_STYLE[r.type] || TYPE_STYLE.notes;
              return `<a href="${r.url}" target="_blank" rel="noopener noreferrer"
              class="rcard"
              data-type="${r.type}"
              data-search="${r.name.toLowerCase()} ${c.code.toLowerCase()} ${c.name.toLowerCase()}"
              style="--card-color:${ts.color}">
              <style>.rcard[style*="${ts.color}"]::before{background:${ts.color}}</style>
              <div class="rc-ico" style="border-color:${ts.border};background:${ts.color}12">${r.icon}</div>
              <div class="rc-body">
                <div class="rc-name">${r.name}</div>
                <div class="rc-meta">
                  <span class="rc-type" style="color:${ts.color};border-color:${ts.border};background:${ts.color}12">${ts.label}</span>
                  <span class="rc-size">${r.size}</span>
                  ${r.isNew ? '<span class="rc-new">NEW</span>' : ""}
                </div>
              </div>
              <span class="rc-arrow" aria-hidden="true">↗</span>
            </a>`;
            })
            .join("")}
        </div>
      </div>`;
    list.appendChild(block);
  });
}

/* ══════════════════════════════════════════════════════════
   RENDER — SENIOR RESOURCES
════════════════════════════════════════════════════════════ */
function renderSenior() {
  const grid = document.getElementById("senior-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!SENIOR_RESOURCES.length) {
    grid.innerHTML = '<div class="empty-state">No senior resources yet</div>';
    return;
  }

  SENIOR_RESOURCES.forEach((s) => {
    const card = document.createElement("div");
    card.className = "scard";
    card.dataset.search = (
      s.batch +
      " " +
      s.title +
      " " +
      s.desc
    ).toLowerCase();
    card.dataset.type = "senior";
    card.innerHTML = `
      <div class="sc-batch">🌟 ${s.batch}</div>
      <div class="sc-title">${s.title}</div>
      <div class="sc-desc">${s.desc}</div>
      <div class="sc-files">
        ${s.files
          .map(
            (f) => `
          <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="sc-file">
            <span class="sc-file-ico">${f.icon}</span>
            <span>${f.name}</span>
            <span style="margin-left:auto;color:rgba(255,200,60,.5);font-size:10px">↗</span>
          </a>`,
          )
          .join("")}
      </div>`;
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════
   ACCORDION TOGGLE
════════════════════════════════════════════════════════════ */
function toggleCourse(btn) {
  const block = btn.closest(".course-block");
  const isOpen = block.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(isOpen));
}

/* ══════════════════════════════════════════════════════════
   FILTER + SEARCH
════════════════════════════════════════════════════════════ */
let curFilter = "all";
let curSearch = "";

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll(".rtag").forEach((b) => b.classList.remove("on"));
  if (btn) btn.classList.add("on");
  applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
  const srch = document.getElementById("rsearch");
  if (srch) {
    srch.addEventListener("input", function () {
      curSearch = this.value.toLowerCase().trim();
      applyFilters();
    });
  }
});

function applyFilters() {
  let visFiles = 0;
  let visSenior = 0;

  document.querySelectorAll(".course-block").forEach((block) => {
    const cards = block.querySelectorAll(".rcard");
    let blockVis = 0;
    cards.forEach((card) => {
      const mType = curFilter === "all" || card.dataset.type === curFilter;
      const mSearch = !curSearch || card.dataset.search.includes(curSearch);
      const show = mType && mSearch;
      card.classList.toggle("hidden", !show);
      if (show) {
        blockVis++;
        visFiles++;
      }
    });
    block.classList.toggle(
      "hidden",
      blockVis === 0 && (curFilter !== "all" || curSearch),
    );
    if (curSearch && blockVis > 0) block.classList.add("open");
  });

  document.querySelectorAll(".scard").forEach((card) => {
    const mType = curFilter === "all" || curFilter === "senior";
    const mSearch = !curSearch || card.dataset.search.includes(curSearch);
    const show = mType && mSearch;
    card.classList.toggle("hidden", !show);
    if (show) visSenior++;
  });

  const total =
    COURSES.reduce((a, c) => a + c.resources.length, 0) +
    SENIOR_RESOURCES.reduce((a, s) => a + s.files.length, 0);
  const rc = document.getElementById("rcount");
  if (rc) rc.textContent = `${visFiles + visSenior} of ${total} files`;
}

function updateCount() {
  const total =
    COURSES.reduce((a, c) => a + c.resources.length, 0) +
    SENIOR_RESOURCES.reduce((a, s) => a + s.files.length, 0);
  const rc = document.getElementById("rcount");
  if (rc) rc.textContent = `${total} files`;
}

/* ══════════════════════════════════════════════════════════
   RENDER — CLASSROOM CODES & MEET LINKS
════════════════════════════════════════════════════════════ */
function renderClassInfo(rows) {
  const validRows = rows.filter((r) => r.courseCode);
  const codeRows = validRows.filter((r) =>
    String(r.classroomCode || "").trim(),
  );
  const linkRows = validRows.filter((r) => String(r.meetLink || "").trim());

  const cSec = document.getElementById("section-classroom");
  const cGrid = document.getElementById("classroom-grid");
  if (cSec && cGrid) {
    if (codeRows.length) {
      cSec.style.display = "";
      cGrid.innerHTML = "";
      codeRows.forEach((r) => {
        const code = String(r.courseCode || "").trim();
        const name = String(r.courseName || "").trim();
        const value = String(r.classroomCode || "").trim();
        const card = document.createElement("div");
        card.className = "ci-card";
        card.innerHTML = `
          <div class="ci-card-top">
            <div class="ci-card-ico">🎓</div>
            <div>
              <div class="ci-card-label">Google Classroom</div>
              <div class="ci-card-course">${code}</div>
              ${name ? `<div class="ci-card-name">${name}</div>` : ""}
              <div class="ci-card-value">${value}</div>
            </div>
          </div>
          <div class="ci-card-actions">
            <button class="ci-copy-btn" onclick="ciCopy('${value}', this)">Copy Code</button>
            <a href="https://classroom.google.com" target="_blank" rel="noopener noreferrer" class="ci-open-btn">Open Classroom ↗</a>
          </div>`;
        cGrid.appendChild(card);
      });
    } else {
      cSec.style.display = "none";
    }
  }

  const mSec = document.getElementById("section-meetlinks");
  const mGrid = document.getElementById("meetlink-grid");
  if (mSec && mGrid) {
    if (linkRows.length) {
      mSec.style.display = "";
      mGrid.innerHTML = "";
      linkRows.forEach((r) => {
        const code = String(r.courseCode || "").trim();
        const name = String(r.courseName || "").trim();
        const url = String(r.meetLink || "").trim();
        const label = String(r.meetLabel || "Online Class").trim();
        const lb = label.toLowerCase();
        const ico = lb.includes("zoom")
          ? "🟦"
          : lb.includes("meet")
            ? "🟢"
            : lb.includes("teams")
              ? "🟣"
              : "🔗";
        const card = document.createElement("div");
        card.className = "ci-card";
        card.innerHTML = `
          <div class="ci-card-top">
            <div class="ci-card-ico">${ico}</div>
            <div style="min-width:0">
              <div class="ci-card-label">${label}</div>
              <div class="ci-card-course">${code}</div>
              ${name ? `<div class="ci-card-name">${name}</div>` : ""}
              <div class="ci-card-value" style="font-size:11px;letter-spacing:.5px;color:var(--txd);word-break:break-all">${url}</div>
            </div>
          </div>
          <div class="ci-card-actions">
            <button class="ci-copy-btn" onclick="ciCopy('${url}', this)">Copy Link</button>
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="ci-open-btn">Join Class ↗</a>
          </div>`;
        mGrid.appendChild(card);
      });
    } else {
      mSec.style.display = "none";
    }
  }
}

function ciCopy(val, btn) {
  navigator.clipboard
    .writeText(val)
    .then(() => {
      const orig = btn.textContent;
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove("copied");
      }, 2000);
    })
    .catch(() => {});
}

/* ══════════════════════════════════════════════════════════
   RESOURCE LOADER
════════════════════════════════════════════════════════════ */
async function loadResources() {
  let ciRowsData = [];
  const courseList = document.getElementById("course-list");
  if (courseList) {
    courseList.innerHTML =
      '<div style="padding:40px;text-align:center;font-family:var(--m2);font-size:10px;' +
      'letter-spacing:3px;text-transform:uppercase;color:var(--txd)">Loading resources…</div>';
  }

  try {
    const [resRes, senRes, ciRes] = await Promise.all([
      fetch(apiUrl("Resources"), { cache: "no-cache" }),
      fetch(apiUrl("SeniorResources"), { cache: "no-cache" }),
      fetch(apiUrl("ClassInfo"), { cache: "no-cache" }),
    ]);
    if (!resRes.ok) throw new Error(`Resources HTTP ${resRes.status}`);
    if (!senRes.ok) throw new Error(`SeniorResources HTTP ${senRes.status}`);
    const resRows = await resRes.json();
    const senRows = await senRes.json();
    ciRowsData = await ciRes.json().catch(() => []);

    const courseMap = new Map();
    resRows
      .filter((r) => r.courseCode && r.fileName)
      .forEach((r) => {
        const code = String(r.courseCode).trim();
        if (!courseMap.has(code)) {
          courseMap.set(code, {
            code,
            name: String(r.courseName || "").trim(),
            color: String(r.courseColor || "#FF6B00").trim(),
            teacher: String(r.teacher || "").trim(),
            resources: [],
          });
        }
        courseMap.get(code).resources.push({
          name: String(r.fileName || "").trim(),
          type: String(r.fileType || "notes").trim(),
          icon: String(r.fileIcon || "📄").trim(),
          size: String(r.fileSize || "").trim(),
          url: String(r.fileUrl || "#").trim(),
          isNew: String(r.isNew).toUpperCase() === "TRUE" || r.isNew === true,
        });
      });
    COURSES = [...courseMap.values()];

    const senMap = new Map();
    senRows
      .filter((r) => r.batch && r.fileName)
      .forEach((r) => {
        const key = String(r.batch).trim();
        if (!senMap.has(key)) {
          senMap.set(key, {
            batch: key,
            title: String(r.packTitle || "").trim(),
            desc: String(r.packDesc || "").trim(),
            files: [],
          });
        }
        senMap.get(key).files.push({
          name: String(r.fileName || "").trim(),
          url: String(r.fileUrl || "#").trim(),
          icon: String(r.fileIcon || "📄").trim(),
        });
      });
    SENIOR_RESOURCES = [...senMap.values()];
  } catch (err) {
    console.error("[Resources] Fetch failed:", err);
    COURSES = [];
    SENIOR_RESOURCES = [];
    renderCourses();
    renderClassInfo([]);
    renderSenior();
    updateCount();
    return;
  }

  renderCourses();
  renderClassInfo(ciRowsData);
  renderSenior();
  updateCount();
}

/* ══════════════════════════════════════════════════════════
   GOOGLE OAUTH
════════════════════════════════════════════════════════════ */
let currentUser = null;

window.onload = async function () {
  if (DEV_PREVIEW_MODE) {
    grantAccess(DEV_USER);
    return;
  }

  // ── Show spinner & fetch access list ──
  showGateSpinner(true);
  try {
    await fetchAccessList();
  } catch (e) {
    console.error("[Auth] fetchAccessList failed:", e);
    // Non-fatal: roster won't render, but we can still attempt sign-in
    // (checkAccess will fail gracefully with an empty set)
  }
  renderRoster();
  showGateSpinner(false);

  // ── Restore saved session ──
  const saved = sessionStorage.getItem("aterrador_user");
  if (saved) {
    try {
      grantAccess(JSON.parse(saved));
      return;
    } catch (e) {
      sessionStorage.removeItem("aterrador_user");
    }
  }
};

function startSignIn() {
  const errBox = document.getElementById("ag-error");
  if (errBox) errBox.classList.remove("show");

  if (!window.google) {
    showError(
      "Google Sign-In could not load. Please check your internet connection.",
    );
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleIdToken,
    ux_mode: "popup",
    cancel_on_tap_outside: false,
  });

  let helper = document.getElementById("_g_helper");
  if (!helper) {
    helper = document.createElement("div");
    helper.id = "_g_helper";
    helper.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none;width:1px;height:1px;overflow:hidden;top:-9999px";
    document.body.appendChild(helper);
  }
  helper.innerHTML = "";
  google.accounts.id.renderButton(helper, {
    type: "standard",
    theme: "filled_black",
    size: "large",
  });

  setTimeout(() => {
    const rendered =
      helper.querySelector('[role="button"]') ||
      helper.querySelector("div[tabindex]") ||
      helper.querySelector("div");
    if (rendered) {
      rendered.click();
    } else {
      showError(
        "Could not launch Google Sign-In. Please try a different browser.",
      );
    }
  }, 400);
}

function handleIdToken(response) {
  try {
    const payload = parseJwt(response.credential);
    checkAccess({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  } catch (e) {
    showError("Failed to read sign-in response. Please try again.");
  }
}

function parseJwt(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(
    decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    ),
  );
}

async function checkAccess(user) {
  const email = (user.email || "").toLowerCase().trim();
  try {
    const msgBuf = new TextEncoder().encode(email + EMAIL_SALT);
    const hashBuf = await crypto.subtle.digest("SHA-256", msgBuf);
    const hashHex = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (ALLOWED_HASHES.has(hashHex)) {
      grantAccess(user);
    } else {
      showError(
        `The account <strong>${email.split("@")[0].slice(0, 4)}·····@${email.split("@")[1]}</strong> ` +
          `is not on the authorised batch list. ` +
          `This portal is for <strong>ATERRADOR CSE 52nd Batch</strong> members only.`,
      );
    }
  } catch (e) {
    console.error("[Auth] checkAccess error:", e);
    showError(
      "Sign-in failed. Please try a different browser. Error: " + e.message,
    );
  }
}

function grantAccess(user) {
  currentUser = user;
  sessionStorage.setItem("aterrador_user", JSON.stringify(user));

  // Highlight pill
  (async () => {
    try {
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(
          (user.email || "").toLowerCase().trim() + EMAIL_SALT,
        ),
      );
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const pill = document.querySelector(`.ag-pill[data-hash="${hex}"]`);
      if (pill) {
        pill.classList.add("ag-pill--me");
        pill.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (e) {
      /* silent */
    }
  })();

  const avatarEl = document.getElementById("user-avatar");
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");

  if (avatarEl) {
    if (user.picture) {
      avatarEl.innerHTML = `<img src="${user.picture}" alt="${user.name || "User"}">`;
    } else {
      avatarEl.textContent = (user.name || user.email || "?")[0].toUpperCase();
    }
  }
  if (nameEl) nameEl.textContent = user.name || "—";
  if (emailEl) emailEl.textContent = user.email || "—";

  const gate = document.getElementById("auth-gate");
  const portal = document.getElementById("resource-portal");
  if (gate) gate.style.display = "none";
  if (portal) portal.classList.add("show");

  loadResources();
}

function signOut() {
  currentUser = null;
  sessionStorage.removeItem("aterrador_user");
  if (window.google) google.accounts.id.disableAutoSelect();
  const gate = document.getElementById("auth-gate");
  const portal = document.getElementById("resource-portal");
  const errBox = document.getElementById("ag-error");
  if (portal) portal.classList.remove("show");
  if (gate) gate.style.display = "";
  if (errBox) errBox.classList.remove("show");
}

function showError(msg) {
  const box = document.getElementById("ag-error");
  const body = document.getElementById("ae-body");
  if (body) body.innerHTML = msg;
  if (box) {
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/* ══════════════════════════════════════════════════════════
   HAMBURGER MENU
════════════════════════════════════════════════════════════ */
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
  if (e.key === "Escape") tog(false);
});
mob
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => tog(false)));

const hdr = document.querySelector("header");
window.addEventListener(
  "scroll",
  () => {
    if (hdr)
      hdr.style.boxShadow =
        window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

/* ══════════════════════════════════════════════════════════
   SEMESTER 
════════════════════════════════════════════════════════════ */
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
    console.info("[Resources] Semester:", sem);
  } catch (e) {
    /* teri awaj na aye, ekdam chup */
  }
})();
