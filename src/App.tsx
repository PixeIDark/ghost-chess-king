import Cell from "./Cell.tsx";
import { useRef, useState } from "react";
import { initialBoard } from "./constants/board.ts";

function App() {
  const [board, setBoard] = useState(initialBoard);
  const locationRef = useRef<[number, number][]>([]);

  const move = (row: number, col: number) => {
    locationRef.current = [...locationRef.current, [row, col]];

    if (locationRef.current.length !== 2) return;

    const [prevRow, prevCol] = locationRef.current[0];
    const [nextRow, nextCol] = locationRef.current[1];
    const newBoard = [...board];

    // TODO: 위치 바꾸는 유틸 함수 제작하자
    [newBoard[prevRow][prevCol], newBoard[nextRow][nextCol]] = [
      newBoard[nextRow][nextCol],
      newBoard[prevRow][prevCol],
    ];
    setBoard(newBoard);

    locationRef.current = [];
  };

  return (
    <div>
      <div className="m-auto w-fit border border-blue-200">
        {board.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((square, colIndex) => (
              <Cell
                move={move}
                square={square}
                rowIndex={rowIndex}
                colIndex={colIndex}
                key={colIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
