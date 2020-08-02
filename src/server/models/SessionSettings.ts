import VoteSequenceType from './VoteSequenceType';

export default interface SessionSettings {
  timeLimit: number;
  sequence: VoteSequenceType;
  colorHex: String;
}
