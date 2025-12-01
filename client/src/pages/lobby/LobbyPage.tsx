import { Link } from "react-router";

function LobbyPage() {
  return (
    <div>
      <p>로비</p>
      <Link to="/game">게임 시작</Link>
    </div>
  );
}

export default LobbyPage;
