import { ConnectionStatus } from '../__generated__/graphql';

export default interface User {
  id: string;
  name: string;
}

export type UserWithConnectionStatus = User & {
  connectionStatus: ConnectionStatus;
};
