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

const API_URL =
  "https://script.google.com/macros/s/AKfycbxocBxiKrYnxL_Z7DmlDZID-3BE1jpOBZ8pBhhtLDIF7toILjyFEPFRWYcxK5ZxN9tsfw/exec";
const API_TOKEN = "blue1brown-nutshell";
const EMAIL_SALT = "trumanDoctrine#1971@july24";

function apiUrl(sheet) {
  return `${API_URL}?sheet=${sheet}&token=${API_TOKEN}`;
}

let ALLOWED_HASHES = new Set();

let ACCESS_ROSTER = [];

async function fetchAccessList() {
  const res = await fetch(apiUrl("AccessList"), { cache: "no-cache" });
  if (!res.ok) throw new Error(`AccessList HTTP ${res.status}`);
  const rows = await res.json();

  ALLOWED_HASHES = new Set();
  ACCESS_ROSTER = [];

  rows
    .filter(
      (r) => r.hash && String(r.active || "TRUE").toUpperCase() !== "FALSE",
    )
    .forEach((r) => {
      const h = String(r.hash).trim().toLowerCase();
      const label = String(r.label || "").trim();
      ALLOWED_HASHES.add(h);
      ACCESS_ROSTER.push({ hash: h, label });
    });
}
