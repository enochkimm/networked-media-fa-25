const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "public")));

// user data file
const dataFile = path.join(__dirname, "users.json");
let users = {};

if (fs.existsSync(dataFile)) {
  try {
    users = JSON.parse(fs.readFileSync(dataFile));
  } catch {
    users = {};
  }
}

// login or create account
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username]) {
    users[username] = {
      password,
      points: 0,
      upgrades: {},
      collection: {}
    };
  } else {
    if (users[username].password !== password) {
      return res.json({ error: "wrong password" });
    }
  }

  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.json(users[username]);
});

// save game state
app.post("/save", (req, res) => {
  const { username, state } = req.body;

  if (!users[username]) {
    users[username] = { password: "", points: 0, upgrades: {}, collection: {} };
  }

  users[username] = {
    ...users[username],
    ...state
  };

  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  res.json({ ok: true });
});

// run server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});