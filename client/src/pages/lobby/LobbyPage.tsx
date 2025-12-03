import { Link } from "react-router";
import { ROUTES } from "../../constants/routes.ts";

function LobbyPage() {
  return (
    <div>
      <Link to={ROUTES.GAME()}>ai와 게임하기</Link>
    </div>
  );
}

export default LobbyPage;
