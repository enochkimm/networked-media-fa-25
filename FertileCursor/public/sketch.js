// state
let currentScreen = "garden"; 
let plants = [];
let points = 0;

// major + minor upgrades
let upgrades = {
  fasterGrowth: false,
  bonusPoints: false,
  megaBloom: false,
  doubleTrail: false,
  slowDecay: false,
  autoPlanter: false,
  magnetMode: false,

  tinySeedBoost: false,
  gentleBreeze: false,
  happySoil: false,
  paleSunlight: false,
  fertileTouch: false,
  calmRoots: false,
  dewdropShine: false,
  coolMist: false,
  softWind: false,
  extraStorage: false,
  luckySeeds: false,
  busyBees: false,
  bloomEcho: false,
  miniMagnet: false,
  sproutMemory: false
};

// collection state
let collection = {};

// planting trail
let lastSpawnX = null;
let lastSpawnY = null;

// bloom particles
let bloomParticles = [];

// magnet mode
let magnetOn = false;
let magnetUntil = 0;

// auto planting
let lastAutoTime = 0;

// bees
let bees = [];
let lastBeeSpawn = 0;

// account
let activeUser = null;
let loginOpen = false;
let usernameInput, passwordInput;
let loginMsg = "";

// plant types
const PLANT_TYPES = [
  { name: "Cherry Blossom", color: [255, 190, 210], desc: "A soft pink puff tree that looks like a mochi cloud." },
  { name: "Tall Fern", color: [185, 230, 185], desc: "A skinny leafy friend that insists on being tall." },
  { name: "Sunny Flower Tree", color: [255, 235, 150], desc: "Basically a giant daisy pretending to be a tree." },
  { name: "Desert Cactus", color: [190, 230, 170], desc: "Spiky, dramatic, and somehow thriving here." },
  { name: "Moonlight Lily", color: [210, 200, 255], desc: "A dreamy purple bloom that looks best at 3AM." },
  { name: "Lucky Clover", color: [190, 255, 190], desc: "A pile of clovers quietly farming your luck stats." },
  { name: "Red Maple", color: [255, 170, 140], desc: "A warm red tree that screams cozy October." },
  { name: "Star Petal Bush", color: [235, 210, 255], desc: "A bush that sprouts tiny star-shaped flexes." }
];

// upgrade list
const UPGRADE_ITEMS = [
  { key: "fasterGrowth", title: "Rapid Growth", desc: "Seeds grow much faster when you hover over them.", cost: 200000 },
  { key: "bonusPoints", title: "Bonus Points", desc: "+1 extra star every time you harvest a tree.", cost: 1000000 },
  { key: "doubleTrail", title: "Double Trail", desc: "Your cursor leaves two seed trails instead of one.", cost: 500000 },
  { key: "megaBloom", title: "Mega Bloom", desc: "Harvests trigger small bursts of petals.", cost: 50000 },
  { key: "slowDecay", title: "Slow Decay", desc: "Trees linger on screen longer before fading out.", cost: 50000 },
  { key: "autoPlanter", title: "Auto-Planter", desc: "Seeds appear automatically around your cursor.", cost: 750000 },
  { key: "magnetMode", title: "Magnet Mode", desc: "10 seconds of x2 harvest stars when activated.", cost: 100000 },

  { key: "tinySeedBoost", title: "Tiny Seed Boost", desc: "Seeds appear slightly larger.", cost: 3000 },
  { key: "gentleBreeze", title: "Gentle Breeze", desc: "Plants grow a little bit faster.", cost: 5000 },
  { key: "happySoil", title: "Happy Soil", desc: "Seeds start with a little growth progress.", cost: 12000 },
  { key: "paleSunlight", title: "Pale Sunlight", desc: "Soft golden halo on grown trees.", cost: 8000 },
  { key: "fertileTouch", title: "Fertile Touch", desc: "Hover radius slightly increases.", cost: 15000 },
  { key: "calmRoots", title: "Calm Roots", desc: "Trees gently wiggle when fully grown.", cost: 7000 },
  { key: "dewdropShine", title: "Dewdrop Shine", desc: "Plants sparkle faintly.", cost: 10000 },
  { key: "coolMist", title: "Cool Mist", desc: "Bloom particles last longer.", cost: 20000 },
  { key: "softWind", title: "Soft Wind", desc: "Trail distance decreases slightly.", cost: 25000 },
  { key: "extraStorage", title: "Extra Storage", desc: "Bigger preview icons in your collection.", cost: 5000 },
  { key: "luckySeeds", title: "Lucky Seeds", desc: "1% chance of +5 bonus stars on harvest.", cost: 40000 },
  { key: "busyBees", title: "Busy Bees", desc: "Cute bees fly across the garden.", cost: 30000 },
  { key: "bloomEcho", title: "Bloom Echo", desc: "Harvest triggers an extra tiny bloom burst.", cost: 17000 },
];

// intro overlay
let introStart = 0;
let showIntro = true;

// layout
const NAV_H = 75;
const GARDEN_TOP = NAV_H + 10;

// buttons
let buttonAreas = [];

// sprout memory
let lastPlantType = null;

// setup screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("sans-serif");
  rectMode(CORNER);
  noStroke();

  usernameInput = createInput("");
  passwordInput = createInput("");
  passwordInput.attribute("type", "password");
  usernameInput.hide();
  passwordInput.hide();

  introStart = millis();
  showIntro = true;
}

// main draw loop
function draw() {
  background(225, 255, 225);

  if (currentScreen === "garden") {
    buttonAreas = [];
    drawGarden();
  } else if (currentScreen === "shop") {
    buttonAreas = [];
    drawShop();
  } else if (currentScreen === "collection") {
    buttonAreas = [];
    drawCollection();
  }

  drawPointsHUD();

  if (loginOpen) {
    drawLogin();
  }
}

// reset state for new users
function defaultUpgradeState() {
  return {
    fasterGrowth: false,
    bonusPoints: false,
    megaBloom: false,
    doubleTrail: false,
    slowDecay: false,
    autoPlanter: false,
    magnetMode: false,

    tinySeedBoost: false,
    gentleBreeze: false,
    happySoil: false,
    paleSunlight: false,
    fertileTouch: false,
    calmRoots: false,
    dewdropShine: false,
    coolMist: false,
    softWind: false,
    extraStorage: false,
    luckySeeds: false,
    busyBees: false,
    bloomEcho: false,
    miniMagnet: false,
    sproutMemory: false
  };
}

// reset ingame values
function resetGame() {
  points = 0;
  upgrades = defaultUpgradeState();
  collection = {};
  plants = [];
  bloomParticles = [];
  magnetOn = false;
  magnetUntil = 0;
  lastSpawnX = null;
  lastSpawnY = null;
  bees = [];
}

// server sync
function syncUser() {
  if (!activeUser) return;

  const payload = {
    username: activeUser,
    state: {
      points,
      upgrades,
      collection
    }
  };

  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

// ui helpers
function drawPanel(x, y, w, h) {
  fill(0, 20);
  rect(x + 4, y + 4, w, h, 18);
  fill(255, 252, 245);
  rect(x, y, w, h, 18);
}

function drawButton(x, y, w, h, label, fn) {
  buttonAreas.push({ x, y, w, h, fn });

  fill(255);
  rect(x, y, w, h, 20);
  fill(60);
  textSize(16);
  textAlign(LEFT, CENTER);
  text(label, x + 14, y + h / 2 + 1);
  textAlign(LEFT, BASELINE);
}

// nav bar
function drawNav() {
  drawPanel(0, 0, width, NAV_H);

  fill(60);
  textSize(24);
  textAlign(LEFT, CENTER);
  text("🌱 The Fertile Cursor", 22, 32);

  textSize(12);
  let tag = activeUser ? `User: ${activeUser}` : "User: Guest";
  text(tag, 26, 54);

  let y = 18;
  drawButton(width - 430, y, 90, 40, "Garden", () => (currentScreen = "garden"));
  drawButton(width - 330, y, 80, 40, "Shop", () => (currentScreen = "shop"));
  drawButton(width - 240, y, 110, 40, "Collection", () => (currentScreen = "collection"));

  let loginText = activeUser ? "Logout" : "Login";
  drawButton(width - 110, y, 90, 40, loginText, () => {
    if (activeUser) {
      syncUser();
      activeUser = null;
      resetGame();
    } else {
      openLogin();
    }
  });

  textAlign(LEFT, BASELINE);
}

// bottom-left points
function drawPointsHUD() {
  fill(60);
  textSize(22);
  textAlign(LEFT, BOTTOM);
  text(`⭐ ${points}`, 20, height - 20);

  if (magnetOn) {
    fill(200, 80, 80);
    textSize(14);
    text("x2 active", 20, height - 40);
  }

  textAlign(LEFT, BASELINE);
}

// text wrap
function wrapText(str, x, y, maxWidth, lineHeight = 14) {
  let words = str.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let w = textWidth(testLine);

    if (w > maxWidth && i > 0) {
      text(line, x, lineY);
      line = words[i] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line.length > 0) {
    text(line, x, lineY);
  }
}

// click → run button callbacks
function mouseReleased() {
  for (let b of buttonAreas) {
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      b.fn();
    }
  }
}

// account login ui
function openLogin() {
  loginOpen = true;
  loginMsg = "";
  usernameInput.show();
  passwordInput.show();
  usernameInput.value("");
  passwordInput.value("");
}

function closeLogin() {
  loginOpen = false;
  loginMsg = "";
  usernameInput.hide();
  passwordInput.hide();
}

function confirmLogin() {
  const rawName = usernameInput.value().trim();
  const pass = passwordInput.value();

  if (!rawName) {
    loginMsg = "Please enter a username.";
    return;
  }

  const name = rawName.toLowerCase();

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, password: pass })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error === "wrong password") {
        loginMsg = "Incorrect password.";
        return;
      }

      activeUser = name;
      points = data.points || 0;
      upgrades = Object.assign(defaultUpgradeState(), data.upgrades || {});
      collection = data.collection || {};

      plants = [];
      bloomParticles = [];
      magnetOn = false;
      bees = [];
      closeLogin();
    })
    .catch(() => {
      loginMsg = "Server error.";
    });
}

function drawLogin() {
  fill(0, 120);
  rect(0, 0, width, height);

  const w = 320;
  const h = 220;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;

  buttonAreas = [];

  drawPanel(x, y, w, h);

  fill(60);
  textSize(20);
  text("Login / Create Account", x + 30, y + 40);
  textSize(14);
  text("Username", x + 30, y + 75);
  text("Password", x + 30, y + 115);

  usernameInput.position(x + 30, y + 80);
  passwordInput.position(x + 30, y + 120);

  drawButton(x + 40, y + 160, 100, 32, "Confirm", confirmLogin);
  drawButton(x + 180, y + 160, 80, 32, "Cancel", closeLogin);

  if (loginMsg) {
    fill(200, 60, 60);
    textSize(12);
    text(loginMsg, x + 30, y + 150);
  }
}

// garden screen
function drawGarden() {
  background(225, 255, 225);
  drawNav();

  // intro overlay
  if (showIntro) {
    let t = millis() - introStart;
    if (t >= 5000) {
      showIntro = false;
    } else {
      let alpha = 255;
      if (t > 4000) alpha = map(t, 4000, 5000, 255, 0);

      let cardW = 420;
      let cardH = 90;
      let cx = width / 2;
      let cy = (height + NAV_H) / 2 + 10;

      noStroke();
      fill(0, 20 * (alpha / 255));
      rect(cx - cardW / 2 + 4, cy - cardH / 2 + 4, cardW, cardH, 22);

      fill(255, 252, 245, alpha);
      rect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 22);

      textAlign(CENTER, CENTER);
      fill(60, alpha);
      textSize(18);
      text("Move your cursor to plant seeds!", cx, cy - 10);
      textSize(13);
      text(
        "Hover seeds to grow them into trees. Hover trees again to harvest points.",
        cx,
        cy + 16
      );
      textAlign(LEFT, BASELINE);
    }
  }

  // magnet timer
  if (magnetOn && millis() > magnetUntil) {
    magnetOn = false;
  }

  updateTrail();
  updateAutoPlanting();
  drawPlants();
  updateBlooms();
  updateBees();
}

// trail planting
function updateTrail() {
  if (mouseY < GARDEN_TOP) {
    lastSpawnX = mouseX;
    lastSpawnY = mouseY;
    return;
  }

  if (lastSpawnX === null) {
    lastSpawnX = mouseX;
    lastSpawnY = mouseY;
    spawnPlant(mouseX, mouseY);
  }

  let threshold = 15;
  if (upgrades.softWind) threshold = 12;

  const d = dist(mouseX, mouseY, lastSpawnX, lastSpawnY);

  if (d > threshold && mouseY >= GARDEN_TOP) {
    if (upgrades.doubleTrail) {
      spawnPlant(mouseX, mouseY + 6);
      spawnPlant(mouseX, mouseY - 6);
    } else {
      spawnPlant(mouseX, mouseY);
    }
    lastSpawnX = mouseX;
    lastSpawnY = mouseY;
  }
}

// auto planting
function updateAutoPlanting() {
  if (!upgrades.autoPlanter) return;

  if (millis() - lastAutoTime > 350) {
    let px = mouseX + random(-30, 30);
    let py = mouseY + random(-30, 30);
    if (py >= GARDEN_TOP) spawnPlant(px, py);
    lastAutoTime = millis();
  }
}

// plant rendering
function drawPlants() {
  for (let p of plants) {
    p.update();
    p.draw();
  }
  plants = plants.filter((p) => !p.done);
}

// bee class
class Bee {
  constructor() {
    this.x = random(-40, -10);
    this.y = random(GARDEN_TOP + 40, height - 80);
    this.vx = random(1.2, 1.8);
    this.phase = random(TWO_PI);
  }

  update() {
    this.x += this.vx;
    this.y += sin((frameCount + this.phase) * 0.08) * 0.4;
  }

  draw() {
    push();
    translate(this.x, this.y);
    fill(255, 220, 80);
    ellipse(0, 0, 10, 7);
    stroke(80);
    strokeWeight(1);
    line(-3, 0, 3, 0);
    noStroke();
    fill(255, 255, 255, 150);
    ellipse(-3, -4, 6, 4);
    ellipse(3, -4, 6, 4);
    pop();
  }

  offscreen() {
    return this.x > width + 40;
  }
}

// bee updates
function updateBees() {
  if (upgrades.busyBees) {
    if (millis() - lastBeeSpawn > 5500) {
      bees.push(new Bee());
      lastBeeSpawn = millis();
    }
  }

  for (let b of bees) {
    b.update();
    b.draw();
  }
  bees = bees.filter((b) => !b.offscreen());
}

// shop screen (grid rendered in next part)
function drawShop() {
  background(255);
  drawNav();

  fill(60);
  textSize(24);
  textAlign(CENTER, BASELINE);
  text("Magical Upgrades", width / 2, NAV_H + 45);

  textSize(14);
  fill(90);
  text("Spend stars to power up your garden.", width / 2, NAV_H + 68);
  textAlign(LEFT, BASELINE);

  // grid settings
  const cardW = 210;
  const cardH = 130;
  const gap = 22;
  const cols = 5;

  const totalW = cols * cardW + (cols - 1) * gap;
  const startX = (width - totalW) / 2;

  const rows = Math.ceil(UPGRADE_ITEMS.length / cols);
  const totalH = rows * cardH + (rows - 1) * gap;

  let startY = NAV_H + 110;
  const minY = NAV_H + 110;
  if (startY < minY) startY = minY;

  let x = startX;
  let y = startY;
  let col = 0;

  for (let item of UPGRADE_ITEMS) {
    drawUpgradeCard(x, y, item.title, item.desc, item.cost, item.key);

    col++;
    if (col >= cols) {
      col = 0;
      x = startX;
      y += cardH + gap;
    } else {
      x += cardW + gap;
    }
  }

  textAlign(LEFT, BASELINE);
}

// single card
function drawUpgradeCard(x, y, title, desc, cost, key) {
  const cardW = 230;
  const cardH = 130;

  drawPanel(x, y, cardW, cardH);

  fill(60);
  textSize(16);
  text(title, x + 16, y + 28);

  textSize(12);
  fill(90);
  wrapText(desc, x + 16, y + 48, cardW - 32, 14);

  let label;
  if (key === "magnetMode" && magnetOn) {
    label = "Active";
  } else if (upgrades[key] && key !== "magnetMode") {
    label = "Owned";
  } else {
    label = cost.toLocaleString() + " pts";
  }

  drawButton(x + 16, y + cardH - 40, 130, 30, label, () => {
    if (key !== "magnetMode" && upgrades[key]) return;
    if (points < cost) return;

    points -= cost;

    if (key === "magnetMode") {
      upgrades[key] = true;
      magnetOn = true;
      magnetUntil = millis() + 10000;
    } else {
      upgrades[key] = true;
    }

    syncUser();
  });
}

// collection screen
function drawCollection() {
  background(255);
  drawNav();

  fill(60);
  textSize(22);
  text("Plant Collection Book", 40, 105);

  let types = Object.keys(collection);
  let x = 40, y = 150;
  let w = 220, h = 170;

  if (types.length === 0) {
    textSize(16);
    text("No trees harvested yet!", 40, 145);
  }

  for (let name of types) {
    drawPanel(x, y, w, h);

    const count = collection[name] || 0;
    const info = getTypeInfo(name);
    const desc = info ? info.desc : "";

    fill(60);
    textSize(14);
    text(name, x + 16, y + 26);

    textSize(11);
    fill(90);
    wrapText(desc, x + 16, y + 42, w - 32, 13);

    let scaling = upgrades.extraStorage ? 0.75 : 0.6;
    drawCollectionPreview(name, x + w / 2, y + h / 2 + 10, scaling);

    textSize(11);
    fill(90);
    text(`Harvested: ${count}`, x + 16, y + h - 16);

    x += w + 20;
    if (x + w > width - 40) {
      x = 40;
      y += h + 20;
    }
  }
}

function getTypeInfo(name) {
  for (let t of PLANT_TYPES) {
    if (t.name === name) return t;
  }
  return null;
}

function getTypeColor(name) {
  const info = getTypeInfo(name);
  return info ? info.color : [200, 200, 200];
}

function drawCollectionPreview(typeName, cx, cy, scaleFactor) {
  let c = getTypeColor(typeName);
  push();
  translate(cx, cy);
  scale(scaleFactor || 0.6);
  drawTreeShape(typeName, c);
  pop();
}

// plant class
class Plant {
  constructor(x, y, typeInfo) {
    this.x = x;
    this.y = y;
    this.typeName = typeInfo.name;
    this.color = typeInfo.color;

    this.stage = 0;
    this.lastStage = millis();
    this.harvested = false;
    this.done = false;
    this.removeAt = null;

    if (upgrades.happySoil) {
      this.lastStage -= 80;
    }
  }

  update() {
    if (this.done) return;

    if (this.harvested) {
      if (this.removeAt && millis() > this.removeAt) {
        this.done = true;
      }
      return;
    }

    const hoverRadius = getHoverRadius();
    const d = dist(mouseX, mouseY, this.x, this.y);

    let delay = upgrades.fasterGrowth ? 120 : 220;
    if (upgrades.gentleBreeze) delay *= 0.97;

    if (d < hoverRadius && millis() - this.lastStage > delay) {
      if (this.stage < 3) {
        this.stage++;
        this.lastStage = millis();
      } else if (this.stage === 3) {
        this.harvest();
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);

    if (this.stage === 0) this.drawSeed();
    else if (this.stage === 1) this.drawSprout();
    else if (this.stage === 2) this.drawSmallPlant();
    else if (this.stage === 3) this.drawFullTree();

    pop();

    if (upgrades.dewdropShine && this.stage >= 2 && !this.harvested) {
      push();
      stroke(255, 255, 255, 150);
      strokeWeight(1);
      noFill();
      ellipse(this.x + random(-6, 6), this.y - random(6, 12), 4, 4);
      pop();
    }
  }

  drawSeed() {
    fill(130, 90, 60);
    const size = upgrades.tinySeedBoost ? 10 : 8;
    ellipse(0, 0, size, size + 4);
  }

  drawSprout() {
    fill(130, 90, 60);
    rect(-1, 2, 2, 8, 2);
    fill(100, 190, 100);
    ellipse(-4, 2, 6, 10);
    ellipse(4, 2, 6, 10);
  }

  drawSmallPlant() {
    let c = this.color;
    fill(130, 90, 60);
    rect(-1.5, 4, 3, 10, 2);
    fill(c[0], c[1], c[2]);
    ellipse(0, 0, 16, 16);
  }

  drawFullTree() {
    let c = this.color;
    let wiggleOffset = 0;

    if (upgrades.calmRoots) {
      wiggleOffset = sin(frameCount * 0.05 + this.x * 0.03) * 1.2;
    }

    push();
    translate(0, wiggleOffset);

    if (upgrades.paleSunlight) {
      noStroke();
      fill(255, 240, 180, 70);
      ellipse(0, -6, 36, 30);
    }

    drawTreeShape(this.typeName, c);
    pop();
  }

  harvest() {
    if (this.harvested) return;
    this.harvested = true;

    let gain = 1;
    if (upgrades.bonusPoints) gain++;
    if (magnetOn) gain *= 2;

    if (upgrades.luckySeeds && random() < 0.01) {
      gain += 5;
    }

    points += gain;

    collection[this.typeName] = (collection[this.typeName] || 0) + 1;

    if (upgrades.megaBloom) {
      for (let i = 0; i < 10; i++) {
        bloomParticles.push(new BloomParticle(this.x, this.y, this.color));
      }
      if (upgrades.bloomEcho) {
        for (let i = 0; i < 6; i++) {
          bloomParticles.push(
            new BloomParticle(this.x, this.y, [
              this.color[0] + random(-10, 10),
              this.color[1] + random(-10, 10),
              this.color[2] + random(-10, 10)
            ])
          );
        }
      }
    }

    this.removeAt = upgrades.slowDecay ? millis() + 2000 : millis() + 200;

    syncUser();
  }
}

// hover radius adjustments
function getHoverRadius() {
  let r = 20;
  if (upgrades.fertileTouch) r += 4;
  if (upgrades.miniMagnet) r += 3;
  return r;
}

// tree body
function drawTreeShape(typeName, c) {
  fill(130, 90, 60);
  rect(-3, 6, 6, 16, 3);

  if (typeName === "Cherry Blossom") {
    fill(c[0], c[1], c[2]);
    ellipse(0, -4, 26, 20);
    ellipse(-6, -2, 20, 18);
    ellipse(6, -2, 20, 18);
  } else if (typeName === "Tall Fern") {
    fill(c[0], c[1], c[2]);
    ellipse(0, -2, 16, 24);
    ellipse(0, -8, 12, 18);
    ellipse(0, -14, 8, 14);
  } else if (typeName === "Sunny Flower Tree") {
    fill(c[0], c[1], c[2]);
    ellipse(0, -4, 22, 22);
    fill(255, 210, 100);
    ellipse(0, -4, 10, 10);
  } else if (typeName === "Desert Cactus") {
    fill(c[0], c[1], c[2]);
    rect(-4, -2, 8, 20, 4);
    rect(-10, -2, 6, 12, 4);
    rect(4, -2, 6, 12, 4);
  } else if (typeName === "Moonlight Lily") {
    fill(c[0], c[1], c[2]);
    ellipse(0, -6, 18, 24);
    fill(255, 255, 240);
    ellipse(0, -8, 8, 12);
  } else if (typeName === "Lucky Clover") {
    fill(c[0], c[1], c[2]);
    ellipse(-4, -2, 10, 10);
    ellipse(4, -2, 10, 10);
    ellipse(0, -6, 10, 10);
    ellipse(0, 2, 10, 10);
  } else if (typeName === "Red Maple") {
    fill(c[0], c[1], c[2]);
    ellipse(0, -4, 24, 18);
    ellipse(-6, -2, 18, 14);
    ellipse(6, -2, 18, 14);
  } else if (typeName === "Star Petal Bush") {
    fill(c[0], c[1], c[2]);
    ellipse(0, 0, 22, 16);
    fill(255, 240, 180);
    ellipse(-5, -2, 6, 6);
    ellipse(5, -2, 6, 6);
    ellipse(0, 2, 6, 6);
  } else {
    fill(c[0], c[1], c[2]);
    ellipse(0, -4, 22, 18);
  }
}

// plant spawning
function spawnPlant(x, y) {
  if (y < GARDEN_TOP) return;

  let typeInfo;
  if (upgrades.sproutMemory && lastPlantType && random() < 0.6) {
    typeInfo = lastPlantType;
  } else {
    typeInfo = random(PLANT_TYPES);
  }
  lastPlantType = typeInfo;

  const p = new Plant(x, y, typeInfo);
  plants.push(p);
}

// particle class
class BloomParticle {
  constructor(x, y, baseColor) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = upgrades.coolMist ? 36 : 30;
    this.baseColor = baseColor || [255, 180, 200];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.life--;
  }

  draw() {
    if (this.life <= 0) return;
    let a = map(this.life, 0, upgrades.coolMist ? 36 : 30, 0, 255);
    fill(this.baseColor[0], this.baseColor[1], this.baseColor[2], a);
    ellipse(this.x, this.y, 6, 6);
  }

  dead() {
    return this.life <= 0;
  }
}

// particle updates
function updateBlooms() {
  for (let i = bloomParticles.length - 1; i >= 0; i--) {
    bloomParticles[i].update();
    bloomParticles[i].draw();
    if (bloomParticles[i].dead()) {
      bloomParticles.splice(i, 1);
    }
  }
}

// resize screen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}