import gql from 'graphql-tag';

const PERSON_DISCONNECTED_SUBSCRIPTION = gql`
  subscription PersonDisconnected($sessionId: String!) {
    users: personDisconnected(sessionId: $sessionId) {
      id
    }
  }
`;

export default PERSON_DISCONNECTED_SUBSCRIPTION;
