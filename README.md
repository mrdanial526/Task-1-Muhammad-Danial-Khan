# DecodeLabs — Enterprise Cloud Architecture & AI Systems
> **Task 1 Submission** | **DECODE Full-Stack Web Development Internship**

[![HTML5](https://img.shields.io/badge/HTML5-Semantic_&_Accessible-E34F26?logo=html5&logoColor=white)](#-tech-stack)
[![CSS3](https://img.shields.io/badge/CSS3-Grid_%26_Flexbox-1572B6?logo=css3&logoColor=white)](#-tech-stack)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?logo=javascript&logoColor=black)](#-tech-stack)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-005A9C)](#-accessibility--quality-standards)
[![Status](https://img.shields.io/badge/Live_Demo-Online-success)](#-live-links)

---

## 🔗 Live Links
- **Live Demo**: [https://mrdanial526.github.io/Task_1/](https://mrdanial526.github.io/Task_1/)
- **GitHub Repository**: [https://github.com/mrdanial526/Task_1](https://github.com/mrdanial526/Task_1)

---

## 📌 Project Overview
**DecodeLabs** is a responsive, high-performance enterprise landing page built with pure modern web standards (**Semantic HTML5**, **Modern CSS3**, and **Vanilla JavaScript**). It features zero external framework dependencies, full keyboard accessibility (WCAG 2.1 AA), dynamic category filtering, interactive blueprint modals, and sequential scroll tracking.

---

## ✨ Key Highlights

- **Semantic Landmark Architecture**: Structured with standard HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`).
- **Responsive CSS Layout**: Built with CSS Grid, Flexbox, design tokens (`:root`), fluid typography (`clamp()`), and mobile-first media queries.
- **Dynamic Category Filtering**: Instant filtering across engineering solutions with animated transitions and ARIA live region announcements.
- **Interactive Solution Inspector**: Native `<dialog>` modal with copy-to-clipboard code blueprint integration.
- **Sequential ScrollSpy & Mobile Drawer**: Header and table-of-contents navigation with focus-trapped, keyboard-accessible mobile menu (`Esc` key support).
- **Client-Side Form Validation**: Real-time accessible feedback with regex email validation and submission status alerts.
- **Zero Framework Debt**: Handcrafted with vanilla web technologies for sub-millisecond load times.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure, SEO tags, OpenGraph metadata, WCAG 2.1 AA |
| **Styling** | CSS3 | CSS Grid, Flexbox, custom properties, glassmorphism, responsive UI |
| **Logic** | JavaScript (ES6+) | Modular controllers, focus trap, scrollspy, filtering, modal dialog |
| **Assets** | Web Images / SVG | High-resolution optimized imagery and inline vector graphics |

---

## 📂 Project Organization

```text
decodelabs-1st-task/
├── images/                       # High-resolution optimized asset images
│   ├── hero-dashboard.jpg        # Operations workstation hero visual
│   ├── profile-architect.jpg     # Leadership architect profile
│   ├── service-cloud.jpg         # Kubernetes & multi-cloud graphic
│   ├── service-ai.jpg            # GenAI & vector lakehouses graphic
│   ├── service-security.jpg      # Zero-trust cybersecurity graphic
│   ├── service-microservices.jpg # Microservices & API gateway graphic
│   └── service-streaming.jpg     # Streaming data pipeline graphic
├── .gitignore                    # OS and editor ignore rules
├── index.html                    # Semantic HTML5 entry document
├── README.md                     # Executive project overview & documentation
├── script.js                     # Vanilla JavaScript modular application logic
└── style.css                     # Production responsive stylesheet & design system
```

---

## 🚀 Quick Start / How to Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mrdanial526/Task_1.git
   ```

2. **Open in Browser**:
   - Double-click `index.html` to open it in any modern browser, **or**
   - Serve locally with VS Code Live Server / Python:
     ```bash
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your browser.

---

## ♿ Accessibility & Quality Standards

- **WCAG 2.1 AA Compliance**: Valid color contrast ratios (4.5:1+), visible focus rings, and screen-reader announcements (`aria-live`, `aria-expanded`, `aria-invalid`).
- **Reduced Motion Support**: Respects user OS motion preferences via `@media (prefers-reduced-motion)`.
- **Keyboard Navigation**: Full Tab/Shift+Tab navigation and modal/drawer dismissal via the `Escape` key.

---

## 📜 Submission Details
- **Internship**: DECODE Full-Stack Web Development Internship
- **Task**: Task 1 — Modern Responsive Enterprise Landing Platform
- **Developer**: Danial ([@mrdanial526](https://github.com/mrdanial526))
