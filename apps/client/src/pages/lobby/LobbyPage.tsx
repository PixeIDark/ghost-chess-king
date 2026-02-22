import { LobbyUserList } from "@/pages/lobby/components/LobbyUserList";
import { LobbyChat } from "@/pages/lobby/components/LobbyChat";
import { LobbyGameStart } from "@/pages/lobby/components/LobbyGameStart";

// TODO: 게임 시작 버튼 클릭 시 진행중인 게임잇으면 이어하기와 새로하기 만들어보자
// 체스 클래스, 소켓핸들러, 서비스 리팩토링하기
function LobbyPage() {
  return (
    <div className="flex h-full min-h-0 gap-4 p-4">
      <LobbyUserList />
      <div className="flex w-96 flex-1 flex-col gap-4">
        <LobbyGameStart />
        <LobbyChat />
      </div>
    </div>
  );
}

export default LobbyPage;
