import { useServerStatus } from "@/contexts/SessionContext.tsx";

function ServerStatus() {
  const { isConnected, isRegistered } = useServerStatus();
  const connectedText = isConnected ? "Connected" : "Disconnected";
  const registeredText = isRegistered ? "Registered" : "DisRegistered";

  return (
    <div className="flex flex-col items-center">
      <p>Server: {connectedText}</p>
      <p>User: {registeredText}</p>
    </div>
  );
}

export default ServerStatus;
