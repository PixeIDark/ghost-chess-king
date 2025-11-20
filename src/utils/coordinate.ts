const coordinateMap: Record<string, [number, number]> = {};

for (let col = 0; col < 8; col++) {
  for (let row = 0; row < 8; row++) {
    const colChar = String.fromCharCode(97 + col);
    const rowNum = 8 - row;
    const coord = `${colChar}${rowNum}`;
    coordinateMap[coord] = [row, col];
  }
}

export const parseMove = (moveStr: string) => {
  const from = moveStr.slice(0, 2);
  const to = moveStr.slice(2, 4);
  const [fromRow, fromCol] = coordinateMap[from];
  const [toRow, toCol] = coordinateMap[to];

  return { fromRow, fromCol, toRow, toCol };
};
