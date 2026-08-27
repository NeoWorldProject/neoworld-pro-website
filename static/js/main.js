(function () {
  var disabledLinks = document.querySelectorAll(".placeholder-link");
  disabledLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  var anchorLinks = document.querySelectorAll('a[href^="#"]:not(.placeholder-link)');
  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      var target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var setupVideoSelector = function (demoSelector, playerSelector, inputSelector) {
    var demo = document.querySelector(demoSelector);
    if (!demo) {
      return;
    }

    var player = demo.querySelector(playerSelector);
    var inputs = Array.prototype.slice.call(demo.querySelectorAll(inputSelector));

    var selectInput = function (selectedInput) {
      inputs.forEach(function (input) {
        var isSelected = input === selectedInput;
        input.classList.toggle("is-active", isSelected);
        input.setAttribute("aria-pressed", String(isSelected));
      });

      var videoSource = selectedInput.getAttribute("data-video-src");
      if (!player || !videoSource) {
        return;
      }

      player.pause();
      if (player.getAttribute("src") !== videoSource) {
        player.setAttribute("src", videoSource);
        player.load();
      } else {
        player.currentTime = 0;
      }

      player.muted = true;
      var playback = player.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {});
      }
    };

    inputs.forEach(function (input) {
      input.addEventListener("click", function () {
        selectInput(input);
      });
    });
  };

  setupVideoSelector("[data-synthetic-demo]", "[data-synthetic-player]", "[data-synthetic-input]");
  setupVideoSelector("[data-manipulation-demo]", "[data-manipulation-player]", "[data-manipulation-input]");

  var revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
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
    { threshold: 0.16 }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
