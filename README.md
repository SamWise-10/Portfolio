# Harsamer R. Jumad — Personal Portfolio Website

**Lab Activity: Web 1.0 (Read-Only Static Web Portfolio) & XAMPP Local Deployment**

- **Author:** Harsamer R. Jumad
- **Program & Year:** Bachelor of Science in Information Technology (BSIT) — Fourth-Year Student
- **Institution:** Mindanao State University – Tawi-Tawi College of Technology and Oceanography (MSU-TCTO)
- **Location:** Bongao, Tawi-Tawi, Philippines

---

## 1. Project Overview

This repository contains a **5-page static read-only (Web 1.0 architecture) personal portfolio website** developed for a Web 1 & XAMPP laboratory activity. It adheres strictly to client-side static technologies (**HTML5**, **CSS3**, and **Vanilla JavaScript** with **zero jQuery** or backend database writes) while featuring a modern **Dual-Tone Cyber-Galaxy Scrollytelling** user interface:

- **300-Frame Smooth Scroll Sequence (`#sequence-canvas`):** Uses HTML5 `<canvas>` with a Linear Interpolation (LERP) damping loop and multi-pass progressive preloading to smoothly scrub through 300 portrait frames (`ezgif-172bc903c5a9236f-jpg/ezgif-frame-001.jpg` to `ezgif-frame-300.jpg`) as the user scrolls.
- **CSS Scroll-Driven Animations & Progressive Enhancement:** Implements modern CSS `animation-timeline: scroll()`, named `view-timeline` scrollytelling sections, a shrinking glassmorphic navigation header, and a decorative top scroll-progress bar, paired with JavaScript `IntersectionObserver` and scroll fallbacks plus `prefers-reduced-motion` accessibility support.
- **Interactive Galaxy Starfield (`#galaxy-canvas`):** Renders an ambient dual-tone particle field matching the electric cyan (`#00d2ff`) and neon crimson (`#ff2e55`) lighting of the portrait sequence.

---

## 2. Website Structure (5 Pages)

| File | Page Title | Description |
| :--- | :--- | :--- |
| `index.html` | **Home (Scrollytelling Overview)** | Full 5-stage scroll-driven narrative covering Hero, About Me, Capstone Project, Technical Venture, and Skills/Education overview. |
| `project.html` | **Featured Project** | Deep dive into the **Capstone Project — Mobile Citizen Reporting System** built for Bongao, Tawi-Tawi (FastAPI, PostgreSQL, React, Agile/Iterative SDLC, Three-Tier Architecture, SUS ≥ 68). |
| `venture.html` | **Technical Venture** | Overview of the **Piso WiFi Vendo ISP Business** operating since early 2026 (Starlink backhaul, TP-Link VLAN segmentation, COMFAST CF-EW87 & CF-EW85 outdoor APs). |
| `skills.html` | **Technical Skills** | Core competencies in Distributed Databases (2PC, 3PC, ARIES), SQL & NoSQL Databases (PostgreSQL, MySQL, MongoDB, Redis, Cassandra, Neo4j), AI & Knowledge Representation, and Systems Integration. |
| `education.html` | **Education** | Academic profile at **MSU-TCTO** (BSIT Fourth-Year Student) and research focus areas. |

### Supporting Assets & Files
- `style.css` — Custom stylesheet with CSS custom properties, glassmorphism (`backdrop-filter`), responsive mobile navigation, and scroll-driven animations.
- `script.js` — Pure Vanilla JavaScript engine for the 300-frame canvas scrubber, galaxy starfield, mobile hamburger menu, and progressive enhancement fallbacks.
- `profile.jpg` — Profile portrait displayed in the About section (easily swappable by replacing `profile.jpg` in the root folder).
- `ezgif-172bc903c5a9236f-jpg/` — Directory containing the 300 sequential JPEG frames (`ezgif-frame-001.jpg` – `ezgif-frame-300.jpg`).

---

## 3. Running the Project with XAMPP (Lab Activity Setup)

To serve and test this portfolio using **XAMPP Apache Web Server**:

1. **Install & Locate XAMPP:**
   Ensure XAMPP is installed on your machine (default path on Windows is `C:\xampp`).
2. **Copy or Clone into `htdocs`:**
   Place this project folder inside the XAMPP `htdocs` directory:
   ```bash
   cd C:\xampp\htdocs
   git clone https://github.com/SamWise-10/Portfolio.git PORTFOLIO
   ```
   *(Or copy the `C:\PORTFOLIO` folder directly into `C:\xampp\htdocs\PORTFOLIO`).*
3. **Start Apache in XAMPP Control Panel:**
   - Open the **XAMPP Control Panel**.
   - Click **Start** next to the **Apache** module until the module name turns green and shows port `80` / `443`.
4. **Open in Your Web Browser:**
   Navigate to:
   ```text
   http://localhost/PORTFOLIO/
   ```
   *(Or `http://localhost/Portfolio/` depending on your folder name).*

---

## 4. Alternative Local Preview (Python HTTP Server)

If testing outside XAMPP, you can also serve the folder directly using Python's built-in static server:

```powershell
python -m http.server 5500 --directory "C:\PORTFOLIO" --bind 127.0.0.1
```

Then open **[http://localhost:5500](http://localhost:5500)** in any modern browser.

---

## 5. Technology Compliance Checklist

- [x] **Web 1.0 Read-Only Static Architecture** (No server-side database writes or dynamic mutations)
- [x] **Minimum 5 Interlinked HTML5 Pages** (`index.html`, `project.html`, `venture.html`, `skills.html`, `education.html`)
- [x] **Custom CSS3 Styling** (`style.css`)
- [x] **100% Pure Vanilla JavaScript — Zero jQuery** (`script.js`)
- [x] **XAMPP (`htdocs`) Ready**
