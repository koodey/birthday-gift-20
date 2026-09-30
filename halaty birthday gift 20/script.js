/* ==========================================
   هدية عيد ميلاد — الكود الرئيسي
   لا تحتاج لتعديل هذا الملف. المحتوى كله في content.js
   ========================================== */

(function () {
  "use strict";

  var C = typeof birthdayContent !== "undefined" ? birthdayContent : {};
  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var L = C.labels || {};
  function format(value, fields) {
    return String(value || "").replace(/\{(\w+)\}/g, function (_, key) { return fields[key] == null ? "" : fields[key]; });
  }

  /* كل الكلام المرئي، بما فيه التسميات المساعدة، مأخوذ من content.js */
  function applyLabels() {
    document.querySelector('meta[name="description"]').content = L.pageDescription || "";
    document.querySelectorAll(".scene").forEach(function (scene) {
      scene.dataset.title = (C.sceneNames || {})[scene.id] || "";
      scene.querySelectorAll("[data-next]").forEach(function (button) {
        button.textContent = scene.id === "scene-2" ? L.nextFirst : L.next;
      });
      scene.querySelectorAll("[data-prev]").forEach(function (button) {
        button.setAttribute("aria-label", L.back || "");
        button.title = L.back || "";
      });
    });
    document.querySelector("#scene-4 .hint").textContent = L.reasonsHint || "";
    $("introImage").alt = L.introImageAlt || "";
    document.querySelector(".map").setAttribute("aria-label", L.mapAlt || "");
    document.querySelectorAll(".country-name")[0].textContent = L.countryMine || "";
    document.querySelectorAll(".country-name")[1].textContent = L.countryHers || "";
    $("wishesStage").setAttribute("aria-label", L.wishesStage || "");
    $("restartBtn").textContent = L.restart || "";
    $("secretBtn").setAttribute("aria-label", L.secretButtonAlt || "");
    $("secretBtn").title = L.secretButtonTitle || "";
    document.querySelector(".peek-bubble").textContent = L.secretBubble || "";
    $("secretLock").querySelector("h3").textContent = L.secretLockTitle || "";
    $("secretLock").querySelector(".body-text").textContent = L.secretLockMessage || "";
    $("secretInput").placeholder = L.secretPasswordPlaceholder || "";
    $("secretSubmit").textContent = L.secretSubmit || "";
    $("secretRoom").querySelector("h3").textContent = L.secretRoomTitle || "";
    $("secretMissing").textContent = L.secretMissing || "";
    if (!(C.secret || {}).youtube) $("secretVideo").src = (C.secret || {}).video || "";
    ["secretClose", "secretRoomClose"].forEach(function (id) {
      $(id).setAttribute("aria-label", L.close || "");
      $(id).title = L.close || "";
    });
    $("musicToggle").textContent = L.musicPlay || "";
    $("muteToggle").textContent = L.musicMute || "";
    $("voicePlay").setAttribute("aria-label", L.voicePlay || "");
  }

  function setupBackground() {
    var sources = Array.isArray(C.backgroundPhotos) ? C.backgroundPhotos.filter(Boolean) : [];
    if (!sources.length) return;
    var loaded = [], completed = 0, previous = -1, active = 0;
    var layers = [$("backgroundLayerA"), $("backgroundLayerB")];
    function choose() {
      var options = loaded.filter(function (item) { return item.index !== previous; });
      return options[Math.floor(Math.random() * options.length)] || loaded[0];
    }
    function show(first) {
      if (!loaded.length) return;
      var choice = choose();
      previous = choice.index;
      var next = first ? active : 1 - active;
      layers[next].style.backgroundImage = 'url("' + choice.src.replace(/"/g, "%22") + '")';
      // الصورة الجديدة فوق القديمة: لا تظهر الخلفية الوردية بينهما أثناء التلاشي.
      layers[next].style.zIndex = "1";
      layers[active].style.zIndex = first ? "1" : "0";
      layers[next].classList.add("visible");
      if (!first) {
        var outgoing = layers[active];
        setTimeout(function () { outgoing.classList.remove("visible"); }, 2300);
      }
      active = next;
    }
    function ready() {
      completed++;
      if (completed !== sources.length) return;
      if (!loaded.length) return;
      show(true);
      if (loaded.length > 1 && !reduceMotion) {
        setInterval(function () { show(false); }, Math.max(4, Number(C.backgroundChangeSeconds) || 8) * 1000);
      }
    }
    sources.forEach(function (src, index) {
      var image = new Image();
      image.onload = function () {
        loaded.push({ src: src, index: index });
        ready();
      };
      image.onerror = ready;
      image.src = src;
    });
  }

  /* ---------- أدوات مساعدة ---------- */
  function text(id, value) {
    var el = $(id);
    if (el) el.textContent = value || "";
  }

  function placeholder(frame, label) {
    if (!frame || frame.querySelector(".ph-placeholder")) return;
    var d = document.createElement("div");
    d.className = "ph-placeholder";
    d.innerHTML = "<span>✦</span>" + (label || L.missingImage || "");
    frame.appendChild(d);
  }

  // تحميل صورة بأمان: إن لم توجد يظهر بديل جميل بدل صورة مكسورة
  function safeImage(img, src, frame) {
    if (!img) return;
    if (!src) { img.remove(); placeholder(frame); return; }
    img.onerror = function () { img.style.display = "none"; placeholder(frame); };
    img.src = src;
  }

  /* ---------- الأصوات ---------- */
  var sfxCache = {};
  function sfx(name) {
    if (!C.soundEffectsEnabled || !C.sounds || !C.sounds[name]) return;
    try {
      var a = sfxCache[name] || (sfxCache[name] = new Audio(C.sounds[name]));
      a.currentTime = 0;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* الملف غير موجود — نتجاهل بهدوء */ }
  }

  /* ---------- الخلفية: نجوم وجزيئات ---------- */
  function buildSky() {
    if (reduceMotion) return;
    var stars = $("stars");
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 70; i++) {
      var s = document.createElement("i");
      s.className = "star";
      s.style.top = Math.random() * 100 + "%";
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 4 + "s";
      frag.appendChild(s);
    }
    if (stars) stars.appendChild(frag);

    var parts = $("particles");
    var frag2 = document.createDocumentFragment();
    for (var j = 0; j < 22; j++) {
      var p = document.createElement("i");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 14 + Math.random() * 16 + "s";
      p.style.animationDelay = Math.random() * 18 + "s";
      frag2.appendChild(p);
    }
    if (parts) parts.appendChild(frag2);
  }

  /* ---------- الموسيقى ---------- */
  var music = $("bgMusic");
  var musicOk = false;

  function setupMusic() {
    if (!C.music || !C.music.enabled || !C.music.src || !music) return;
    music.src = C.music.src;
    music.volume = 0.45;
    musicOk = true;
    // إذا كان ملف الموسيقى ناقصاً نخفي أزرار التحكم بهدوء
    music.addEventListener("error", function () {
      musicOk = false;
      var mc = document.getElementById("musicControl");
      if (mc) mc.hidden = true;
    });
  }

  function startMusic() {
    if (!musicOk) return;
    var p = music.play();
    if (p && p.catch) p.catch(function () {});
    $("musicControl").hidden = false;
    $("musicToggle").textContent = L.musicPause || "";
  }

  function bindMusicControls() {
    var toggle = $("musicToggle");
    var mute = $("muteToggle");
    toggle.addEventListener("click", function () {
      if (!musicOk) return;
      if (music.paused) {
        var p = music.play();
        if (p && p.catch) p.catch(function () {});
        toggle.textContent = L.musicPause || "";
      } else {
        music.pause();
        toggle.textContent = L.musicPlay || "";
      }
    });
    mute.addEventListener("click", function () {
      music.muted = !music.muted;
      mute.textContent = music.muted ? L.musicUnmute : L.musicMute;
    });
  }

  /* ---------- المشاهد والتنقل ---------- */
  var scenes = [];
  var current = 0;

  function buildProgress() {
    var bar = $("progress");
    bar.innerHTML = "";
    scenes.forEach(function () { bar.appendChild(document.createElement("i")); });
  }

  function syncProgress() {
    var dots = $("progress").children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("on", i === current);
    }
  }

  function goTo(index) {
    if (index < 0 || index >= scenes.length) return;
    if (scenes[current].id === "scene-8") $("voiceAudio").pause();
    scenes[current].classList.remove("active");
    current = index;
    var scene = scenes[current];
    scene.classList.add("active");
    if (scene.id === "scene-1") {
      $("giftbox").classList.remove("open");
      $("openGiftBtn").disabled = false;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    syncProgress();
    if (scene.id === "scene-3") revealTimeline();
  }

  function bindNav() {
    document.querySelectorAll("[data-next]").forEach(function (b) {
      b.addEventListener("click", function () { sfx("click"); goTo(current + 1); });
    });
    document.querySelectorAll("[data-prev]").forEach(function (b) {
      b.addEventListener("click", function () { sfx("click"); goTo(current - 1); });
    });
    $("restartBtn").addEventListener("click", function () {
      sfx("click");
      window.location.reload();
    });
    bindSecret();
    bindRating();
  }

  /* ---------- تقييم حلا (محفوظ بالمتصفح، ما بيتغير بعد الحفظ) ---------- */
  function bindRating() {
    var R = C.rating || {};
    var box = $("ratingBox");
    if (!box || R.enabled === false) { if (box) box.hidden = true; return; }
    var KEY = "birthday-gift-rating-v1";
    var faces = R.faces || ["🥲", "🙂", "😊", "😍", "🥹❤️"];
    var chosen = 0;
    $("ratingTitle").textContent = format(R.title || "", {});
    $("ratingQuestion").textContent = R.question || "";
    $("ratingComment").placeholder = R.commentPlaceholder || "";
    $("ratingSubmit").textContent = R.submit || "";
    var stars = $("ratingStars"), face = $("ratingFace"), label = $("ratingLabel");
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "rate-heart"; b.textContent = "♥";
      b.setAttribute("aria-label", n + " / 5");
      b.addEventListener("click", function () { chosen = n; sfx("click"); paint(n); });
      b.addEventListener("mouseenter", function () { paint(n); });
      b.addEventListener("mouseleave", function () { paint(chosen); });
      stars.appendChild(b);
    })(i);
    function paint(n) {
      Array.prototype.forEach.call(stars.children, function (b, i) { b.classList.toggle("on", i < n); });
      face.textContent = n ? faces[n - 1] : "🤔";
      label.textContent = n ? ((R.levels || [])[n - 1] || "") : "";
      $("ratingSubmit").disabled = !chosen;
    }
    function showSaved(d) {
      $("ratingForm").hidden = true;
      var s = $("ratingSaved"); s.hidden = false;
      $("ratingSavedHearts").textContent = "❤️".repeat(d.score) + "🤍".repeat(5 - d.score);
      $("ratingSavedText").textContent = R.savedMessage || "";
      $("ratingSavedComment").textContent = d.comment ? "«" + d.comment + "»" : "";
      $("ratingSavedDate").textContent = (R.savedOn || "") + " " + new Date(d.date).toLocaleDateString("ar");
    }
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (saved && saved.score) { showSaved(saved); return; }
    paint(0);
    $("ratingSubmit").addEventListener("click", function () {
      if (!chosen) return;
      var d = { score: chosen, comment: $("ratingComment").value.trim().slice(0, 300), date: Date.now() };
      try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
      confetti();
      showSaved(d);
    });
  }


  /* ---------- الزر السري ---------- */
  function bindSecret() {
    var PASS = (C.secret || {}).password || "";
    var tries = 0;
    var lock = $("secretLock"), room = $("secretRoom"), input = $("secretInput"), hint = $("secretHint");
    var video = $("secretVideo");
    $("secretBtn").addEventListener("click", function () {
      sfx("click"); tries = 0; hint.textContent = ""; input.value = "";
      lock.hidden = false; setTimeout(function () { input.focus(); }, 50);
    });
    function close() { lock.hidden = true; }
    $("secretClose").addEventListener("click", close);
    function ytId(url) {
      var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
      return m ? m[1] : "";
    }
    var YT = ytId((C.secret || {}).youtube);
    function openRoom() {
      if (!YT) return;
      video.hidden = true; $("secretMissing").hidden = true;
      var f = document.createElement("iframe");
      f.className = "secret-yt";
      f.src = "https://www.youtube-nocookie.com/embed/" + YT + "?autoplay=1&rel=0&playsinline=1";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      video.parentNode.insertBefore(f, video);
    }
    function submit() {
      if (input.value.trim() === PASS) {
        lock.hidden = true; room.hidden = false;
        var bg = $("bgMusic"); if (bg && !bg.paused) bg.pause();
        openRoom();
        return;
      }
      tries++;
      input.value = "";
      var card = lock.querySelector(".secret-card");
      card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
      hint.textContent = tries === 1
        ? L.secretHintFirst : L.secretHintAgain;
    }
    $("secretSubmit").addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    video.addEventListener("error", function () { if (YT) return; video.hidden = true; $("secretMissing").hidden = false; });
    $("secretRoomClose").addEventListener("click", function () {
      video.pause(); room.hidden = true;
      var f = room.querySelector(".secret-yt"); if (f) f.remove();
    });
  }

  /* ---------- المشهد 1 و 2 ---------- */
  function buildOpening() {
    text("openingTitle", C.openingTitle);
    text("openingMessage", C.openingMessage);
    $("openGiftBtn").textContent = C.openingButton || "";
    $("openGiftBtn").addEventListener("click", function () {
      if (this.disabled) return;
      this.disabled = true;
      sfx("giftOpen");
      startMusic();
      $("giftbox").classList.add("open");
      confetti();
      setTimeout(function () { goTo(1); }, reduceMotion ? 100 : 1050);
    });
  }

  function typewriter(el, str) {
    if (!el) return;
    if (reduceMotion) { el.textContent = str; return; }
    el.textContent = "";
    var i = 0;
    (function tick() {
      el.textContent = str.slice(0, i++);
      if (i <= str.length) setTimeout(tick, 32);
    })();
  }

  function buildBirthday() {
    text("birthdayTitle", format(L.birthdayTitle, { name: C.herName }));
    safeImage($("introImage"), C.introImage, document.querySelector("#scene-2 .photo-frame"));
    var el = $("birthdayMessage");
    var msg = C.birthdayMessage || "";
    var started = false;
    var obs = new MutationObserver(function () {});
    obs.disconnect();
    // نبدأ الكتابة عند ظهور المشهد
    var watcher = setInterval(function () {
      if (!started && $("scene-2").classList.contains("active")) {
        started = true;
        clearInterval(watcher);
        typewriter(el, msg);
      }
    }, 200);
  }

  /* ---------- المشهد 3: القصة ---------- */
  function buildTimeline() {
    text("timelineTitle", C.timelineTitle);
    var wrap = $("timeline");
    wrap.innerHTML = "";
    (C.timeline || []).forEach(function (item) {
      var d = document.createElement("article");
      d.className = "tl-item";
      var html =
        '<div class="tl-date"></div><h3 class="tl-title"></h3><p class="tl-desc"></p>';
      d.innerHTML = html;
      d.querySelector(".tl-date").textContent = item.date || "";
      d.querySelector(".tl-title").textContent = item.title || "";
      d.querySelector(".tl-desc").textContent = item.description || "";
      if (item.image) {
        var img = document.createElement("img");
        img.className = "tl-photo";
        img.loading = "lazy";
        img.alt = item.title || L.timelineImageAlt || "";
        img.onerror = function () { img.remove(); };
        img.src = item.image;
        d.appendChild(img);
      }
      wrap.appendChild(d);
    });
  }

  function revealTimeline() {
    var items = document.querySelectorAll(".tl-item");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("reveal"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("reveal"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---------- المشهد 4: 20 سبب ---------- */
  function buildReasons() {
    text("reasonsTitle", C.reasonsTitle);
    text("reasonsEnd1", C.reasonsEndingLine1);
    text("reasonsEnd2", C.reasonsEndingLine2);
    var grid = $("reasonsGrid");
    grid.innerHTML = "";
    var list = C.reasons || [];
    var opened = 0;

    list.forEach(function (reason, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card";
      btn.setAttribute("aria-label", format(L.reasonNumber, { number: i + 1 }));
      btn.innerHTML =
        '<div class="card-in">' +
        '<div class="card-face card-front"></div>' +
        '<div class="card-face card-back"></div>' +
        "</div>";
      btn.querySelector(".card-front").textContent = String(i + 1);
      btn.querySelector(".card-back").textContent = reason;
      btn.addEventListener("click", function () {
        if (btn.classList.contains("flipped")) return;
        btn.classList.add("flipped");
        sfx("cardFlip");
        opened++;
        if (opened === list.length) {
          setTimeout(function () { $("reasonsEnding").hidden = false; }, 700);
        }
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- المشهد 5: المسافة ---------- */
  function buildDistance() {
    var d = C.distanceSection || {};
    text("distanceTitle", d.title);
    text("myLocation", d.myLocation);
    text("herLocation", d.herLocation);
    text("distanceMessage", d.message);
    text("distanceMessage2", d.message2);
  }

  /* ---------- المشهد 8: الرسالة الصوتية ---------- */
  function buildVoice() {
    var vm = C.voiceMessage || {};
    if (!vm.enabled || !vm.src) { $("scene-8").remove(); return; }
    text("voiceTitle", vm.title);
    text("voiceSubtitle", vm.subtitle);
    var audio = $("voiceAudio");
    audio.src = vm.src;
    var btn = $("voicePlay");
    var fill = $("voiceFill");
    var timeEl = $("voiceTime");

    function fmt(s) {
      if (!isFinite(s)) return "0:00";
      var m = Math.floor(s / 60);
      var r = Math.floor(s % 60);
      return m + ":" + (r < 10 ? "0" : "") + r;
    }

    btn.addEventListener("click", function () {
      if (audio.paused) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        audio.pause();
      }
    });
    audio.addEventListener("play", function () { btn.textContent = "❚❚"; btn.setAttribute("aria-label", L.voicePause || ""); });
    audio.addEventListener("pause", function () { btn.textContent = "▶"; btn.setAttribute("aria-label", L.voicePlay || ""); });
    audio.addEventListener("ended", function () { btn.textContent = "▶"; btn.setAttribute("aria-label", L.voicePlay || ""); fill.style.width = "0%"; });
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
      timeEl.textContent = fmt(audio.currentTime);
    });
    audio.addEventListener("error", function () {
      $("scene-8").querySelector(".player").style.display = "none";
    });
    $("voiceBar").addEventListener("click", function (e) {
      if (!audio.duration) return;
      var r = this.getBoundingClientRect();
      // RTL: نحسب من اليمين
      var ratio = (r.right - e.clientX) / r.width;
      audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
    });
  }

  /* ---------- المشهد: بالونات الأمنيات ---------- */
  function buildWishes() {
    var w = C.wishes || {};
    var stage = $("wishesStage");
    var list = w.list || [];
    if (!stage || !list.length) return;
    text("wishesTitle", w.title);
    text("wishesHint", w.hint || "");
    text("wishesEnd1", w.endingLine1);
    text("wishesEnd2", w.endingLine2);

    var colors = ["#f06292", "#e91e63", "#f8bbd0", "#e8c68f", "#d0407a"];
    var popped = 0;

    function updateCount() {
      text("wishesCount", format(L.wishesCount, { count: popped, total: list.length }));
    }
    updateCount();

    function spawn(i, delay) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "balloon";
      b.dataset.wish = i;
      b.setAttribute("aria-label", format(L.balloonNumber, { number: i + 1 }));
      b.style.setProperty("--x", 6 + Math.random() * 82 + "%");
      b.style.setProperty("--dur", 15 + Math.random() * 9 + "s");
      b.style.setProperty("--delay", delay + "s");
      b.style.setProperty("--sway", 14 + Math.random() * 20 + "px");
      b.style.setProperty("--hue", colors[i % colors.length]);
      b.innerHTML = '<span class="balloon-body"></span><span class="balloon-string"></span>';
      if (reduceMotion) {
        // بدون حركة: نثبّت البالونات بمكانها وبدون أنيميشن
        b.style.animation = "none";
        b.style.bottom = 24 + Math.random() * 280 + "px";
      } else {
        b.addEventListener("animationend", function () {
          // طارت البالونة — بنطلعها من جديد بنفس الأمنية
          b.remove();
          spawn(i, 0);
        });
      }
      b.addEventListener("click", function () { pop(b); });
      stage.appendChild(b);
    }

    function pop(b) {
      if (b.classList.contains("popped")) return;
      b.classList.add("popped");
      var i = +b.dataset.wish;
      var sr = stage.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      var x = br.left - sr.left + br.width / 2;
      var y = br.top - sr.top + br.height / 2;
      sfx("cardFlip");

      // شرارة الفقعة
      var burstEl = document.createElement("div");
      burstEl.className = "burst";
      burstEl.style.left = x + "px";
      burstEl.style.top = y + "px";
      burstEl.style.setProperty("--hue", b.style.getPropertyValue("--hue"));
      for (var k = 0; k < 10; k++) {
        var bit = document.createElement("i");
        var ang = (Math.PI * 2 * k) / 10 + Math.random() * 0.5;
        var dist = 26 + Math.random() * 34;
        bit.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        bit.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        burstEl.appendChild(bit);
      }
      stage.appendChild(burstEl);
      setTimeout(function () { burstEl.remove(); }, 800);

      // الأمنية بتطير من البالونة
      var note = document.createElement("div");
      note.className = "wish-note";
      note.textContent = list[i];
      note.style.left = Math.min(Math.max(x, 90), sr.width - 90) + "px";
      note.style.top = Math.max(y - 20, 12) + "px";
      stage.appendChild(note);
      setTimeout(function () { note.remove(); }, 2600);

      b.remove();
      popped++;
      updateCount();
      if (popped === list.length) {
        setTimeout(function () {
          $("wishesEnding").hidden = false;
          confetti();
        }, 800);
      }
    }

    list.forEach(function (_, i) { spawn(i, 1.2 + i * 1.6); });
  }

  /* ---------- المشهد 9: علبة الهدية ---------- */
  function confetti() {
    if (reduceMotion) return;
    var colors = ["#f06292", "#e91e63", "#f8bbd0", "#fff0f5", "#e8c68f"];
    for (var i = 0; i < 60; i++) {
      var c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 3 + Math.random() * 3 + "s";
      c.style.animationDelay = Math.random() * 1.2 + "s";
      document.body.appendChild(c);
      setTimeout(function (el) { return function () { el.remove(); }; }(c), 7000);
    }
  }

  function buildGift() {
    text("giftTeaser", C.giftTeaser);
    text("finalGreeting", format(L.finalGreeting, { greeting: C.finalGreeting, name: C.herName }));
    text("finalMessage", C.finalMessage);
    text("finalSignature", format(L.finalSignature, { signature: C.finalSignature || C.yourName }));
    text("secretInvitation", L.secretInvitation);
  }

  /* ---------- الإقلاع ---------- */
  function init() {
    document.title = format(L.pageTitle, { name: C.herName });
    applyLabels();
    setupBackground();
    buildSky();
    setupMusic();
    bindMusicControls();
    buildOpening();
    buildBirthday();
    buildTimeline();
    buildReasons();
    buildDistance();
    buildVoice();
    buildWishes();
    buildGift();
    scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
    buildProgress();
    syncProgress();
    bindNav();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
