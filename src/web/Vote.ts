export const VoteValues = [1, 2, 3, 5, 8, 13, 21, 'Infinity'] as const;
export type Vote = typeof VoteValues[number];
