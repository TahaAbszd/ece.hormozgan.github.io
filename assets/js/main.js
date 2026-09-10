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
