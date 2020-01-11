enum IpcChannel {
  VoteCast = 'vote-cast',
  GetConnectedCount = 'get-connected-count',
  GetConnectionInfo = 'get-connection-info',
  PersonConnected = 'person-connected',
  PersonDisconnected = 'person-disconnected',
  StartVoting = 'start-voting',
  GetResults = 'get-results',
  ConnectNgrok = 'connect-ngrok',
  DisconnectNgrok = 'disconnect-ngrok'
}

export default IpcChannel;
