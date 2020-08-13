import VoteSequenceType from './VoteSequenceType';

export default interface SessionSettings {
  /** Time limit in seconds */
  timeLimit: number;
  /** Type of voting sequence */
  sequence: VoteSequenceType;
  /** Theme color in hex representation */
  colorHex: String;
}
