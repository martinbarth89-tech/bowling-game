export interface Frame {
  rolls: number[];
  type: FrameType;
  isLast: boolean;
  sum?: number;
}

export type FrameType = 'open' | 'spare' | 'strike';

export interface RollResult {
  success: boolean;
  message?: string;
}
