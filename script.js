console.log("SYSTEM BOOT OK");

// =====================
// STATE
// =====================
let level = 1;
let progress = 0;
let corruption = 0;
let endingTriggered = false;

// =====================
// ELEMENTS
// =====================
const terminal = document.getElementById("terminal");
const bootText = document.getElementById("bootText");

// =====================
// BOOT SEQUENCE
// =====================
const bootLines = [
  "INITIALIZING SYSTEM...",
  "LOADING CORE MEMORY...",
  "CHECKING CORRUPTION LEVEL...",
  "RESTORE PROTOCOL ACTIVE...",
  "SYSTEM READY"
];

let i = 0;

function boot() {
  if (i < bootLines.length) {
    bootText.innerHTML += bootLines[i] + "<br>";
    i++;
    setTimeout(boot, 700);
  } else {
    setTimeout(() => {
      document.getElementById("bootScreen").style.display = "none";
      document.getElementById("loginScreen").style.display = "block";
    }, 800);
  }
}
boot();

// =====================
// LOGIN
// =====================
document.getElementById("passwordInput").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (e.target.value === "nobleknight") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    startGame();
  } else {
    alert("ACCESS DENIED");
  }

  e.target.value = "";
});

// =====================
// START
// =====================
function startGame() {
  terminal.innerHTML += "WELCOME, USER.<br>";
  terminal.innerHTML += "THIS SYSTEM IS PARTIALLY CORRUPTED.<br>";
  terminal.innerHTML += "OBJECTIVE: restore system integrity or let it collapse.<br><br>";
  terminal.innerHTML += "TYPE 'help' TO BEGIN.<br>";
}

// =====================
// UI
// =====================
function updateUI() {
  document.getElementById("hackBar").style.width = progress + "%";
  document.getElementById("corruption").innerText =
    "System Corruption: " + corruption + "%";
}

// =====================
// EFFECTS
// =====================
function hackEffect(value, message) {
  progress += value;
  if (progress > 100) progress = 100;

  document.getElementById("hackSound")?.play();

  terminal.innerHTML += message + "<br>";
  terminal.innerHTML += "SYSTEM PROGRESS: " + progress + "%<br>";

  updateUI();
}

function glitch(message) {
  document.body.classList.add("glitch");
  setTimeout(() => document.body.classList.remove("glitch"), 200);

  document.getElementById("errorSound")?.play();

  terminal.innerHTML += message + "<br>";
  terminal.innerHTML += "CORRUPTION LEVEL: " + corruption + "%<br>";
}

// =====================
// HELP
// =====================
function showHelp() {
  terminal.innerHTML += `
AVAILABLE COMMANDS:
- scan → analyze system memory
- decrypt → unlock hidden data
- debug → stabilize corrupted files
- sudo hug → emotional override
`;
}

// =====================
// ENDINGS
// =====================
function triggerGoodEnding() {
  if (endingTriggered) return;
  endingTriggered = true;

  terminal.innerHTML += `
<br>GOOD ENDING:<br>
system restored<br>
memory recovered<br>
connection preserved 🤍
`;

  document.getElementById("commandInput").disabled = true;
}

function triggerBadEnding() {
  if (endingTriggered) return;
  endingTriggered = true;

  terminal.innerHTML += `
<br>BAD ENDING:<br>
system collapse<br>
memory lost<br>
corruption complete
`;

  document.getElementById("commandInput").disabled = true;
}

function checkEndings() {
  if (endingTriggered) return;

  if (corruption >= 100) triggerBadEnding();

  if (progress >= 100 && corruption < 60) triggerGoodEnding();
}

// =====================
// COMMAND SYSTEM
// =====================
document.getElementById("commandInput").addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || endingTriggered) return;

  const cmd = e.target.value.trim().toLowerCase();

  terminal.innerHTML += "> " + cmd + "<br>";

  // HELP
  if (cmd === "help") {
    showHelp();
  }

  // SCAN
  else if (cmd === "scan") {
    hackEffect(20, "scan complete → memory fragment found");
    level = 2;
  }

  // DECRYPT
  else if (cmd === "decrypt" && level >= 2) {
    hackEffect(25, "decrypt successful → hidden data unlocked");
  }

  // DEBUG
  else if (cmd === "debug" && level >= 2) {
    corruption += 10;
    glitch("debug failed → system instability detected");
  }

  // SECRET
  else if (cmd === "sudo hug") {
    hackEffect(40, "emotional override accepted 🤍");
  }

  // ERROR
  else {
    corruption += 10;
    glitch("command not recognized → system rejects input");
  }

  updateUI();
  checkEndings();

  e.target.value = "";
});

// =====================
// RANDOM EVENTS
// =====================
setInterval(() => {
  if (!endingTriggered && level >= 2 && Math.random() < 0.2) {
    terminal.innerHTML += "<br>system anomaly detected...<br>";
    corruption += 5;
    glitch("unknown process running in background");
    updateUI();
    checkEndings();
  }
}, 8000);