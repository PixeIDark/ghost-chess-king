import { useLobbyUsers } from "@/pages/lobby/components/LobbyUserList/hooks/useLobbyUsers.ts";

function LobbyUserList() {
  const users = useLobbyUsers();

  return (
    <div className="w-64 rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h2 className="mb-4 text-lg font-bold text-white">접속자 ({users.length})</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.odId} className="flex items-center justify-between text-gray-300">
            <span>{user.nickname}</span>
            {user.inGame && <span className="text-xs text-yellow-500">게임중</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LobbyUserList;
