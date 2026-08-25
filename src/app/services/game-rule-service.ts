import { Service } from '@angular/core';
import {Frame, GameRule} from '../components/frame/frame-view.component';

@Service()
export class GameRuleService {
  readonly maxPinAmount: number = 10;

  getFrameRule(frame: Frame, pins: number): GameRule {
    const currentFrameSum: number = this.getFrameSum(frame);

    if (frame.rolls.length === 0 && pins === this.maxPinAmount) return 'strike';

    if (frame.rolls.length > 0 && currentFrameSum + pins === this.maxPinAmount) return 'spare';

    return 'default'
  }

  isFrameCompleted(frame: Frame): boolean {
    if (!frame.isLast) {
      if (frame.rule === 'strike') {
        return true;
      }

      if (frame.rolls.length === 2) {
        return true;
      }
    }

    return false;
  }

  framePinAmountExceeded(frame: Frame, pins: number): boolean {
    return this.getFrameSum(frame) + pins > this.maxPinAmount;
  }

  private getFrameSum(frame: Frame): number {
    return frame.rolls.reduce((acc, curr) => acc + curr, 0);
  }
}

