/* ===============================
   UI Manager for FriendlyFeud
   =============================== */

const UI = {
  // === Elements ===
  screens: {
    lobby: document.getElementById("lobby"),
    game: document.getElementById("gameBoard"),
    end: document.getElementById("endScreen"),
  },
  elements: {
    roomCodeDisplay: document.getElementById("roomCodeDisplay"),
    questionText: document.getElementById("questionText"),
    answersContainer: document.getElementById("answersContainer"),
    score1: document.getElementById("score1"),
    score2: document.getElementById("score2"),
    winnerText: document.getElementById("winnerText"),
  },
  sounds: {
    correct: new Audio("assets/correct.mp3"),
    buzz: new Audio("assets/buzz.mp3"),
    bg: new Audio("assets/bg-music.mp3"),
  },

  /* ===============================
     Screen Management
  =============================== */
  show(screen) {
    Object.values(this.screens).forEach(s => s.style.display = "none");
    this.screens[screen].style.display = "block";
  },

  /* ===============================
     Room & Question Display
  =============================== */
  setRoomCode(code) {
    this.elements.roomCodeDisplay.textContent = `Room Code: ${code}`;
  },

  setQuestion(question) {
    this.elements.questionText.textContent = question.question;
    this.elements.answersContainer.innerHTML = "";

    question.answers.forEach((ans, idx) => {
      const btn = document.createElement("button");
      btn.classList.add("answer-btn");
      btn.textContent = `${idx + 1}. ${ans.answer}`;
      btn.dataset.points = ans.points;
      btn.addEventListener("click", () => this.revealAnswer(btn));
      this.elements.answersContainer.appendChild(btn);
    });
  },

  revealAnswer(btn) {
    btn.classList.add("revealed");
    btn.disabled = true;
    this.playSound("correct");
  },

  updateScores(p1, p2) {
    this.elements.score1.textContent = `Player 1: ${p1}`;
    this.elements.score2.textContent = `Player 2: ${p2}`;
  },

  showWinner(p1, p2) {
    if (p1 > p2) this.elements.winnerText.textContent = "🎉 Player 1 Wins!";
    else if (p2 > p1) this.elements.winnerText.textContent = "🎉 Player 2 Wins!";
    else this.elements.winnerText.textContent = "🤝 It's a Tie!";
    this.show("end");
  },

  /* ===============================
     Sound Effects
  =============================== */
  playSound(type) {
    const sound = this.sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  },

  playBackground() {
    this.sounds.bg.loop = true;
    this.sounds.bg.volume = 0.3;
    this.sounds.bg.play().catch(() => {}); // Ignore autoplay errors
  },
};
