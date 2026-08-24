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

  var realSceneDemo = document.querySelector("[data-real-scene-demo]");
  if (realSceneDemo) {
    var realSceneInputs = Array.prototype.slice.call(
      realSceneDemo.querySelectorAll("[data-real-scene-input]")
    );
    var realSceneVideos = Array.prototype.slice.call(
      realSceneDemo.querySelectorAll("[data-real-scene-video]")
    );

    var selectRealSceneInput = function (selectedInput) {
      var targetVideoId = selectedInput.getAttribute("data-real-scene-input");

      realSceneInputs.forEach(function (input) {
        var isSelected = input === selectedInput;
        input.classList.toggle("is-active", isSelected);
        input.setAttribute("aria-pressed", String(isSelected));
      });

      realSceneVideos.forEach(function (video) {
        var isActive = video.id === targetVideoId;
        video.classList.toggle("is-active", isActive);
        video.setAttribute("aria-hidden", String(!isActive));
      });
    };

    realSceneInputs.forEach(function (input) {
      input.addEventListener("click", function () {
        selectRealSceneInput(input);
      });
    });
    if (realSceneInputs.length) {
      selectRealSceneInput(realSceneInputs[0]);
    }

    var realSceneVideosSynchronized = false;
    var startRealSceneVideosTogether = function () {
      if (realSceneVideosSynchronized || !realSceneVideos.every(function (video) {
        return video.readyState >= 2;
      })) {
        return;
      }

      realSceneVideosSynchronized = true;
      realSceneVideos.forEach(function (video) {
        video.muted = true;
        video.currentTime = 0;
      });

      window.requestAnimationFrame(function () {
        realSceneVideos.forEach(function (video) {
          var playback = video.play();
          if (playback && typeof playback.catch === "function") {
            playback.catch(function () {});
          }
        });
      });
    };

    realSceneVideos.forEach(function (video) {
      video.addEventListener("loadeddata", startRealSceneVideosTogether, { once: true });
    });
    startRealSceneVideosTogether();
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
