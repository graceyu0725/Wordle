import { useEffect } from "react";
import { GameState, useBoard } from "../../store/BoardProvider";
import WordRow from "./WordRow";

export default function Board() {
  const { state, dispatch } = useBoard();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^[A-Za-z]$/.test(event.key)) {
        dispatch({ type: "UPDATE", payload: { word: event.key } });
      } else if (event.key === "Enter") {
        dispatch({ type: "CHECK_ANSWER" });
      } else if (event.key === "Backspace") {
        dispatch({ type: "DELETE" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="flex flex-col items-center gap-2">
      {state.words.map((letters, index) => (
        <WordRow
          key={index}
          letters={letters}
          index={index}
        />
      ))}
      {state.status !== GameState.Playing && (
        <div className="animate-jump-in text-2xl text-stone-50 animate-delay-[2200ms] animate-normal animate-duration-500 animate-once">
          {`You ${state.status}!`}
        </div>
      )}
      {state.isGuessInvalid && (
        <div className="fixed top-12 h-8 w-28 animate-fade-down rounded-md bg-amber-600 text-center text-xs font-bold leading-8 text-stone-50 animate-duration-200 animate-once">
          Not in Word List
        </div>
      )}
    </main>
  );
}
