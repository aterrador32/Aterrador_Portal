# 🚀 ATERRADOR Portal

### CSE 52nd Batch · Jahangirnagar University

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://your-domain.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, fully client-side **batch management portal** built for **ATERRADOR (CSE 52nd Batch)** at **Jahangirnagar University**.  
It centralizes **class routines, exam schedules, notices, resources, forms, and faculty information** in a single, fast, and secure platform.

---

## 📌 Overview

- 🔐 OAuth-protected resource access
- 📊 Google Sheets–driven backend (no traditional server)
- ⚡ Fast static deployment (Vercel / GitHub Pages)
- 📱 Fully responsive, mobile-first design
- 🎨 Dark UI with custom branding

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Google Apps Script Setup](#-google-apps-script-setup)
- [Google OAuth Configuration](#-google-oauth-configuration)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Core Modules

- **Class Routine** – Live weekly timetable with current-class indicator
- **Exam Schedule** – Tutorial & Final exams with countdown timers
- **Notice Board** – Internal & external notices with pinning and search
- **Resource Portal** – Secure course materials & senior archives
- **Teacher Directory** – Searchable faculty information
- **Bus Schedule** – Embedded university bus timetable
- **Batch Forms** – Tours, events, sports & registrations
- **About Section** – Batch identity, history, and branding

---

### 🔐 Security

- Google OAuth 2.0 authentication
- Client-side SHA-256 email hashing
- Authorized member verification
- CORS-safe Apps Script API

---

### 📱 UI / UX

- Mobile-first responsive layout
- Dark theme with orange accent (`#FF6B00`)
- Smooth animations & transitions
- Grid-based visual effects
- Touch-friendly navigation

---

## 🛠 Tech Stack

| Layer    | Technology                             |
| -------- | -------------------------------------- |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend  | Google Apps Script (Serverless API)    |
| Database | Google Sheets                          |
| Auth     | Google OAuth 2.0                       |
| Hosting  | Vercel (recommended), GitHub Pages     |
| Fonts    | Share Tech Mono, Courier Prime         |
| Icons    | SVG + Unicode                          |

---

## 📁 Project Structure

```file-structure
aterrador-portal/
├── index.html                 # Home page
├── routine.html              # Class routine page
├── exam-schedule.html        # Exam schedule page
├── resources.html            # Resource portal (OAuth protected)
├── notice-board.html         # Notice board page
├── bus-schedule.html         # Bus schedule page
├── teachers.html             # Teacher directory
├── about.html                # About us page
├── forms.html                # Batch forms page
│
├── css/
│   ├── styles.css            # Home page styles
│   ├── routine.css           # Routine page styles
│   ├── exam-schedule.css     # Exam schedule styles
│   ├── resources.css         # Resource portal styles
│   ├── notice-board.css      # Notice board styles
│   ├── bus-schedule.css      # Bus schedule styles
│   ├── teachers.css          # Teacher directory styles
│   ├── about.css             # About page styles
│   └── forms.css             # Forms page styles
│
├── js/
│   ├── main.js               # Home page scripts
│   ├── routine.js            # Routine functionality
│   ├── exam-schedule.js      # Exam schedule logic
│   ├── resources.js          # Resource portal + OAuth
│   ├── notice-board.js       # Notice board logic
│   ├── bus-schedule.js       # Bus schedule logic
│   ├── teachers.js           # Teacher directory logic
│   ├── about.js              # About page scripts
│   └── forms.js              # Forms functionality
│
├── Images/
│   ├── favicon1.png          # Site favicon
│   ├── JU_logo_White.svg     # University logo
│   ├── aterrador_logo.svg    # Batch logo
│   └── group-photo.jpg       # Batch group photo (optional)
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 📋 Prerequisites

- Google Account (Sheets + Apps Script)
- Google Cloud Console access
- Git
- Optional: Node.js / Python (local server)
- Recommended: Vercel account

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/aterrador-portal.git
cd aterrador-portal
```

### 2️⃣ Run Locally (Optional)

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

### 3️⃣ Run Locally (Optional)

Update every JS file:

```bash
const API_URL = "YOUR_APPS_SCRIPT_URL";
```

In resources.js:

```bash
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
```

Add SHA-256 email hashes:

```bash
const ALLOWED_HASHES = new Set([
  "hash1...",
  "hash2..."
]);
```

---

## 🔧 Google Apps Script Setup

### Sheet Requirements

Create Google Sheet named:

```code
ATERRADOR Portal Data
```

Tabs must match <b>exact names</b>:

- Settings

- Routine

- Palette

- TutorialExams

- FinalExams

- Notices

- Teachers

- Forms

- Resources

- SeniorResources

---

### Apps Script Code

```code
function doGet(e) {
  const sheetName = e.parameter.sheet;
  if (!sheetName) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Missing 'sheet' parameter" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Sheet not found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const rows = data.map(r =>
    Object.fromEntries(headers.map((h, i) => [h, r[i]]))
  );

  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy as:

- Web App

- Execute as: Me

- Access: Anyone

## 🔐 Google OAuth Configuration

- Create Google Cloud project

- Enable Google+ API

- OAuth Client Type: Web

- Authorized origins:
    - http://localhost:8000

    - https://aterrador32.vercel.app

---

### Generate Email Hashes

```JavaScript
async function getHash(email, salt) {
  const msg = email.toLowerCase().trim() + salt;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

// Change the salt to YOUR chosen salt
const SALT = "SALT";

// Put ALL your emails here
const emails = [
  "roll63@juniv.edu",
  "roll64@juniv.edu",
];

for (const email of emails) {
  const h = await getHash(email, SALT);
  console.log(`"${h}", // ${email}`);
}
```

---

## 🚀 Deployment

### ✅ Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect via GitHub → <b> Auto Deploy</b>

---

## GitHub Pages

- Repo → Settings → Pages

- Branch: main

- Folder: /root

## 🔧 Environment Variables

.env.example

```env
API_URL=https://script.google.com/macros/s/XXXX/exec
GOOGLE_CLIENT_ID=XXXX.apps.googleusercontent.com
```

## ⚠️ Do not commit real secrets.

## 🎨 Customization

### Theme Colors

```CSS
:root {
  --or: #ff6b00;
  --bk: #090909;
  --tx: #e0e0e0;
}
```

### Branding

- Replace logos in /Images

- Update favicon

- Modify fonts via Google Fonts

---

## 🐛 Troubleshooting

| Issue              | Fix                                         |
| ------------------ | ------------------------------------------- |
| CORS error         | Redeploy Apps Script with **Anyone** access |
| OAuth fails        | Check HTTPS + authorized origins            |
| Data not loading   | Verify sheet names & API URL                |
| Mobile menu broken | Check JS IDs & console                      |
| Favicon missing    | Hard refresh + cache clear                  |

---

## 🤝 Contributing

1. Fork repository

2. Create branch

3. Commit changes

4. Open Pull Request

Code Style

- 2-space indentation

- Clear variable names

- Comment complex logic

---

## 📄 License

MIT LICENSE:
<a href='LICENSE'>see LICENSE</a>

---

## 🙏 Acknowledgments

## T-REX — Design & Development

## 📬 Contact

- 📧 Email: aterrador32@gmail.com

- 🌐 Facebook: https://facebook.com/aterrador32

- 🏫 University: https://www.juniv.edu

=======
© 2026 · All rights reserved · Designed & Developed by T-REX
