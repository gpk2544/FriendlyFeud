/* ===============================
   FriendlyFeud Game Logic
   =============================== */

let playerName = "";
let playerNumber = 1;
let currentRoom = "";
let questions = [];
let currentQuestionIndex = 0;

/* ===============================
   Initialize Game
   =============================== */
document.addEventListener("DOMContentLoaded", async () => {
  // Load question data
  questions = await loadQuestions();

  // UI event listeners
  document.getElementById("createGameBtn").addEventListener("click", createGame);
  document.getElementById("joinGameBtn").addEventListener("click", joinGame);
  document.getElementById("endGameBtn").addEventListener("click", endGame);

  UI.playBackground();
});

/* ===============================
   Game Setup
   =============================== */
async function createGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name!");

  const code = await FirebaseService.createGame(playerName);
  currentRoom = code;
  playerNumber = 1;

  UI.setRoomCode(code);
  UI.show("game");

  FirebaseService.listenToRoom(currentRoom, updateGame);
}

async function joinGame() {
  playerName = document.getElementById("playerName").value.trim();
  const joinCode = document.getElementById("joinCode").value.trim().toUpperCase();
  if (!playerName || !joinCode) return alert("Enter name and code!");

  await FirebaseService.joinGame(joinCode, playerName);
  currentRoom = joinCode;
  playerNumber = 2;

  UI.setRoomCode(joinCode);
  UI.show("game");

  FirebaseService.listenToRoom(currentRoom, updateGame);
}

/* ===============================
   Game Progress
   =============================== */
function updateGame(roomData) {
  if (roomData.state === "playing") {
    const q = questions[roomData.questionIndex];
    if (q) UI.setQuestion(q);
    UI.updateScores(roomData.player1.score, roomData.player2?.score || 0);
  }

  if (roomData.state === "ended") {
    UI.showWinner(roomData.player1.score, roomData.player2.score);
  }
}

/* ===============================
   Answer Handling
   =============================== */
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("answer-btn")) return;

  const points = parseInt(e.target.dataset.points);
  const roomRef = firebase.database().ref(`rooms/${currentRoom}`);
  const snapshot = await roomRef.get();
  const room = snapshot.val();

  if (!room) return;

  // Update player score
  if (playerNumber === 1) room.player1.score += points;
  else room.player2.score += points;

  // Move to next question
  const nextIndex = room.questionIndex + 1;
  const newState = nextIndex >= questions.length ? "ended" : "playing";

  await FirebaseService.updateRoom(currentRoom, {
    player1: room.player1,
    player2: room.player2,
    questionIndex: nextIndex,
    state: newState,
  });
});

/* ===============================
   End Game
   =============================== */
async function endGame() {
  await FirebaseService.updateRoom(currentRoom, { state: "ended" });
}
