(function () {
  var STORAGE_KEY = "ece-docs-lang";
  var THEME_KEY = "ece-docs-theme";

  function currentLang() {
    return localStorage.getItem(STORAGE_KEY) || "fa";
  }

  function currentTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }

  function initThemeToggle() {
    applyTheme(currentTheme());
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
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
    var items = document.querySelectorAll(".reveal:not([data-reveal-ready])");
    items.forEach(function (el, index) {
      el.dataset.revealReady = "1";
      el.style.transitionDelay = (index % 6) * 70 + "ms";
    });

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

  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var scrollTop = window.scrollY;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = height > 0 ? scrollTop / height : 0;
      bar.style.width = Math.min(1, Math.max(0, ratio)) * 100 + "%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    update();
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
    initThemeToggle();
    initLangToggle();
    initReveal();
    initCourseGrid();
    initScrollProgress();
  });
})();
