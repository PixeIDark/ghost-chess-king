import { LobbyUserList } from "@/pages/lobby/components/LobbyUserList";
import { LobbyChat } from "@/pages/lobby/components/LobbyChat";
import { LobbyGameStart } from "@/pages/lobby/components/LobbyGameStart";

// TODO: 게임 시작 버튼 클릭 시 진행중인 게임잇으면 이어하기와 새로하기 만들어보자
// 로비에서 채팅 치고, 게임페이지 갓다가 뒤로오면 채팅창 초기화됨. 서버에서 보관해야할듯
// 로비페이지 아니여도 어디서든 도전받으면 즉발 이동가능하게 컨텍스트로 감싸줘야할듯 아니면 useSocket에서 하든가
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
