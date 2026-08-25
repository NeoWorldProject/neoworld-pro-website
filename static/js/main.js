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

  var syntheticDemo = document.querySelector("[data-synthetic-demo]");
  if (syntheticDemo) {
    var syntheticPlayer = syntheticDemo.querySelector("[data-synthetic-player]");
    var syntheticInputs = Array.prototype.slice.call(
      syntheticDemo.querySelectorAll("[data-synthetic-input]")
    );

    var selectSyntheticInput = function (selectedInput) {
      syntheticInputs.forEach(function (input) {
        var isSelected = input === selectedInput;
        input.classList.toggle("is-active", isSelected);
        input.setAttribute("aria-pressed", String(isSelected));
      });

      var videoSource = selectedInput.getAttribute("data-video-src");
      if (!syntheticPlayer || !videoSource) {
        return;
      }

      syntheticPlayer.pause();
      if (syntheticPlayer.getAttribute("src") !== videoSource) {
        syntheticPlayer.setAttribute("src", videoSource);
        syntheticPlayer.load();
      } else {
        syntheticPlayer.currentTime = 0;
      }

      syntheticPlayer.muted = true;
      var playback = syntheticPlayer.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {});
      }
    };

    syntheticInputs.forEach(function (input) {
      input.addEventListener("click", function () {
        selectSyntheticInput(input);
      });
    });
  }

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
