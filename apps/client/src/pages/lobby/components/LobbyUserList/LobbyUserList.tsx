import { useLobbyUsers } from "@/pages/lobby/components/LobbyUserList/hooks/useLobbyUsers.ts";
import { useSocket, useUserInfo } from "@/contexts/SessionContext.tsx";

function LobbyUserList() {
  const { users } = useLobbyUsers();
  const socket = useSocket();
  const myInfo = useUserInfo();

  const handleChallengePlayer = (odId: string) => {
    socket.emit("challenge-player", odId);
  };

  return (
    <div className="w-64 rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h2 className="mb-4 text-lg font-bold text-white">접속자 ({users.length})</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <button
            key={user.odId}
            disabled={user.odId === myInfo.odId || user.inGame}
            onClick={() => handleChallengePlayer(user.odId)}
            className="flex cursor-alias items-center justify-between text-gray-300 disabled:cursor-not-allowed"
          >
            <span>{user.nickname}</span>
            {user.inGame && <span className="text-xs text-yellow-500">게임중</span>}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default LobbyUserList;
