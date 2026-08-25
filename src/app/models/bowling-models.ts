export interface Frame {
  rolls: number[];
  rule: GameRule;
  isLast: boolean;
}

export type GameRule = 'default' | 'spare' | 'strike';
