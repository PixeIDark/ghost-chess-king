import { LobbyUserList } from "@/pages/lobby/components/LobbyUserList";
import { LobbyChat } from "@/pages/lobby/components/LobbyChat";
import { LobbyGameStart } from "@/pages/lobby/components/LobbyGameStart";

function LobbyPage() {
  return (
    <div className="flex h-full gap-4 p-4">
      <LobbyUserList />
      <div className="flex w-96 flex-1 flex-col gap-4">
        <LobbyGameStart />
        <LobbyChat />
      </div>
    </div>
  );
}

export default LobbyPage;
