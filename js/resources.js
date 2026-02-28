"use strict";
document.getElementById("yr").textContent = new Date().getFullYear();

/* ════════════════════════════════════════════════════════════
   ████  CONFIGURATION — EDIT THESE  ████

   GOOGLE_CLIENT_ID:
     Get from https://console.cloud.google.com/
     APIs & Services → Credentials → OAuth 2.0 Client IDs

   ALLOWED_EMAILS:
     Explicit list of authorised batch member emails.
     Add every ATERRADOR batch member's email here.
     Both @juniv.edu and personal Gmail addresses can be added.
     Case-insensitive matching is applied automatically.
════════════════════════════════════════════════════════════ */
const GOOGLE_CLIENT_ID =
  "820667040088-fme7kg1mg93jg33u777idd7jl20927am.apps.googleusercontent.com";

/* ══════════════════════════════════════════════════════════
   DEV PREVIEW MODE — skip login for local testing
   Set DEV_PREVIEW_MODE = true  → bypass auth, see portal
   Set DEV_PREVIEW_MODE = false → normal login required
   !! Set to false before deploying to production !!
════════════════════════════════════════════════════════════ */
const DEV_PREVIEW_MODE = true;
const DEV_USER = {
  name: "Preview User",
  email: "dev@aterrador.local",
  picture: null,
};

/* ══════════════════════════════════════════════════════════
   SECURITY: email addresses are stored as SHA-256 hashes
   only. The actual emails never appear in page source.
   Auth: we hash the signed-in email and check it against
   this set — so no one can read the list from source view.
   52 authorised members — ATERRADOR CSE 52nd Batch.
════════════════════════════════════════════════════════════ */
const ALLOWED_HASHES = new Set([
  "b5316e7ad50ca93233b2ee372aebb639a48f6f63954bfd2b55c45ef027e896ba",
  "63eb428c98cdd0d17c4f0c0df24dd4057af57227def76d1a0b60596ba1d9355c",
  "bc17edc1aa2cafb931043018c7acb611c8db77d208ae80f096427faafecf55cb",
  "dd8565bfdebe4ba0a3e6f369ed654cd5a9649e4b1e90034e7d294ea4e190700a",
  "e8d9938af8488f2fd1bfc640e7dc99b99c351b2dde450218ce25f63729d370ac",
  "5c0ad97c9375a5d46a99a486db2c78106be872f4b1aef9473b635050fd41b057",
  "5162535570fce8e40f88baa1dd0f17a275f02a58fb13c590e47e8a94ad514d25",
  "de9dec27a7d9cf6d58ad4731c1b0b80573387d9425d6b07d53862e0c48baacba",
  "f9114da7f83aeedc5d307bb43b2a225c65a64af71f6542a3304291624f595b71",
  "182ecfcb0dba74c77efd514cc1e57d82635dbe2e76633ddfdcaa186caa01ba97",
  "5dc8ff80c52cee1610193979a6979e33cb36f650e272ea4b4bfc37ec2ff185cf",
  "ceb9d6027ff62d0326831d57af73620d6b490cf019506b407d2aba4d5b5bf989",
  "c1239b69484820efa1caa54751162d228c4664bf2147f587dd665397fb00405d",
  "3ff07472dedf85892c2931c98d6db1acbd2dac7beed9cd7962e61859e27052cd",
  "12e3a5334454d1b453e5dd0d2e9936421ec50f76dba6e8919bd95b103707ff42",
  "ad1af8d5fef8d622b5401b846e75ad1786f0d2adb244b912f7a96ecb1a235c37",
  "53f7293a3751ad0bdc865d6efd113a1b976fa34a1a15e7c708961b67409e787e",
  "9ff9563c2ea6f34631321ffbebd59e70828f982052e3d52ea8f787b1c10ee0ca",
  "2893dcb31427b56829ae4744b2fcd2594a54dcb3e8d5447b312110c17955fd4d",
  "d401c3389afcf90f503535194e6fb900b49b096f7af7084b120a94674b36a11f",
  "218adca9116b1c4221f4e81cf9a138946a85a2ffd205b44da7e8343bbf0e32e1",
  "753fb1f44c01fbbc9fcca8d30f4619b9eb63b06823a17477b5cca753e1008fd0",
  "9f0d0f2c48663e49e857533788417a0a44ead7f8f2cfd54f1a74c87d4abafe9e",
  "a920749b1631848fdbbf54496b0818b465c18b4cff5c0b93a3e480b548e90a1a",
  "0bbf321a61426b2039451868c382403eec7351aa54fd57864ea5790619b4a13e",
  "038bf5935bf0c9a813d38c4aeddaa9347d2547f82debc51508e7d79281ae973c",
  "316e764c0a580f4e3025b2bc5cc7e6ffb2b0473f2dfde4a84e3461889d25522e",
  "31db86fd7b7266300b913ba2e14d48a7cc9911245659681ce27d3bf3ec98a7d8",
  "200f26564f994594e02a58ef52d84ee3063f8d7148a1e2fccbead00dd3185721",
  "9b4ce00b2e03930ce72a5b1ae46c1582f888cd30ad722a8ca7771aecc4cbc7c9",
  "209fc20ff31a8ca53300f103fa52c614db913af9712abb1e8c584b188325fe95",
  "a2d6ed5159be330e9cf76c26288e743b778b359c8b33fc591a33d7d32fec6cd3",
  "399f0aeb09f01ffda87bd2a0d9071b5e4febc30626f338355e5b2733a2215a38",
  "2259d46817890b8fad2888b960e40a35d048325e6f7cf331ef5b22e05fac06a0",
  "75cc68f42a0ab7abebdfa424181008ee87a42f6ceb4f86755f9d884cee61a0ff",
  "f8c275c2adf6b37e88a9b1685f13ece4842ae981315248a10b73b73bc4d401c9",
  "662b6c5bfb9f8bd55f240dce6c89a47c781cabf1d594e347056835bc4f094bca",
  "bfcab23ecafe581cde15836fbbeafade6346e7bcb8130f735ebff700d9179182",
  "cb7f5001976614b065cbbd335bc34d698e3b5e6901592077484cd49b400b6120",
  "564c6ad5b47dbffc52f69d23fa9b8d7c5e5d7abd4f3d58ef017cf314e5e0ed1a",
  "176ff1f955395cf879909383d99749604aaa3b28301a06a442817e0673858c55",
  "192a3e00903c132911924a72037403ada88239e641fec2e44e4f294c99a355b7",
  "8c68fb79adcc490971fc284ad020541cec973c89911e58b5b542b02de7ee8224",
  "43398a9269b08cdd26c5267878a3fec3770ceb745f2feffb55edf9189a7a249d",
  "e789ac5b139f9e22004314db9c2c5a21f992fe1dcce37413a81ea1222a4a66ae",
  "04170998949964f6f7d40f2e6953a659c7d217ee72069d7b2bc645dde6356fd3",
  "a5988210ffe8a349761e98ae8e595d93a5e4e0d15dd1991ef2012e5c9e96aba2",
  "5bd8519a1b875b66ddfc660c483a6434c7f7bedaaaaf3094b8498bead7e04262",
  "faee17878a80ee9ad457a4a5afbf39bc89f475e893751207a03c5a2ce9b00bac",
  "a57809891727dbc21bd9bcb17060daf1f53010626e5b18d3548374a363faa564",
  "fd28e4ed8393928258ba6b4df4683d9043cb8914e964c521f5a79579bce4ef4f",
  "11bea3f03462bd068b2388d46b3ab07cc10671ec61ecb3e02143f4da6f7aa693",
]);
const API_URL =
  "https://script.google.com/macros/s/AKfycbxocBxiKrYnxL_Z7DmlDZID-3BE1jpOBZ8pBhhtLDIF7toILjyFEPFRWYcxK5ZxN9tsfw/exec";

/* ══════════════════════════════════════════════════════════
   FALLBACK RESOURCE DATA
   Used when API_URL not yet set, or fetch fails.
   Keep these in sync with your sheet as a safety net.

   Sheet tabs needed:
     "Resources" — one row per file, columns:
       courseCode | courseName | courseColor | teacher |
       fileName | fileType | fileIcon | fileSize | fileUrl | isNew

     "SeniorResources" — one row per file, columns:
       batch | packTitle | packDesc | fileName | fileUrl | fileIcon

   fileType values: slides | notes | quest | lab | books
   isNew: TRUE / FALSE
══════════════════════════════════════════════════════════ */
const FALLBACK_COURSES = [];

const FALLBACK_SENIOR = [];

let COURSES = []; // filled by loadResources()
let SENIOR_RESOURCES = []; // filled by loadResources()

/* ═══════════════════════════════════════════
   COLOUR MAPS
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   RENDER COURSES
═══════════════════════════════════════════ */
function renderCourses() {
  const list = document.getElementById("course-list");
  list.innerHTML = "";

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

/* ═══════════════════════════════════════════
   RENDER SENIOR RESOURCES
═══════════════════════════════════════════ */
function renderSenior() {
  const grid = document.getElementById("senior-grid");
  grid.innerHTML = "";

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

/* ═══════════════════════════════════════════
   COURSE ACCORDION TOGGLE
═══════════════════════════════════════════ */
function toggleCourse(btn) {
  const block = btn.closest(".course-block");
  const isOpen = block.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(isOpen));
}

/* ═══════════════════════════════════════════
   FILTER + SEARCH
═══════════════════════════════════════════ */
let curFilter = "all";
let curSearch = "";

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll(".rtag").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
  const srch = document.getElementById("rsearch");
  if (srch)
    srch.addEventListener("input", function () {
      curSearch = this.value.toLowerCase().trim();
      applyFilters();
    });
});

function applyFilters() {
  let visFiles = 0;
  let visSenior = 0;

  // For courses: show/hide individual rcard items, hide course block if all cards hidden
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
    // Auto-open if search active and matches
    if (curSearch && blockVis > 0) block.classList.add("open");
  });

  // Senior section
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
  document.getElementById("rcount").textContent =
    `${visFiles + visSenior} of ${total} files`;
}

function updateCount() {
  const total =
    COURSES.reduce((a, c) => a + c.resources.length, 0) +
    SENIOR_RESOURCES.reduce((a, s) => a + s.files.length, 0);
  document.getElementById("rcount").textContent = `${total} files`;
}

/* ══════════════════════════════════════════════════════════
   RESOURCE LOADER
   Called after auth succeeds. Fetches two sheet tabs in
   parallel, maps rows into COURSES and SENIOR_RESOURCES,
   then calls the existing render functions.

   Falls back to FALLBACK_COURSES / FALLBACK_SENIOR if
   API_URL is not set or fetch fails — portal still works.
══════════════════════════════════════════════════════════ */
async function loadResources() {
  // Show a subtle loading indicator inside the portal
  const courseList = document.getElementById("course-list");
  if (courseList)
    courseList.innerHTML =
      '<div style="padding:40px;text-align:center;font-family:var(--m2);font-size:10px;' +
      'letter-spacing:3px;text-transform:uppercase;color:var(--txd)">Loading resources…</div>';

  if (API_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
    console.info("[Resources] API_URL not set — using fallback data.");
    COURSES = FALLBACK_COURSES;
    SENIOR_RESOURCES = FALLBACK_SENIOR;
    renderCourses();
    renderSenior();
    updateCount();
    return;
  }

  try {
    const [resRes, senRes] = await Promise.all([
      fetch(`${API_URL}?sheet=Resources`, { cache: "no-cache" }),
      fetch(`${API_URL}?sheet=SeniorResources`, { cache: "no-cache" }),
    ]);
    if (!resRes.ok) throw new Error(`Resources HTTP ${resRes.status}`);
    if (!senRes.ok) throw new Error(`SeniorResources HTTP ${senRes.status}`);

    const resRows = await resRes.json();
    const senRows = await senRes.json();

    /*
      Resources sheet columns:
        courseCode | courseName | courseColor | teacher |
        fileName | fileType | fileIcon | fileSize | fileUrl | isNew

      Build the nested COURSES structure the render functions expect.
    */
    const courseMap = new Map();
    resRows
      .filter((r) => r.courseCode && r.fileName)
      .forEach((r) => {
        const code = String(r.courseCode).trim();
        if (!courseMap.has(code)) {
          courseMap.set(code, {
            code: code,
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

    /*
      SeniorResources sheet columns:
        batch | packTitle | packDesc | fileName | fileUrl | fileIcon

      Build the nested SENIOR_RESOURCES structure.
    */
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

    renderCourses();
    renderSenior();
    updateCount();
  } catch (err) {
    console.error("[Resources] Fetch failed:", err);
    COURSES = [];
    SENIOR_RESOURCES = [];
    renderCourses();
    renderSenior();
    updateCount();
  }
}

/* ═══════════════════════════════════════════
   GOOGLE OAUTH — SIGN IN / SIGN OUT
═══════════════════════════════════════════ */
let googleClient = null;
let currentUser = null;

/* Called when Google script loads */
window.onload = function () {
  // DEV PREVIEW — bypass auth entirely
  if (DEV_PREVIEW_MODE) {
    grantAccess(DEV_USER);
    return;
  }

  // Check for saved session
  const saved = sessionStorage.getItem("aterrador_user");
  if (saved) {
    try {
      const user = JSON.parse(saved);
      grantAccess(user);
    } catch (e) {
      sessionStorage.removeItem("aterrador_user");
    }
  }

  // Init Google client if CLIENT_ID is configured
  if (
    GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"
  ) {
    if (window.google) {
      initGoogleClient();
    }
  } else {
    // Demo mode — show a dev notice on the sign-in button
    const btn = document.getElementById("signin-btn");
    if (btn) {
      btn.title =
        "Configure GOOGLE_CLIENT_ID in the script to enable real OAuth";
    }
  }
};

function initGoogleClient() {
  google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    callback: handleTokenResponse,
  });
}

function startSignIn() {
  const errBox = document.getElementById("ag-error");
  errBox.classList.remove("show");

  // If CLIENT_ID not configured, show demo/dev message
  if (
    GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"
  ) {
    document.getElementById("ae-body").innerHTML =
      "<strong>Dev Mode:</strong> Configure <code>GOOGLE_CLIENT_ID</code> in the script to enable real Google OAuth. " +
      "";
    errBox.classList.add("show");
    return;
  }

  if (!window.google) {
    document.getElementById("ae-body").textContent =
      "Google Sign-In could not load. Please check your internet connection and try again.";
    errBox.classList.add("show");
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleIdToken,
    ux_mode: "popup",
  });
  google.accounts.id.prompt();
}

/* Handle ID token from google.accounts.id (One Tap) */
function handleIdToken(response) {
  try {
    const payload = parseJwt(response.credential);
    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    checkAccess(user);
  } catch (e) {
    showError("Failed to read sign-in response. Please try again.");
  }
}

/* JWT parser (no library needed) */
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

/* ── Access control ── */
async function checkAccess(user) {
  const email = (user.email || "").toLowerCase().trim();

  // Hash the email with SHA-256 then compare against stored hashes
  // This means the plaintext email list is never in the page source
  try {
    const msgBuf = new TextEncoder().encode(email);
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
          `This portal is for <strong>ATERRADOR CSE 52nd Batch</strong> members only. ` +
          `Contact your batch representative if you believe this is an error.`,
      );
    }
  } catch (e) {
    // Fallback if SubtleCrypto unavailable (non-HTTPS)
    showError(
      "Sign-in requires a secure (HTTPS) connection. Please access this portal via the deployed URL, not a local file.",
    );
  }
}

function grantAccess(user) {
  currentUser = user;
  // Persist session
  sessionStorage.setItem("aterrador_user", JSON.stringify(user));

  // Highlight this user's pill in the access grid
  (async () => {
    try {
      const e2 = (user.email || "").toLowerCase().trim();
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(e2),
      );
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const pill = document.querySelector(`.ag-pill[data-hash="${hex}"]`);
      if (pill) {
        pill.classList.add("ag-pill--me");
        pill.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (e) {}
  })();

  // Populate user pill
  const avatarEl = document.getElementById("user-avatar");
  if (user.picture) {
    avatarEl.innerHTML = `<img src="${user.picture}" alt="${user.name}">`;
  } else {
    avatarEl.textContent = (user.name || user.email)[0].toUpperCase();
  }
  document.getElementById("user-name").textContent = user.name || "—";
  document.getElementById("user-email").textContent = user.email || "—";

  // Switch views
  document.getElementById("auth-gate").style.display = "none";
  document.getElementById("resource-portal").classList.add("show");

  // Load resources from sheet (or fallback)
  loadResources();
}

function signOut() {
  currentUser = null;
  sessionStorage.removeItem("aterrador_user");
  if (window.google) {
    google.accounts.id.disableAutoSelect();
  }
  document.getElementById("resource-portal").classList.remove("show");
  document.getElementById("auth-gate").style.display = "";
  document.getElementById("ag-error").classList.remove("show");
}

function showError(msg) {
  const box = document.getElementById("ag-error");
  const body = document.getElementById("ae-body");
  body.innerHTML = msg;
  box.classList.add("show");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ═══════════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════════ */
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
    hdr.style.boxShadow =
      window.scrollY > 10 ? "0 4px 32px rgba(0,0,0,.6)" : "none";
  },
  { passive: true },
);

(async function loadSemester() {
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
