import { useServerStatus } from "@/contexts/SessionContext.tsx";

const STATUS_CONFIG = {
  connected: { text: "Connected", color: "text-green-500" },
  disconnected: { text: "Disconnected", color: "text-red-500" },
  registered: { text: "Registered", color: "text-green-500" },
  unregistered: { text: "Unregistered", color: "text-red-500" },
} as const;

function ServerStatus() {
  const { isConnected, isRegistered } = useServerStatus();

  const connectionStatus = isConnected ? STATUS_CONFIG.connected : STATUS_CONFIG.disconnected;
  const registrationStatus = isRegistered ? STATUS_CONFIG.registered : STATUS_CONFIG.unregistered;

  return (
    <div className="flex flex-col items-center">
      <p>
        Server: <span className={connectionStatus.color}>{connectionStatus.text}</span>
      </p>
      <p>
        User: <span className={registrationStatus.color}>{registrationStatus.text}</span>
      </p>
    </div>
  );
}

export default ServerStatus;
