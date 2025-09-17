// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS"; // Our secret word for testing
let currentRow = 0; // Which row we're filling (0-5)
let currentTile = 0; // Which tile in the row (0-4)
let gameOver = false; // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = "info") {
  // Log to browser console
  console.log(message);

  // Also log to visual testing area
  if (!debugOutput) {
    debugOutput = document.getElementById("debug-output");
  }

  if (debugOutput) {
    const entry = document.createElement("div");
    entry.className = `debug-entry ${type}`;
    entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;

    // Add to top of debug output
    debugOutput.insertBefore(entry, debugOutput.firstChild);

    // Keep only last 20 entries for performance
    const entries = debugOutput.querySelectorAll(".debug-entry");
    if (entries.length > 20) {
      entries[entries.length - 1].remove();
    }
  }
}

function clearDebug() {
  const debugOutput = document.getElementById("debug-output");
  if (debugOutput) {
    debugOutput.innerHTML =
      '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
  }
}

// Helper function to get current word being typed
function getCurrentWord() {
  const currentRowElement = rows[currentRow];
  const tiles = currentRowElement.querySelectorAll(".tile");
  let word = "";
  tiles.forEach((tile) => (word += tile.textContent));
  return word;
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  gameBoard = document.querySelector(".game-board");
  rows = document.querySelectorAll(".row");
  debugOutput = document.getElementById("debug-output");

  logDebug("🎮 Game initialized successfully!", "success");
  logDebug(`🎯 Target word: ${TARGET_WORD}`, "info");
  logDebug("💡 Try typing letters, pressing Backspace, or Enter", "info");
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

document.addEventListener("keydown", (event) => {
  if (gameOver) {
    return;
  }

  let keyPressed = event.key.toUpperCase();
  logDebug(`Key "${keyPressed}" pressed.`, "info");

  if (keyPressed === "BACKSPACE") {
    deleteLetter();
  } else if (keyPressed === "ENTER") {
    submitGuess();
  } else if (
    keyPressed.length === 1 &&
    keyPressed >= "A" &&
    keyPressed <= "Z"
  ) {
    addLetter(keyPressed);
  }
});

function addLetter(letter) {
  logDebug(`🎯 addLetter("${letter}") called`, "info");

  if (currentTile >= 5) {
    logDebug("Trying to add letter when the current row is full.", "error");
  }
  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll(".tile");
  const tileElement = tiles[currentTile];

  tileElement.textContent = letter;
  tileElement.classList.add("filled");

  currentTile++;

  logDebug(
    `Tile at  (${currentRow}, ${currentTile}) has been updated to have the letter ${letter}.`,
    "success"
  );
  logDebug(`Current word progress: ${getCurrentWord()}`, "info");
}

function deleteLetter() {
  logDebug(`🗑️ deleteLetter() called`, "info");

  if (currentTile <= 0) {
    logDebug(
      "deleteLetter() called when there are no letters to delete.",
      "error"
    );
    return;
  }

  currentTile--;

  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll(".tile");
  const tileElement = tiles[currentTile];
  const letterDeleted = tileElement.textContent;

  tileElement.textContent = "";
  tileElement.classList.remove("filled");

  logDebug(
    `Letter ${letterDeleted} deleted from position (${currentRow}, ${currentTile})`,
    "success"
  );
  logDebug(`Current word progress: ${getCurrentWord()}`, "info");
}

function submitGuess() {
  logDebug(`📝 submitGuess() called`, "info");

  if (currentTile !== 5) {
    logDebug("submitGuess() called too early!", "error");
    return;
  }

  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll(".tile");

  let guess = "";
  tiles.forEach((tile) => {
    guess += tile.textContent;
  });

  logDebug(`Current guess: ${guess} | Target word: ${TARGET_WORD}`, "info");

  checkGuess(guess, tiles);
  currentRow++;
  currentTile = 0;

  if (guess === TARGET_WORD) {
    gameOver = true;
    setTimeout(() => alert("Congratulations! You won!"), 500);
    logDebug(`Current game status: won`, "info");
  } else if (currentRow >= 6) {
    gameOver = true;
    setTimeout(() => alert("Game over! You lost."), 500);
    logDebug(`Current game status: lost`, "info");
  }
  logDebug(`Current game status: continuing`, "info");
}

function checkGuess(guess, tiles) {
  logDebug(`🔍 Starting analysis for "${guess}"`, "info");

  const target = TARGET_WORD.split("");
  const guessArray = guess.split("");
  const result = ["absent", "absent", "absent", "absent", "absent"];

  // STEP 1: Find exact matches
  for (let i = 0; i < 5; i++) {
    if (target[i] === guess[i]) {
      logDebug(
        `Position ${i}: ${target[i]} = ${guess[i]} (correct)`,
        "success"
      );
      result[i] = "correct";
      target[i] = null;
      guessArray[i] = null;

      const tileElement = tiles[i];
      tileElement.classList.add("correct");
    }
  }

  logDebug(`Result so far: ${result}`, "info");

  // STEP 2: Find wrong position matches
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] !== null) {
      const guessLetter = guessArray[i];
      if (target.includes(guessLetter)) {
        logDebug(
          `Position ${i}: ${guessLetter} exists in target (present)`,
          "warn"
        );
        result[i] = "present";
        target[i] = null;

        const tileElement = tiles[i];
        tileElement.classList.add("present");
      }
    }
  }

  logDebug(`Final result: ${result}`, "info");

  // TODO: Apply CSS classes to tiles -- we'll do this in the next step
  return result;
}
