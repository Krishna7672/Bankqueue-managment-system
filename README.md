# State Bank of India (भारतीय स्टेट बैंक) — Smart Branch e-Token & Queue Management System

A modern, responsive, and accessible **Bank Queue Management System Website** referenced directly from the official **State Bank of India (`onlinesbi.sbi` / `sbi.co.in`)** brand guidelines, font hierarchies, color tokens, and branch **Grahak Mitra** operational workflows.

Built with React 18, Vite 6, and Tailwind CSS. Helps SBI customers select services, generate digital e-Tokens, and view their assigned Single Window Operator (SWO) counter and officer, while giving branch staff and managers comprehensive queue management capabilities.

![Smart Bank Queue Management System](https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

- 🎫 **Customer Token Generation:** 3-step self-service flow across 15 banking services with sequential token numbering (e.g., `A-024`, `C-018`).
- 🧓 **Priority Assisted Queues:** Automated priority queue algorithms for Senior Citizens (60+) and Persons with Disabilities (PwD).
- 🆘 **Dedicated Support Desk:** Fast-track routing for transaction errors, failed UPI, and card fraud directly to Counter 06.
- 📺 **Live TV Status Display:** Real-time lobby TV board with fullscreen kiosk mode, upcoming tokens, and completed list.
- 🔔 **Synthesized Audio & Voice Announcements:** Dual-tone airport-style chime (Web Audio API) and natural speech announcements (Web Speech API).
- 💬 **Interactive Notification Previews:** Realistic smartphone mockups for incoming bank SMS and verified WhatsApp queue updates.
- 👨‍💼 **Officer Serving Workstation:** Dedicated serving console with live handling timer, Call Next, Recall, Complete, Transfer, Skip, and No-Show controls.
- 📊 **Admin Portal & Analytics:** Real-time KPIs, peak hourly volume charts, counter allocations, officer leaderboards, and CSV/JSON audit exports.
- 🔒 **Zero-Credential Security:** Compliant with banking privacy regulations (never asks for PIN, password, OTP, or CVV).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📖 Complete Documentation

For the full architectural breakdown, queue algorithms, user guides, and cloud integration roadmap, please see:
👉 **[DOCUMENTATION.md](DOCUMENTATION.md)**

---

## 🛠 Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Sound:** Web Audio API & Web Speech API
- **State Management:** React Context with `localStorage` persistence & cross-tab sync
