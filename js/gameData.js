// gameData.js
// Handles loading and parsing Family Feud question data from a CSV file

export let questions = [];

/**
 * Load the questions from /data/questions.csv
 * CSV format expected:
 * Question,Answer1,Points1,Answer2,Points2,Answer3,Points3,...
 */
export async function loadQuestions() {
  try {
    const response = await fetch("./data/questions.csv");
    const text = await response.text();
    questions = parseCSV(text);
    console.log(`Loaded ${questions.length} questions.`);
  } catch (error) {
    console.error("Error loading questions.csv:", error);
  }
}

/**
 * Simple CSV parser for Family Feud-style data
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const data = [];

  // Skip header row if present
  const hasHeader = lines[0].toLowerCase().includes("question");
  const start = hasHeader ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const cells = lines[i].split(",").map(c => c.trim());

    const question = cells[0];
    const answers = [];

    // Parse answer-text,point pairs
    for (let j = 1; j < cells.length; j += 2) {
      const answer = cells[j];
      const points = parseInt(cells[j + 1]) || 0;
      if (answer) answers.push({ text: answer, points });
    }

    if (question && answers.length > 0) {
      data.push({ question, answers });
    }
  }
  return data;
}

/**
 * Get a random question object
 */
export function getRandomQuestion() {
  if (questions.length === 0) {
    console.warn("Questions not loaded yet!");
    return null;
  }
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}
