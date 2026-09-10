# ECE Docs Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full static, bilingual (FA/EN) GitHub Pages site for the Hormozgan ECE department: homepage with a course grid, a reusable course-page template with a video player + notes/exercises/code sections, all driven by small JSON data files.

**Architecture:** Plain static HTML/CSS/JS, no build step, no framework. `main.js` owns cross-page behavior (language toggle persisted to `localStorage`, scroll-reveal animation, homepage course grid). `course.js` owns per-course rendering: fetches `./data.json` and renders four sections, with a shared `<video>` player driven by a session list. Navy design system lives entirely in `assets/css/style.css` using CSS logical properties so RTL/LTR both work from one stylesheet.

**Tech Stack:** HTML5, vanilla CSS3, vanilla JS (no dependencies), Google Fonts (Vazirmatn) via CDN link tag.

**Spec:** `docs/superpowers/specs/2026-09-10-ece-docs-site-design.md`

## Global Constraints

- No code comments anywhere in shipped files (per user instruction).
- Navy (سرمه‌ای) primary color; university logo used in header + hero.
- Site must work correctly when served from GitHub Pages at the repo root (relative paths only, no absolute local paths).
- Bilingual FA/EN via a single toggle button that flips `dir` and swaps `data-fa`/`data-en` text; default language is Persian/RTL.
- No test framework is introduced; verification is manual (local static server + browser/curl checks), matching the spec's Testing section.

---

### Task 1: Design system foundation — logo, CSS, courses index

**Files:**
- Create: `assets/img/logo.png`
- Create: `assets/css/style.css`
- Create: `courses/index.json`

**Interfaces:**
- Produces: CSS custom properties and classes (`.site-header`, `.hero`, `.course-grid`, `.course-card`, `.section`, `.reveal`, `.player-wrap`, `.session-list`, `.resource-list`, `.placeholder`, `.site-footer`, `.lang-toggle`) that Tasks 3–5's HTML will use verbatim.
- Produces: `courses/index.json` shape `[{id, title_fa, title_en, desc_fa, desc_en}, ...]` that Task 2's `initCourseGrid()` consumes.

- [ ] **Step 1: Copy the university logo into the repo**

```bash
cp /Users/mac/Downloads/logo.jpg /Users/mac/Desktop/folder/uni/ece-docs/assets/img/logo.png
```

- [ ] **Step 2: Verify the logo copied correctly**

Run: `file /Users/mac/Desktop/folder/uni/ece-docs/assets/img/logo.png`
Expected: reports a valid JPEG/PNG image, non-zero size.

- [ ] **Step 3: Write `assets/css/style.css`**

```css
:root {
  --navy-900: #071633;
  --navy-800: #0b2149;
  --navy-700: #123067;
  --navy-600: #1c4180;
  --navy-100: #e8edf6;
  --accent: #5aa9e6;
  --bg: #f5f7fb;
  --surface: #ffffff;
  --text: #101a2e;
  --text-muted: #5c6b85;
  --border: #e2e7f0;
  --radius: 14px;
  --shadow: 0 10px 30px rgba(7, 22, 51, 0.08);
  --shadow-hover: 0 16px 40px rgba(7, 22, 51, 0.16);
  --transition: 220ms ease;
}

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

body {
  font-family: "Vazirmatn", "Segoe UI", Tahoma, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
  opacity: 0;
  animation: page-fade 500ms ease forwards;
}

@keyframes page-fade {
  to { opacity: 1; }
}

a { color: inherit; text-decoration: none; }

.container {
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: 24px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--navy-900);
  color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.site-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 14px;
  gap: 16px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 1.05rem;
}

.brand img {
  height: 42px;
  width: 42px;
  object-fit: contain;
  animation: logo-float 4s ease-in-out infinite;
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.main-nav a {
  position: relative;
  font-size: 0.95rem;
  opacity: 0.9;
  padding-block: 4px;
}

.main-nav a::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  bottom: -2px;
  height: 2px;
  width: 0;
  background: var(--accent);
  transition: width var(--transition);
}

.main-nav a:hover::after,
.main-nav a.active::after {
  width: 100%;
}

.lang-toggle {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  border-radius: 999px;
  padding: 6px 16px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform var(--transition), background var(--transition);
}

.lang-toggle:hover { background: rgba(255, 255, 255, 0.12); }
.lang-toggle:active { transform: scale(0.94); }

.hero {
  background: linear-gradient(135deg, var(--navy-900), var(--navy-700));
  color: #fff;
  padding-block: 72px;
  text-align: center;
  overflow: hidden;
}

.hero img.hero-logo {
  height: 110px;
  margin-bottom: 24px;
  animation: logo-float 5s ease-in-out infinite;
}

.hero h1 {
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  margin: 0 0 12px;
}

.hero p {
  color: rgba(255, 255, 255, 0.8);
  max-width: 620px;
  margin-inline: auto;
  font-size: 1.05rem;
}

.section {
  padding-block: 56px;
}

.section h2 {
  font-size: 1.5rem;
  margin-bottom: 28px;
  color: var(--navy-800);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.course-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition);
  display: block;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}

.course-card .badge {
  display: inline-block;
  background: var(--navy-100);
  color: var(--navy-700);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.course-card h3 {
  margin: 0 0 8px;
  color: var(--navy-900);
}

.course-card p {
  color: var(--text-muted);
  font-size: 0.92rem;
  margin: 0;
}

.course-header {
  padding-block: 48px 8px;
}

.course-header h1 {
  color: var(--navy-900);
  margin-bottom: 6px;
}

.player-wrap {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 760px) {
  .player-wrap { grid-template-columns: 1fr; }
}

video#player {
  width: 100%;
  border-radius: var(--radius);
  background: #000;
  box-shadow: var(--shadow);
}

.download-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--navy-700);
  font-weight: 600;
  font-size: 0.9rem;
}

.session-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.session-list li button {
  width: 100%;
  text-align: start;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color var(--transition), background var(--transition);
}

.session-list li button:hover {
  border-color: var(--accent);
}

.session-list li button.active {
  background: var(--navy-900);
  color: #fff;
  border-color: var(--navy-900);
}

.resource-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.resource-list li a {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 0.92rem;
  transition: transform var(--transition), border-color var(--transition);
}

.resource-list li a:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}

.placeholder {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-style: italic;
}

.site-footer {
  background: var(--navy-900);
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  padding-block: 28px;
  margin-top: 64px;
  font-size: 0.85rem;
}
```

- [ ] **Step 4: Write `courses/index.json`**

```json
[
  {
    "id": "Algo",
    "title_fa": "طراحی الگوریتم‌ها",
    "title_en": "Algorithm Design",
    "desc_fa": "ویدیوها، جزوات، تمارین و کدهای درس طراحی الگوریتم‌ها",
    "desc_en": "Videos, notes, exercises, and code for Algorithm Design"
  },
  {
    "id": "CI",
    "title_fa": "هوش محاسباتی",
    "title_en": "Computational Intelligence",
    "desc_fa": "ویدیوها، جزوات، تمارین و کدهای درس هوش محاسباتی",
    "desc_en": "Videos, notes, exercises, and code for Computational Intelligence"
  },
  {
    "id": "DS",
    "title_fa": "ساختمان داده‌ها",
    "title_en": "Data Structures",
    "desc_fa": "ویدیوها، جزوات، تمارین و کدهای درس ساختمان داده‌ها",
    "desc_en": "Videos, notes, exercises, and code for Data Structures"
  }
]
```

- [ ] **Step 5: Validate the JSON**

Run: `python3 -m json.tool courses/index.json`
Expected: pretty-printed JSON, no error.

- [ ] **Step 6: Commit**

```bash
git add assets/img/logo.png assets/css/style.css courses/index.json
git commit -m "Add design system, logo, and course index"
```

---

### Task 2: Shared behavior — language toggle, scroll-reveal, homepage course grid

**Files:**
- Create: `assets/js/main.js`

**Interfaces:**
- Consumes: `courses/index.json` (Task 1), `.reveal`/`.course-card`/`.badge` CSS classes (Task 1).
- Produces: global `langchange` document event with `event.detail.lang` (`"fa"|"en"`), consumed by `course.js` in Task 4. Reads/writes `localStorage["ece-docs-lang"]`.

- [ ] **Step 1: Write `assets/js/main.js`**

```javascript
(function () {
  var STORAGE_KEY = "ece-docs-lang";

  function currentLang() {
    return localStorage.getItem(STORAGE_KEY) || "fa";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    document.querySelectorAll("[data-fa][data-en]").forEach(function (el) {
      el.textContent = lang === "fa" ? el.dataset.fa : el.dataset.en;
    });

    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.textContent = lang === "fa" ? "EN" : "فا";
    });

    localStorage.setItem(STORAGE_KEY, lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function initLangToggle() {
    applyLang(currentLang());
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(currentLang() === "fa" ? "en" : "fa");
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  function initCourseGrid() {
    var grid = document.getElementById("course-grid");
    if (!grid) return;
    fetch("courses/index.json")
      .then(function (res) { return res.json(); })
      .then(function (courses) {
        grid.innerHTML = "";
        courses.forEach(function (course) {
          var a = document.createElement("a");
          a.className = "course-card reveal";
          a.href = "courses/" + course.id + "/index.html";

          var badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = course.id.toUpperCase();

          var h3 = document.createElement("h3");
          h3.dataset.fa = course.title_fa;
          h3.dataset.en = course.title_en;

          var p = document.createElement("p");
          p.dataset.fa = course.desc_fa;
          p.dataset.en = course.desc_en;

          a.appendChild(badge);
          a.appendChild(h3);
          a.appendChild(p);
          grid.appendChild(a);
        });
        applyLang(currentLang());
        initReveal();
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangToggle();
    initReveal();
    initCourseGrid();
  });
})();
```

- [ ] **Step 2: Check the file for syntax errors**

Run: `node --check assets/js/main.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "Add language toggle, scroll-reveal, and course grid loader"
```

---

### Task 3: Homepage

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `assets/css/style.css` (Task 1), `assets/js/main.js` (Task 2) — expects an element `#course-grid` to exist for `initCourseGrid()` to populate.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<script>
(function () {
  var lang = localStorage.getItem("ece-docs-lang") || "fa";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
})();
</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title data-fa="مستندات مهندسی کامپیوتر هرمزگان" data-en="Hormozgan ECE Docs">مستندات مهندسی کامپیوتر هرمزگان</title>
<link rel="icon" href="assets/img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html">
      <img src="assets/img/logo.png" alt="Hormozgan University logo">
      <span data-fa="دانشکده مهندسی کامپیوتر" data-en="Faculty of Computer Engineering">دانشکده مهندسی کامپیوتر</span>
    </a>
    <nav class="main-nav">
      <a href="index.html" class="active" data-fa="خانه" data-en="Home">خانه</a>
      <a href="#courses" data-fa="دروس" data-en="Courses">دروس</a>
    </nav>
    <button class="lang-toggle" type="button">EN</button>
  </div>
</header>

<section class="hero">
  <div class="container">
    <img class="hero-logo" src="assets/img/logo.png" alt="University of Hormozgan">
    <h1 data-fa="مستندات دروس مهندسی کامپیوتر" data-en="Computer Engineering Course Docs">مستندات دروس مهندسی کامپیوتر</h1>
    <p data-fa="آرشیو ویدیوها، جزوات، تمارین و کدهای دروس دانشکده مهندسی کامپیوتر دانشگاه هرمزگان" data-en="An archive of videos, notes, exercises, and code for the Faculty of Computer Engineering, University of Hormozgan">آرشیو ویدیوها، جزوات، تمارین و کدهای دروس دانشکده مهندسی کامپیوتر دانشگاه هرمزگان</p>
  </div>
</section>

<main class="container">
  <section id="courses" class="section">
    <h2 data-fa="دروس" data-en="Courses">دروس</h2>
    <div id="course-grid" class="course-grid"></div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <span data-fa="دانشگاه هرمزگان — دانشکده مهندسی کامپیوتر" data-en="University of Hormozgan — Faculty of Computer Engineering">دانشگاه هرمزگان — دانشکده مهندسی کامپیوتر</span>
  </div>
</footer>

<script src="assets/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Serve locally and verify**

Run:
```bash
cd /Users/mac/Desktop/folder/uni/ece-docs
python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/index.html | grep -o 'id="course-grid"'
kill %1
```
Expected: prints `id="course-grid"`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add homepage"
```

---

### Task 4: Course template + course.js (built and verified against DS)

**Files:**
- Create: `assets/js/course.js`
- Create: `courses/DS/index.html`
- Create: `courses/DS/data.json`

**Interfaces:**
- Consumes: `./data.json` relative to the course page; `langchange` event from `main.js` (Task 2).
- Produces: none consumed elsewhere (leaf feature).

- [ ] **Step 1: Write `assets/js/course.js`**

```javascript
(function () {
  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "fa";
  }

  function text(item, lang) {
    return lang === "fa" ? item.title_fa : item.title_en;
  }

  function renderResourceList(container, items, lang) {
    container.innerHTML = "";
    if (!items || items.length === 0) {
      var p = document.createElement("p");
      p.className = "placeholder";
      p.textContent = lang === "fa" ? "به‌زودی" : "Coming soon";
      container.appendChild(p);
      return;
    }
    var ul = document.createElement("ul");
    ul.className = "resource-list";
    items.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = text(item, lang);
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function renderVideos(data, lang) {
    var wrap = document.getElementById("video-section-body");
    wrap.innerHTML = "";

    if (!data.videos || data.videos.length === 0) {
      var p = document.createElement("p");
      p.className = "placeholder";
      p.textContent = lang === "fa" ? "به‌زودی" : "Coming soon";
      wrap.appendChild(p);
      return;
    }

    var playerWrap = document.createElement("div");
    playerWrap.className = "player-wrap";

    var left = document.createElement("div");
    var player = document.createElement("video");
    player.id = "player";
    player.controls = true;
    player.src = data.videos[0].src;

    var download = document.createElement("a");
    download.className = "download-link";
    download.href = data.videos[0].src;
    download.setAttribute("download", "");
    download.textContent = lang === "fa" ? "دانلود ویدیو" : "Download video";

    left.appendChild(player);
    left.appendChild(download);

    var right = document.createElement("ul");
    right.className = "session-list";

    data.videos.forEach(function (video, index) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text(video, lang);
      if (index === 0) btn.classList.add("active");
      btn.addEventListener("click", function () {
        player.src = video.src;
        player.play();
        download.href = video.src;
        right.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
      });
      li.appendChild(btn);
      right.appendChild(li);
    });

    playerWrap.appendChild(left);
    playerWrap.appendChild(right);
    wrap.appendChild(playerWrap);
  }

  function renderAll(data) {
    var lang = currentLang();
    renderVideos(data, lang);
    renderResourceList(document.getElementById("notes-section-body"), data.notes, lang);
    renderResourceList(document.getElementById("exercises-section-body"), data.exercises, lang);
    renderResourceList(document.getElementById("code-section-body"), data.code, lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("./data.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        window.__courseData = data;
        renderAll(data);
      })
      .catch(function () {
        renderAll({ videos: [], notes: [], exercises: [], code: [] });
      });
  });

  document.addEventListener("langchange", function () {
    if (window.__courseData) renderAll(window.__courseData);
  });
})();
```

- [ ] **Step 2: Check the file for syntax errors**

Run: `node --check assets/js/course.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Write `courses/DS/data.json`**

```json
{
  "videos": [],
  "notes": [],
  "exercises": [],
  "code": []
}
```

- [ ] **Step 4: Write `courses/DS/index.html`**

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<script>
(function () {
  var lang = localStorage.getItem("ece-docs-lang") || "fa";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
})();
</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title data-fa="ساختمان داده‌ها | مستندات مهندسی کامپیوتر هرمزگان" data-en="Data Structures | Hormozgan ECE Docs">ساختمان داده‌ها</title>
<link rel="icon" href="../../assets/img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
<header class="site-header">
  <div class="container">
    <a class="brand" href="../../index.html">
      <img src="../../assets/img/logo.png" alt="Hormozgan University logo">
      <span data-fa="دانشکده مهندسی کامپیوتر" data-en="Faculty of Computer Engineering">دانشکده مهندسی کامپیوتر</span>
    </a>
    <nav class="main-nav">
      <a href="../../index.html" data-fa="خانه" data-en="Home">خانه</a>
      <a href="../../index.html#courses" data-fa="دروس" data-en="Courses">دروس</a>
    </nav>
    <button class="lang-toggle" type="button">EN</button>
  </div>
</header>

<section class="course-header container">
  <h1 data-fa="ساختمان داده‌ها" data-en="Data Structures">ساختمان داده‌ها</h1>
</section>

<main class="container">
  <section class="section reveal">
    <h2 data-fa="ویدیوها" data-en="Videos">ویدیوها</h2>
    <div id="video-section-body"></div>
  </section>

  <section class="section reveal">
    <h2 data-fa="جزوه و کتاب" data-en="Notes &amp; Books">جزوه و کتاب</h2>
    <div id="notes-section-body"></div>
  </section>

  <section class="section reveal">
    <h2 data-fa="تمارین" data-en="Exercises">تمارین</h2>
    <div id="exercises-section-body"></div>
  </section>

  <section class="section reveal">
    <h2 data-fa="کدها" data-en="Code">کدها</h2>
    <div id="code-section-body"></div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <span data-fa="دانشگاه هرمزگان — دانشکده مهندسی کامپیوتر" data-en="University of Hormozgan — Faculty of Computer Engineering">دانشگاه هرمزگان — دانشکده مهندسی کامپیوتر</span>
  </div>
</footer>

<script src="../../assets/js/main.js" defer></script>
<script src="../../assets/js/course.js" defer></script>
</body>
</html>
```

- [ ] **Step 5: Serve locally and verify the empty-state placeholder renders**

Run:
```bash
cd /Users/mac/Desktop/folder/uni/ece-docs
python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/courses/DS/index.html | grep -o 'id="video-section-body"'
kill %1
```
Expected: prints `id="video-section-body"` (confirms the page and relative paths are wired; the placeholder text itself is injected by JS at runtime, verified visually in Task 6).

- [ ] **Step 6: Commit**

```bash
git add assets/js/course.js courses/DS
git commit -m "Add course page template and rendering logic (DS course)"
```

---

### Task 5: Remaining courses (Algo, CI)

**Files:**
- Create: `courses/Algo/index.html`, `courses/Algo/data.json`
- Create: `courses/CI/index.html`, `courses/CI/data.json`

**Interfaces:**
- Consumes: same as Task 4 (`course.js`, `style.css`, `main.js`); each course's `index.html` is the DS template from Task 4 with the title/heading swapped and no other structural changes.

- [ ] **Step 1: Write `courses/Algo/data.json`**

```json
{
  "videos": [],
  "notes": [],
  "exercises": [],
  "code": []
}
```

- [ ] **Step 2: Write `courses/Algo/index.html`**

Copy `courses/DS/index.html` verbatim, then apply exactly these replacements:
- `data-fa="ساختمان داده‌ها | مستندات مهندسی کامپیوتر هرمزگان" data-en="Data Structures | Hormozgan ECE Docs"` → `data-fa="طراحی الگوریتم‌ها | مستندات مهندسی کامپیوتر هرمزگان" data-en="Algorithm Design | Hormozgan ECE Docs"`
- `>ساختمان داده‌ها</title>` → `>طراحی الگوریتم‌ها</title>`
- `data-fa="ساختمان داده‌ها" data-en="Data Structures">ساختمان داده‌ها</h1>` → `data-fa="طراحی الگوریتم‌ها" data-en="Algorithm Design">طراحی الگوریتم‌ها</h1>`

- [ ] **Step 3: Write `courses/CI/data.json`**

```json
{
  "videos": [],
  "notes": [],
  "exercises": [],
  "code": []
}
```

- [ ] **Step 4: Write `courses/CI/index.html`**

Copy `courses/DS/index.html` verbatim, then apply exactly these replacements:
- `data-fa="ساختمان داده‌ها | مستندات مهندسی کامپیوتر هرمزگان" data-en="Data Structures | Hormozgan ECE Docs"` → `data-fa="هوش محاسباتی | مستندات مهندسی کامپیوتر هرمزگان" data-en="Computational Intelligence | Hormozgan ECE Docs"`
- `>ساختمان داده‌ها</title>` → `>هوش محاسباتی</title>`
- `data-fa="ساختمان داده‌ها" data-en="Data Structures">ساختمان داده‌ها</h1>` → `data-fa="هوش محاسباتی" data-en="Computational Intelligence">هوش محاسباتی</h1>`

- [ ] **Step 5: Validate both JSON files**

Run: `python3 -m json.tool courses/Algo/data.json && python3 -m json.tool courses/CI/data.json`
Expected: both pretty-print with no error.

- [ ] **Step 6: Commit**

```bash
git add courses/Algo courses/CI
git commit -m "Add Algo and CI course pages"
```

---

### Task 6: README, full local verification

**Files:**
- Modify: `README.md`

**Interfaces:** none (final integration task).

- [ ] **Step 1: Rewrite `README.md`**

```markdown
# ece.hormozgan.github.io

سایت مستندات دانشکده مهندسی کامپیوتر دانشگاه هرمزگان.

## افزودن محتوای یک درس

هر درس یک پوشه در `courses/<نام‌درس>/` دارد که شامل `index.html` و `data.json` است. برای افزودن محتوا فقط `data.json` را ویرایش کنید:

```json
{
  "videos": [{ "title_fa": "جلسه ۱", "title_en": "Session 1", "src": "videos/session1.mp4" }],
  "notes": [{ "title_fa": "جزوه فصل ۱", "title_en": "Chapter 1 notes", "href": "notes/ch1.pdf" }],
  "exercises": [{ "title_fa": "تمرین ۱", "title_en": "Exercise 1", "href": "exercises/hw1.pdf" }],
  "code": [{ "title_fa": "کد جلسه ۱", "title_en": "Session 1 code", "href": "https://github.com/..." }]
}
```

## افزودن یک درس جدید

1. پوشه‌ای مثل `courses/NEW/` بسازید و `index.html` یکی از دروس موجود را در آن کپی کنید (فقط عنوان‌ها را عوض کنید).
2. یک `data.json` خالی مثل بقیه دروس در همان پوشه بسازید.
3. یک رکورد جدید به `courses/index.json` اضافه کنید.
```

- [ ] **Step 2: Full local verification pass**

Run:
```bash
cd /Users/mac/Desktop/folder/uni/ece-docs
python3 -m http.server 8000 &
sleep 1
for p in index.html courses/DS/index.html courses/Algo/index.html courses/CI/index.html; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/$p)
  echo "$p -> $code"
done
kill %1
```
Expected: all four paths return `200`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Document content-editing workflow in README"
```
