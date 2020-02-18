import shortid from 'shortid';
import User from './models/user';
import SessionState from './models/SessionState';

export default class Session {
  readonly sessionId: string;

  /** userId -> User */
  private userMap: Map<string, User> = new Map();

  /** userId -> vote */
  private voteMap: Map<string, string> = new Map();

  private _state: SessionState = SessionState.Waiting;

  constructor() {
    this.sessionId = shortid();
  }

  get voteCount() {
    return this.voteMap.size;
  }

  get users() {
    return [...this.userMap.values()];
  }

  get state() {
    return this._state;
  }

  getStateForUser(userId: string) {
    // If user isn't in the session, return the global session state
    if (!this.userMap.has(userId)) {
      return this.state;
    }

    // If the session is still in voting state but the current user has voted
    if (this.state === SessionState.Voting && this.voteMap.has(userId)) {
      return SessionState.Waiting;
    }

    return this.state;
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
    this._state = SessionState.Voting;
  }

  endRound() {
    this._state = SessionState.Waiting;
  }

  /**
   * Results are in the form -> [userId, vote][]
   */
  results() {
    return [...this.voteMap.entries()];
  }

  hasUser(userId: string) {
    return this.userMap.has(userId);
  }
}
