const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

// set up
app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// home page
app.get("/", (req, res) => {
  const tabs = JSON.parse(fs.readFileSync("./data/tabs.json"));
  res.render("index", { totalTabs: tabs.length, page: "home" });
});

// submit page
app.get("/submit", (req, res) => {
  res.render("submit", { page: "submit" });
});

// submit tab form
app.post("/submit", (req, res) => {
  const tabs = JSON.parse(fs.readFileSync("./data/tabs.json"));

  // create new tab
  const newTab = {
    url: req.body.url,
    description: req.body.description,
    submittedBy: req.body.name || "Anonymous",
    timestamp: new Date(),
    reactions: { clap: 0, heart: 0, fire: 0, idea: 0, laugh: 0 },
  };

  tabs.push(newTab);
  fs.writeFileSync("./data/tabs.json", JSON.stringify(tabs, null, 2));

  res.redirect("/archive");
});

// archive page
app.get("/archive", (req, res) => {
  const tabs = JSON.parse(fs.readFileSync("./data/tabs.json"));

  // recent submissions first
  const sortedTabs = [...tabs].reverse();

  res.render("archive", { tabs: sortedTabs, page: "archive" });
});

// save points
app.post("/savePoints", (req, res) => {
  const { userID, points } = req.body;
  if (!userID) return res.status(400).json({ success: false });

  let users = [];
  if (fs.existsSync("./data/users.json")) {
    users = JSON.parse(fs.readFileSync("./data/users.json"));
  }

  // update if existing, if not make new
  const existing = users.find((u) => u.userID === userID);
  if (existing) {
    existing.points = points;
  } else {
    users.push({ userID, points });
  }

  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// leaderboard
app.get("/leaderboard", (req, res) => {
  let users = [];
  if (fs.existsSync("./data/users.json")) {
    users = JSON.parse(fs.readFileSync("./data/users.json"));
  }

// titles
  function getTitle(points) {
    if (points >= 2000) return "Society Elder";
    if (points >= 1000) return "Keeper of Tabs";
    if (points >= 500) return "Senior Curator";
    if (points >= 100) return "Active Archivist";
    if (points >= 50) return "Tab Contributor";
    return "New Member";
  }

  const leaderboard = users
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({
      rank: i + 1,
      userID: u.userID,
      points: u.points,
      title: getTitle(u.points),
    }));

  res.render("leaderboard", { leaderboard, page: "leaderboard" });
});

// reactions
app.post("/react/:index/:type", (req, res) => {
  const tabs = JSON.parse(fs.readFileSync("./data/tabs.json"));
  const index = parseInt(req.params.index);
  const type = req.params.type;

  if (!tabs[index]) return res.status(404).json({ success: false });

  tabs[index].reactions[type] = (tabs[index].reactions[type] || 0) + 1;

  fs.writeFileSync("./data/tabs.json", JSON.stringify(tabs, null, 2));
  res.json({ success: true, newCount: tabs[index].reactions[type] });
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`running at http://localhost:${PORT}`)
);