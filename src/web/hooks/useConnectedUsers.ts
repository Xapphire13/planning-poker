import { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import {
  SessionUsersWithConnectionStatus,
  SessionUsersWithConnectionStatusVariables,
  ConnectionStatusChanged,
  ConnectionStatusChangedVariables,
  PersonDisconnected,
  PersonDisconnectedVariables,
  SessionUsersWithConnectionStatus_session_users,
} from ':__generated__/graphql';
import nonNull from ':web/utils/nonNull';
import PERSON_DISCONNECTED_SUBSCRIPTION from ':web/graphql/PersonDisconnectedSubscription';

const SESSION_USERS_WITH_CONNECTION_STATUS_QUERY = gql`
  query SessionUsersWithConnectionStatus($sessionId: String!) {
    session(sessionId: $sessionId) {
      users {
        id
        name
        connectionStatus
      }
    }
  }
`;

const CONNECTION_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription ConnectionStatusChanged($sessionId: String!) {
    updatedStatus: connectionStatusChanged(sessionId: $sessionId) {
      id
      name
      connectionStatus
    }
  }
`;

export default function useConnectedUsers(sessionId: string | undefined) {
  const [users, setUsers] = useState<
    SessionUsersWithConnectionStatus_session_users[]
  >([]);
  const [
    triggerQuery,
    { data: sessionUsersData, subscribeToMore },
  ] = useLazyQuery<
    SessionUsersWithConnectionStatus,
    SessionUsersWithConnectionStatusVariables
  >(SESSION_USERS_WITH_CONNECTION_STATUS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (sessionId) {
      triggerQuery({ variables: { sessionId } });
    }
  }, [sessionId, triggerQuery]);

  useEffect(() => {
    setUsers(sessionUsersData?.session?.users?.filter(nonNull) ?? []);
  }, [sessionUsersData]);

  useEffect(() => {
    if (sessionId && subscribeToMore) {
      subscribeToMore<
        ConnectionStatusChanged,
        ConnectionStatusChangedVariables
      >({
        document: CONNECTION_STATUS_CHANGED_SUBSCRIPTION,
        variables: {
          sessionId,
        },
        updateQuery: (prev, { subscriptionData }) => {
          const user = subscriptionData.data.updatedStatus;

          setUsers((currentUsers) => {
            if (user) {
              if (currentUsers.some(({ id }) => id === user.id)) {
                return currentUsers.map((it) => {
                  if (it.id !== user.id) return it;

                  return user;
                });
              }
              return [...currentUsers, user];
            }

            return currentUsers;
          });

          return prev;
        },
      });

      subscribeToMore<PersonDisconnected, PersonDisconnectedVariables>({
        document: PERSON_DISCONNECTED_SUBSCRIPTION,
        variables: { sessionId },
        updateQuery: (prev, { subscriptionData }) => {
          setUsers((currentUsers) => {
            const ids =
              subscriptionData.data.users
                ?.filter(nonNull)
                .reduce<Record<string, boolean>>((agg, { id }) => {
                  // eslint-disable-next-line no-param-reassign
                  agg[id] = true;

                  return agg;
                }, {}) ?? {};

            return currentUsers.filter(({ id }) => ids[id]);
          });

          return prev;
        },
      });
    }
  }, [sessionId, subscribeToMore]);

  return users;
}
