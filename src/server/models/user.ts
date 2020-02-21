import ConnectionStatus from './ConnectionStatus';

export default interface User {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
}
