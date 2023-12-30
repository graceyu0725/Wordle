import { useBoard } from "../../store/BoardProvider";
import CharacterBox from "./CharacterBox";

const LETTER_LENGTH = 5;

interface WordRowProps {
  letters: string;
  index: number;
}

export default function WordRow({
  letters: lettersProp = "",
  index: currentRowIndex,
}: WordRowProps) {
  const { state } = useBoard();
  const letterRemaining = LETTER_LENGTH - lettersProp.length;
  const letters = lettersProp.split("").concat(Array(letterRemaining).fill(""));

  const getValidStyles = () => {
    const validStyles = {
      invalid: "animate-shake animate-duration-100 animate-twice",
      noStyle: "",
    };
    if (currentRowIndex === state.rowIndex) {
      if (state.isGuessInvalid) {
        return validStyles.invalid;
      }
      return validStyles.noStyle;
    }
    return validStyles.noStyle;
  };

  return (
    <div className={`grid grid-cols-5 gap-1 text-center ${getValidStyles()}`}>
      {letters.map((char, index) => (
        <CharacterBox
          key={index}
          index={index}
          value={char}
          rowIndex={currentRowIndex}
        />
      ))}
    </div>
  );
}
