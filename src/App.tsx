import Board from "./components/Board";
import Header from "./components/Header";
import { BoardProvider } from "./store/BoardProvider";

function App() {
  return (
    <BoardProvider>
      <div className="box-border flex h-screen w-screen flex-col items-center gap-3 bg-stone-800">
        <Header />
        <Board />
      </div>
    </BoardProvider>
  );
}

export default App;
