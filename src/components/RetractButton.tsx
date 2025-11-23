interface RetractButtonProps {
  onLoadBoard: () => void;
}

function RetractButton({ onLoadBoard }: RetractButtonProps) {
  return <button onClick={onLoadBoard}>한 수 무르기</button>;
}

export default RetractButton;
