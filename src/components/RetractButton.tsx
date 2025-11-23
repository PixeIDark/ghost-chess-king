interface RetractButtonProps {
  onLoadBoard: () => void;
}

function RetractButton({ onLoadBoard }: RetractButtonProps) {
  return (
    <button onClick={onLoadBoard} className="rounded-sm bg-blue-950 p-2 text-white">
      한 수 무르기
    </button>
  );
}

export default RetractButton;
