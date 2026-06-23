(() => {
  let player = null;
  let activeButton = null;

  const reset = () => {
    if (activeButton) {
      activeButton.classList.remove("is-playing");
      activeButton.querySelector("span").textContent = "▶";
    }
    activeButton = null;
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".line-play");
    if (!button) return;

    if (button === activeButton && player && !player.paused) {
      player.pause();
      reset();
      return;
    }

    if (player) player.pause();
    reset();
    player = new Audio(button.dataset.audio);
    activeButton = button;
    button.classList.add("is-playing");
    button.querySelector("span").textContent = "Ⅱ";
    player.addEventListener("ended", reset, { once: true });
    player.addEventListener("error", reset, { once: true });
    player.play();
  });
})();
