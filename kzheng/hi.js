(function () {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function currentFile() {
    var p = window.location.pathname.replace(/\\/g, "/");
    var parts = p.split("/").filter(Boolean);
    var last = (parts[parts.length - 1] || "").toLowerCase();
    if (!last) return "index.html";
    return last;
  }

  var here = currentFile();

  document.querySelectorAll(".top-nav a[href]").forEach(function (a) {
    var href = (a.getAttribute("href") || "").trim();
    if (!href || href === "#") return;
    var target = href.split("/").pop().split("?")[0].toLowerCase() || "index.html";
    if (target === here) {
      a.classList.add("top-nav__link--current");
      a.setAttribute("aria-current", "page");
    }
  });

  var sigLink = document.querySelector(".site-main__mark-link");
  var sigImg = sigLink && sigLink.querySelector("img.site-main__mark");
  if (!sigLink || !sigImg) return;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { willReadFrequently: true });
  var ready = false;
  var ALPHA_THRESHOLD = 28;

  function buildHitMap() {
    ready = false;
    try {
      var w = sigImg.naturalWidth;
      var h = sigImg.naturalHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(sigImg, 0, 0);
      ctx.getImageData(0, 0, 1, 1);
      ready = true;
    } catch (err) {
      ready = false;
    }
  }

  function alphaAtClient(e) {
    if (!ready) return 255;
    var rect = sigImg.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return 0;
    var x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    var y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    var ix = Math.max(0, Math.min(Math.floor(x), canvas.width - 1));
    var iy = Math.max(0, Math.min(Math.floor(y), canvas.height - 1));
    return ctx.getImageData(ix, iy, 1, 1).data[3];
  }

  function onPointerMove(e) {
    if (!ready) return;
    var a = alphaAtClient(e);
    sigLink.style.cursor = a > ALPHA_THRESHOLD ? "pointer" : "default";
  }

  function onPointerLeave() {
    sigLink.style.cursor = "";
  }

  function pointerTypeHits(e) {
    var t = e.pointerType;
    return t === "mouse" || t === "pen" || t === "touch";
  }

  function onPointerDown(e) {
    if (!ready) return;
    if (!pointerTypeHits(e)) return;
    if (alphaAtClient(e) <= ALPHA_THRESHOLD) {
      e.preventDefault();
    }
  }

  function onClick(e) {
    if (!ready) return;
    if (!pointerTypeHits(e)) return;
    if (alphaAtClient(e) <= ALPHA_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  if (sigImg.complete && sigImg.naturalWidth) {
    buildHitMap();
  }
  sigImg.addEventListener("load", buildHitMap);

  sigLink.addEventListener("pointermove", onPointerMove);
  sigLink.addEventListener("pointerleave", onPointerLeave);
  sigLink.addEventListener("pointerdown", onPointerDown, true);
  sigLink.addEventListener("click", onClick, true);
})();
