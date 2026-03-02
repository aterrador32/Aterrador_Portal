"use strict";
document.getElementById("yr").textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════════
   CONFIG
════════════════════════════════════════════════════════════ */
const GOOGLE_CLIENT_ID =
  "820667040088-fme7kg1mg93jg33u777idd7jl20927am.apps.googleusercontent.com";

const DEV_PREVIEW_MODE = false;
const DEV_USER = {
  name: "Preview User",
  email: "dev@aterrador.local",
  picture: null,
};

/* ══════════════════════════════════════════════════════════
   ALLOWED EMAIL HASHES
════════════════════════════════════════════════════════════ */
const ALLOWED_HASHES = new Set([
  "0d5bbf28e6f1818cd12a7f1b04538a50f800b4bbfbe6c7f70764089e3ba149d1",
  "123044709e41392feedbfa4492cdbb67d2605cfb6b68bb96b6466e137ffd6a66",
  "ad224bb419623a62a8ef2bcd87e1babb93c3b1b36e7e06f5dcd46d1691e452b1",
  "3b39f3f21a4738e3214b8184978ef3ab14552d884f081217c889dc4b3a5e563e",
  "3ef6e699949c2438ef8ee059c73aa56902c90b20c1118bbbb5789025bc913424",
  "c54c1150af925ee4f48a4b902208aaaa250d071a64ec78c42cc801687c441905",
  "1032a850ef8f82cfbb8e455b3bd15a1458119a6ee5eec32617832eae465ba483",
  "e33d24d12d4f898d61e7ecce4be8fddc5ed5e0e537d9404eea0a376d63d68a29",
  "ef2707fde007bdff080d2e05fa03001aad8ec53bff0f7e6aa95cbe95c2bad504",
  "ee870c9c91f63ade2b39b7ea59ca8a3b670eff50d02fb056268dbd3394413ee4",
  "6ca54c55f8f50c0664d7f715300c7d7fd58ff0cc304853d4e3942ee0b5d3b807",
  "2b1fb80b205cd33a27f735e6148dcc3bf0813361c4811b2eefc2da2e2bb89141",
  "7c7150af687718edbad1b993211d212cdd2f1ae10a97d36f58c0f9d99591b24c",
  "ee8f673fd0e80e4fae085615c06cedd5e7dc9b3b88892f498d1bb5880e120116",
  "8f637cee62089262fdc7d90289ab2a91a2c580fc65b96259796981052386ee76",
  "51a103639c020c09cd0718499a787a02d059a73287e88b805ef768da9934f648",
  "e2251a05a6954cddf3f73475e27f46a0e08df864ba6ce395e8fb9379a76f3cc3",
  "5c8649018a53ac90c8216a9149ec13abdd9f9849185b3b0667b3ead33b3cebf6",
  "8611b69ff714fd25ef0ce0fc6a643ed9c405f6ac1a96701749444b933ce1b4eb",
  "f908b298616e5cd13e4dddf423963819d31e7c71eeaf9229063f3ca64fef8212",
  "7a07caad039484cebde361ac3988c586514cf5b3aaf94ba9dddeeeb31e289d9e",
  "5efd44644f9c28c7689d0681c37d9beb7291dfb78536275e3ce6d90ef4dc50ee",
  "88b83a935b3225eda0ef561ccf54bc7e7299e4063e45a05241c9d1d9f909b777",
  "cb03d825858ae41b67424d063b70431f0d5ed16128a0372b2a9fbb3ddb40edd5",
  "c054b43bf4a69074cbee47168ce29faacbb7ee2fef51571f25c703957b793221",
  "9e43e31d1f9aa54d9363f699d570e27f620f742821dad52f552d95e3b485990c",
  "b1764b31ac6a64cb5ac6aa147878701919b505edf0f468c50dae3322d00d4442",
  "943841467e3c101bc86d095516daa01f4ce6d376f7c0f295470f10246b3a8dc1",
  "eea09408193dc913d2e16f2fcfdb3a2ed732bb7d4705786a287f3c699bcc7f55",
  "92df7a8be0aa73c5a9187d0248c46ed744da3f42625281abac0526dc5ea61b36",
  "1b8d96cf965267a10b54262f28f8aafd0f59e32858d7df1be2328ef87f70f993",
  "d13f5d0d48349dceffe456e2b97d4e8a150a5c2442e3822b84e4fdadcba66494",
  "e45945208dba913440fd5cd63214663296205f6b744202c7cb3768299bad3ba1",
  "f3c8908e0e663a3ce06d2471cb5b29e5c0a4b33c03e5ca9245d665ca4f6dd18e",
  "e5e263f6db08ae888420b23ddc3c94f2c2f33db2b45019a673a3e33d06fcc35a",
  "b1e8e069e23b7bfe85364e7b86bd8ac852efd429cca1d7024807bc1df7eb99c6",
  "db461ac389f921f6ba16c7e8cc4ef7cd8b13d5e736b8bc0a195e71aa849c4b40",
  "c6dc89bf76c9d5e9955d8529fcd61b7960ce2d5c36cfdcbcfc6d3d696e3da666",
  "8945de2026e1ae63035fba9f514035dd631a69e08f11768ad3ff848ac5eb23e9",
  "7dcc9828891886e20750e080bb33f17fb4e1d98136af2b552d604cabec2edf20",
  "3e0bc8f387726ed89595060e12bf45038e891b2562268d1ac9987071dd3cd856",
  "cd728b26f2e4c8d045113cf2e2f36360d84fbfa738ff2a9e1191944558ef9d7c",
  "033ee277852994bb2777ba0c329aa5ca01a68858b125ee7fbb3e0422b2140749",
  "7cb0f5baa6d5bd9cbe9431dfc9f87bfbd63e7349ca7fa319b72802e7390c582c",
  "02a46d24457e761ec1fa2440f63b3b40a7ce00d22f31b4c85112782d4154303d",
  "d1fa84c29a4b9db2fd5771cf73a8263f361d545ecc450e32632724be5fdffa25",
  "fac8d0fd1d91a5dc283f85979bd3f1d4f47823440e273f322c7746b5ff862d87",
  "16a1796142487bb0d7de5d2f30591daa68be2e518e7656ae3962326461c7f19c",
  "5c07a54854321c0956b5aa967ba6021749c80a2d8a4f6672e99911724ed19c18",
  "23be65cfe9ece7282e10db0fe8bb717c4d303ef02f33775a35e467e43550759f",
  "923b33cf1ab7a997899221cb0ae7acf71f09e79c658176defc26c55a6d46a3bc",
  "a6b249bc930929c247b6cb2a8267a0e8403a0420395eb8f3b7130bc3ada96390",
]);
/* ══════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
let COURSES = [];
let SENIOR_RESOURCES = [];

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
      </div>
    `;
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
          </a>
        `,
          )
          .join("")}
      </div>
    `;
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

  // ── Classroom Codes ──
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
          </div>
        `;
        cGrid.appendChild(card);
      });
    } else {
      cSec.style.display = "none";
    }
  }

  // ── Meet Links ──
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
          </div>
        `;
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
    // Build COURSES
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

    // Build SENIOR_RESOURCES
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

window.onload = function () {
  if (DEV_PREVIEW_MODE) {
    grantAccess(DEV_USER);
    return;
  }

  // Restore saved session
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

  // Use renderButton on a hidden helper div — most reliable cross-browser approach
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

  // Click the rendered button after it's injected
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

  // Populate user pill — safe null checks
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

  // Switch views
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
   SEMESTER — fetch from Settings sheet
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
    /* silent */
  }
})();
