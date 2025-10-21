window.onload = function () {
  // user id and storing
  let userID = localStorage.getItem("userID");
  if (!userID) {
    // ID generator for users
    userID = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userID", userID);
  }

  let points = parseInt(localStorage.getItem("points")) || 0;
  let releases = parseInt(localStorage.getItem("releases")) || 0;

  // titles
  function getTitle(points) {
    if (points >= 2000) return "Society Elder";
    if (points >= 1000) return "Keeper of Tabs";
    if (points >= 500) return "Senior Curator";
    if (points >= 100) return "Active Archivist";
    if (points >= 50) return "Tab Contributor";
    return "New Member";
  }

  // navbar and counters
  function updateStats() {
    const pointsEl = document.getElementById("nav-points");
    const titleEl = document.getElementById("nav-title");
    const releasesEl = document.getElementById("points-display");

    if (pointsEl) pointsEl.textContent = "🔥 " + points;
    if (titleEl) titleEl.textContent = getTitle(points);
    if (releasesEl)
      releasesEl.textContent = "Your total releases: " + releases;
  }

  // save to server
  async function saveToServer() {
    try {
      await fetch("/savePoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, points }),
      });
    } catch (err) {
      console.error("Error saving points:", err);
    }
  }

  // submit form, add points
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      releases += 1;
      points += 10;
      localStorage.setItem("points", points);
      localStorage.setItem("releases", releases);
      updateStats();
      saveToServer();
    });
  }

  // reactions
  const reactButtons = document.querySelectorAll(".react-btn");
  reactButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      const index = btn.dataset.index;

      // prevent multiple reactions per post
      const reactedKey = `reacted_${btn.dataset.id}`;
      if (localStorage.getItem(reactedKey)) return;
      localStorage.setItem(reactedKey, "true");

      // add points
      points += 5;
      localStorage.setItem("points", points);
      updateStats();
      saveToServer();

      // update UI
      const countSpan = btn.nextElementSibling;
      if (countSpan) {
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
      }

      // update server reactions
      await fetch(`/react/${index}/${type}`, { method: "POST" });
    });
  });

  updateStats();
  saveToServer();
};