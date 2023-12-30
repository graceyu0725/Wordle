import { ReactNode, createContext, useContext, useReducer } from "react";
import { wordBank } from "../utils/wordBank";
import { LetterState, computeGuess } from "../utils/words";

const MAX_WORD_LENGTH = 5;
const MAX_ROW_INDEX = 5;
export enum GameState {
  Playing = "Playing",
  Win = "Win",
  Lose = "Lose",
}

type Action =
  | { type: "UPDATE"; payload: { word: string } }
  | { type: "DELETE" }
  | { type: "CHECK_ANSWER" };

interface BoardState {
  words: string[];
  rowIndex: number;
  guessStates: { [key: number]: number[] };
  status: GameState;
  isGuessInvalid: boolean;
}

const wordReducer = (state: BoardState, action: Action): BoardState => {
  if (state.status !== GameState.Playing) return state;
  switch (action.type) {
    case "UPDATE":
      if (state.words[state.rowIndex].length < MAX_WORD_LENGTH) {
        const { word } = action.payload;
        const newWords = [...state.words];
        newWords[state.rowIndex] = state.words[state.rowIndex] + word;
        return { ...state, words: newWords };
      }
      return state;

    case "DELETE":
      if (state.words[state.rowIndex]?.length > 0) {
        const deletedWords = [...state.words];
        deletedWords[state.rowIndex] = state.words[state.rowIndex].slice(0, -1);
        return { ...state, words: deletedWords, isGuessInvalid: false };
      }
      return state;

    case "CHECK_ANSWER":
      if (state.words[state.rowIndex].length === MAX_WORD_LENGTH) {
        if (
          !wordBank.includes(state.words[state.rowIndex].toLocaleLowerCase())
        ) {
          return { ...state, isGuessInvalid: true };
        } else {
          const updatedGuessState = computeGuess(state.words[state.rowIndex]);
          const newGuessStates = { ...state.guessStates };
          newGuessStates[state.rowIndex] = updatedGuessState;

          let newStatus: GameState = GameState.Playing;
          let newRowIndex = state.rowIndex + 1;
          if (updatedGuessState.every((value) => value === LetterState.Match)) {
            newStatus = GameState.Win;
            newRowIndex = state.rowIndex;
          } else if (state.rowIndex === MAX_ROW_INDEX) {
            newStatus = GameState.Lose;
            newRowIndex = state.rowIndex;
          }

          return {
            ...state,
            rowIndex: newRowIndex,
            guessStates: newGuessStates,
            status: newStatus,
          };
        }
      }
      return state;

    default:
      return state;
  }
};

const initialGuessStates = Array.from({ length: MAX_ROW_INDEX + 1 }, () =>
  Array(MAX_WORD_LENGTH).fill(LetterState.Unchecked),
);
const initialState: BoardState = {
  words: ["", "", "", "", "", ""],
  rowIndex: 0,
  guessStates: initialGuessStates,
  status: GameState.Playing,
  isGuessInvalid: false,
};

const BoardContext = createContext<
  { state: BoardState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

interface BoardProviderProps {
  children: ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(wordReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
