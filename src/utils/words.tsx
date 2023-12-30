import { wordBank } from "./wordBank";

function getRandomAnswer(): string {
  return wordBank[Math.floor(Math.random() * wordBank.length)].toUpperCase();
}

export const correctAnswer = getRandomAnswer();
console.log(`The correct answer is: ${correctAnswer}`);

export enum LetterState {
  Miss,
  Present,
  Match,
  Unchecked,
}

export function computeGuess(
  guessString: string,
  answerString: string = correctAnswer,
) {
  const result: LetterState[] = [];

  if (guessString.length !== answerString.length) {
    return result;
  }

  const guessArray = guessString.toUpperCase().split("");
  const answerArray = answerString.toUpperCase().split("");

  const answerLetterCount: Record<string, number> = {};

  guessArray.forEach((letter, index) => {
    const currentAnswerLetter = answerArray[index];

    // Calculate how many times each letter appears in the answer
    answerLetterCount[currentAnswerLetter] =
      (answerLetterCount[currentAnswerLetter] || 0) + 1;

    if (currentAnswerLetter === letter) {
      result.push(LetterState.Match);
      if (answerLetterCount[letter] > 0) {
        answerLetterCount[letter] -= 1;
      }
    } else if (answerArray.includes(letter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  });

  // Deal with edge cases for LetterState.Present
  // e.g., there's only one "l" in answerString, but there are two "l" in guessString
  result.forEach((currentResult, resultIndex) => {
    if (currentResult !== LetterState.Present) {
      return;
    }

    const guessLetter = guessArray[resultIndex];

    if (answerLetterCount[guessLetter] <= 0) {
      result[resultIndex] = LetterState.Miss;
    }

    answerLetterCount[guessLetter] -= 1;
  });

  return result;
}
