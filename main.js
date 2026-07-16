/* ============================================================
   RØBEИ — main.js
   Starfield canvas, mobile nav, scroll reveal
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- starfield ---------- */
  function initStars() {
    var canvas = document.createElement("canvas");
    canvas.id = "stars";
    document.body.prepend(canvas);
    var ctx = canvas.getContext("2d");

    var stars = [];
    var w, h, dpr;
    var pointer = { x: 0, y: 0 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function buildStars() {
      var count = Math.round((w * h) / 9000);
      count = Math.max(60, Math.min(count, 220));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.1 + 0.2,
          baseAlpha: Math.random() * 0.5 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.1,
          depth: Math.random() * 0.6 + 0.2
        });
      }
    }

    var t = 0;
    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var flicker = reduceMotion ? 1 : (Math.sin(t * s.speed + s.phase) * 0.35 + 0.65);
        var alpha = s.baseAlpha * flicker;
        var px = s.x - pointer.x * s.depth * 14;
        var py = s.y - pointer.y * s.depth * 14;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,236,246," + alpha.toFixed(3) + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", function (e) {
      pointer.x = (e.clientX / w - 0.5);
      pointer.y = (e.clientY / h - 0.5);
    }, { passive: true });

    resize();
    draw();
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector("nav.links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initStars();
    initNav();
    initReveal();
  });
})();
