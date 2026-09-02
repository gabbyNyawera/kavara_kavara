/* KAVARA KAVARA - shared behaviour */
(function () {
  "use strict";

  /* Mobile nav toggle ------------------------------------------------- */
  document.querySelectorAll("[data-nav-toggle]").forEach(function (btn) {
    var nav = btn.closest(".nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Mark current page in nav ----------------------------------------- */
  (function () {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      var target = a.getAttribute("href").split("/").pop();
      if (target === here) a.setAttribute("aria-current", "page");
    });
  })();

  /* Quote carousel ---------------------------------------------------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var slides = root.querySelectorAll(".quote");
    var dotsWrap = root.querySelector(".dots");
    if (!slides.length || !dotsWrap) return;

    var index = 0;
    var timer;

    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show quote " + (i + 1));
      b.addEventListener("click", function () {
        go(i);
        restart();
      });
      dotsWrap.appendChild(b);
    });

    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("is-active", k === index);
      });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-active", k === index);
      });
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(function () {
        go(index + 1);
      }, 7000);
    }

    go(0);
    restart();
  });

  /* Horizontal scrollers ---------------------------------------------- */
  document.querySelectorAll(".hscroll").forEach(function (root) {
    var track = root.querySelector(".hscroll__track");
    if (!track) return;
    root.querySelectorAll(".hscroll__arrow").forEach(function (arrow) {
      arrow.addEventListener("click", function () {
        var dir = arrow.dataset.dir === "prev" ? -1 : 1;
        var step = track.firstElementChild
          ? track.firstElementChild.getBoundingClientRect().width + 22
          : 300;
        track.scrollBy({ left: dir * step, behavior: "smooth" });
      });
    });
  });

  /* Reveal on scroll -------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Forms (no backend yet) -------------------------------------------- */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    var confirm = form.querySelector("[data-form-confirm]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      var original = btn.textContent;
      btn.textContent = "Sent. Thank you.";
      btn.disabled = true;
      if (confirm) confirm.textContent = "Thanks. We'll be in touch soon — like a fire, we take our time.";
      form.reset();
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 4000);
    });
  });

  /* Footer year ------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
