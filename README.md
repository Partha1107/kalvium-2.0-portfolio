# ⚡ Kalvium 2.0 Portfolio — Squad 138

> A tactical cyberpunk-themed student portfolio with real-time coding intelligence from LeetCode, GitHub, HackerRank & CodeChef.

![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)
![Squad](https://img.shields.io/badge/Squad-138-red?style=flat-square)
![Class](https://img.shields.io/badge/Class-2026-blue?style=flat-square)

---

## 🎯 Overview

**Kalvium 2.0 Portfolio** is a redesigned, feature-rich portfolio website for **Kalvium Squad — Class of 2026**. Built with a military/cyberpunk aesthetic, it showcases students and mentors through interactive profile cards, editable dossiers, and a live **Coding Intelligence** system that fetches real stats from multiple competitive programming platforms.

🔗 **Live Demo:** [View Portfolio](https://kalvium-portfolio-squad138.netlify.app/)

---

## 🚀 Features

### 🎨 Theme Engine
- **3 Color Modes** — Dark, Light, System-adaptive
- **10 Accent Colors** — Red, Cyan, Green, Purple, Amber, Pink, Blue, White, Matrix, Gold
- **7 Font Families** — Corp, Sci-Fi, Orbit, Terminal, Space, Mecha, Pixel
- **3 Font Sizes** — Small, Normal, Large

### 📊 Coding Intelligence System *(NEW)*
- **Real-time stats** from LeetCode, GitHub, HackerRank & CodeChef APIs
- **Rank System** — RECRUIT → OPERATIVE → SPECIALIST → ELITE → LEGENDARY
- **LeetCode** — Easy/Medium/Hard breakdown with difficulty bars
- **GitHub** — Repos, Stars, Followers, Languages, Top Repositories
- **HackerRank** — Profile level, role, current learning/practice signals
- **CodeChef** — Rating, Stars, Global/Country rank
- **Platform Linking** — Configure usernames via UI, persisted in localStorage
- **Smart Caching** — 4-hour cache to respect API rate limits

### 🃏 Interactive Cards
- **Glare effect** on hover with perspective 3D tilt
- **Scroll Mode** — Infinite horizontal auto-scroll
- **Gallery Mode** — Grid layout with search/filter
- **Real-time search** — Filter students by name instantly

### 📁 Subject Dossier
- **Editable Projects** — Add/remove deployed systems
- **Certifications** — Track clearances with file attachment simulation
- **Skills Matrix** — Progress bars with simulated HackerRank tests
- **Coding Stats** — Live platform data with composite scoring

### 🤖 Neural Assist Chatbot
- Rule-based tactical chatbot with themed responses
- Animated chat bubbles with cyberpunk styling

### 🗺️ Guided Tour
- 5-step onboarding walkthrough with highlighted elements
- Accessible from Settings → Protocol Manual

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 |
| **Styling** | Vanilla CSS + TailwindCSS (CDN) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Icons** | Font Awesome 6.4 |
| **Fonts** | Google Fonts (7 families) |
| **APIs** | GitHub REST API, HackerRank REST endpoints, CodeChef API, alfa-leetcode-api |
| **Hosting** | Netlify |
| **Version Control** | Git + GitHub |

---

## 📂 Project Structure

```
kalvium-2.0-portfolio/
├── index.html          # Main HTML
├── style.css           # All styling + theme system
├── script.js           # Core app logic, data, UI (800 lines)
├── coding-stats.js     # Multi-platform coding stats engine (370 lines)
├── Src/                # Student & mentor profile images (43 files)
├── _headers            # Netlify security headers
├── _redirects          # Netlify SPA redirect config
└── README.md
```

---

## 📊 Coding Signals

The dossier pulls per-platform signals directly:

- **LeetCode** — solved counts, difficulty split, languages, recent solves
- **GitHub** — repos, stars, followers, languages, recent repos
- **HackerRank** — level, role, current learning/practice, recent challenges
- **CodeChef** — rating, stars, global/country rank

---

## 🏃 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Partha1107/kalvium-2.0-portfolio.git
   ```
2. **Open locally** — Just open `index.html` in your browser (no build step needed)

3. **Link your platforms** — Click any student → Dossier → Link_Platforms → Enter usernames

---

## 👥 Team

**Squad 138 — Kalvium × St. Joseph's University, Chennai**

| Role | Name |
|---|---|
| Creator & Lead Dev | Ashwin Raj J J |
| Co-Creator | Dhinesh Babu G |
| Co-Creator | Sanjay Chelliah C |

---

## 📝 License

This project is built for educational purposes as part of the Kalvium program.

---

<p align="center">
  <b>KALVIUM_SYNC_V2.0 // SUCCESS</b><br>
  <sub>Built with ❤️ by Squad 138</sub>
</p>
