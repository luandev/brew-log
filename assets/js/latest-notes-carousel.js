(function () {
  function initCarousel(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-notes-card]"));
    if (cards.length < 2) return;

    var index = 0;
    var countEl = root.querySelector("[data-notes-count]");
    var prevBtn = root.querySelector("[data-notes-prev]");
    var nextBtn = root.querySelector("[data-notes-next]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-notes-goto]"));

    function show(i) {
      index = Math.max(0, Math.min(cards.length - 1, i));
      cards.forEach(function (card, n) {
        var active = n === index;
        card.classList.toggle("is-active", active);
        if (active) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "hidden");
        }
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle("is-active", n === index);
      });
      if (countEl) {
        countEl.textContent = index + 1 + " / " + cards.length;
      }
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === cards.length - 1;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(parseInt(dot.getAttribute("data-notes-goto"), 10) || 0);
      });
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      }
    });

    root.setAttribute("tabindex", "0");
    show(0);
  }

  function init() {
    document.querySelectorAll("[data-notes-carousel]").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
