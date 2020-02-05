import shortid from 'shortid';
import User from './models/user';

export default class Session {
  readonly sessionId: string;

  /** userId -> User */
  private userMap: Map<string, User> = new Map();

  /** userId -> vote */
  private voteMap: Map<string, string> = new Map();

  constructor() {
    this.sessionId = shortid();
  }

  get voteCount() {
    return this.voteMap.size;
  }

  get users() {
    return [...this.userMap.values()];
  }

  /** Returns `true` if the user hasn't already joined the session */
  join(user: User) {
    if (this.userMap.has(user.id)) {
      return false;
    }

    this.userMap.set(user.id, user);

    return true;
  }

  /** Returns `true` if the user was in the session before leaving */
  leave(userId: string) {
    if (!this.userMap.has(userId)) {
      return false;
    }

    this.userMap.delete(userId);
    this.voteMap.delete(userId);

    return true;
  }

  /** returns `true` if the user hasn't already voted */
  registerVote(userId: string, vote: string) {
    if (!this.userMap.has(userId)) {
      throw new Error('Must join session to vote');
    }

    if (this.voteMap.has(userId)) {
      return false;
    }

    this.voteMap.set(userId, vote);

    return true;
  }

  newRound() {
    this.voteMap.clear();
  }

  /** [userId, vote][] */
  results() {
    return [...this.voteMap.entries()];
  }

  hasUser(userId: string) {
    return this.userMap.has(userId);
  }
}
