/* ===============================
   Firebase Configuration & Setup
   =============================== */

const firebaseConfig = {
    apiKey: "AIzaSyBiwb2K3lU6cO2BmGmzZKdE8Xp3gxgc2KY",
    authDomain: "friendlyfeud-e505b.firebaseapp.com",
    projectId: "friendlyfeud-e505b",
    storageBucket: "friendlyfeud-e505b.firebasestorage.app",
    messagingSenderId: "115935085171",
    appId: "1:115935085171:web:13e4904634c1f40ad7a006",
    measurementId: "G-N6FKK37X16",
    databaseURL:"https://friendlyfeud-e505b-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ===============================
   Game Session Management
   =============================== */

const FirebaseService = {
  /**
   * Create a new game room and set initial game state
   * @param {string} playerName - name of the player creating the room
   * @returns {Promise<string>} - generated room code
   */
  async createGame(playerName) {
    const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const roomRef = db.ref(`rooms/${roomCode}`);

    await roomRef.set({
      host: playerName,
      player1: { name: playerName, score: 0 },
      player2: null,
      state: "waiting", // waiting | playing | ended
      turn: 1,
      questionIndex: 0,
      timestamp: Date.now(),
    });

    return roomCode;
  },

  /**
   * Join an existing game room
   * @param {string} roomCode - 5-character room code
   * @param {string} playerName - name of the joining player
   */
  async joinGame(roomCode, playerName) {
    const roomRef = db.ref(`rooms/${roomCode}`);
    const snapshot = await roomRef.get();

    if (!snapshot.exists()) {
      throw new Error("Room not found.");
    }

    const roomData = snapshot.val();
    if (roomData.player2) {
      throw new Error("Room already full.");
    }

    await roomRef.update({
      player2: { name: playerName, score: 0 },
      state: "playing",
    });
  },

  /**
   * Listen for real-time room updates
   */
  listenToRoom(roomCode, callback) {
    const roomRef = db.ref(`rooms/${roomCode}`);
    roomRef.on("value", (snapshot) => {
      if (snapshot.exists()) callback(snapshot.val());
    });
  },

  /**
   * Update room data (e.g. scores, turn, question)
   */
  async updateRoom(roomCode, updates) {
    await db.ref(`rooms/${roomCode}`).update(updates);
  },

  /**
   * Remove a room (cleanup after game ends)
   */
  async deleteRoom(roomCode) {
    await db.ref(`rooms/${roomCode}`).remove();
  },
};
