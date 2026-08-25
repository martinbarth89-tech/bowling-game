export interface Frame {
  rolls: number[];
  rule: GameRule;
  isLast: boolean;
  sum?: number;
}

export type GameRule = 'default' | 'spare' | 'strike';
