export interface Frame {
  rolls: number[];
  rule: GameRule;
  isLast: boolean;
  sum?: number;
}

export type GameRule = 'open' | 'spare' | 'strike';

export interface RollResult {
  success: boolean;
  message?: string;
}
