import { useBoard } from "../../store/BoardProvider";
import { LetterState } from "../../utils/words";

interface CharacterBoxProps {
  index: number;
  value: string;
  rowIndex: number;
}

export default function CharacterBox({
  index,
  value,
  rowIndex,
}: CharacterBoxProps) {
  const { state } = useBoard();
  const stateIndex: LetterState = state.guessStates[rowIndex][index];

  const getStateStyles = () => {
    const stateStyles = {
      noValue: "border-stone-600",
      hasValue:
        "border-stone-400 animate-jump animate-once animate-duration-100",
      noState: "",
      hasState: `animate-rotate-x animate-once ${characterStateStyles[stateIndex]} ${delayStyles[index]}`,
    };

    if (stateIndex === LetterState.Unchecked) {
      if (value === "") {
        return stateStyles.noValue;
      }
      return stateStyles.hasValue;
    }
    return stateStyles.hasState;
  };

  return <div className={`${basicStyles} ${getStateStyles()}`}>{value}</div>;
}

const basicStyles =
  "mx-1 inline-block h-12 w-12 border-2 text-3xl font-bold uppercase leading-normal text-stone-50";

const characterStateStyles = {
  [LetterState.Miss]: "border-gray-600 bg-gray-600",
  [LetterState.Present]: "border-yellow-600 bg-yellow-600",
  [LetterState.Match]: "border-green-600 bg-green-600",
  [LetterState.Unchecked]: "",
};

const delayStyles = [
  "animate-delay-0 transition delay-0",
  "animate-delay-500 transition delay-500",
  "animate-delay-1000 transition delay-1000",
  "animate-delay-[1500ms] transition delay-[1500ms]",
  "animate-delay-[2000ms] transition delay-[2000ms]",
];
