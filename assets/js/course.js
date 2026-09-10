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
