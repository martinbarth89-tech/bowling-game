import { Service } from '@angular/core';
import {Frame, GameRule} from '../models/bowling-models';

@Service()
export class GameRuleService {
  readonly maxPinAmount: number = 10;

  getFrameRule(frame: Frame, pins: number): GameRule {
    const currentFrameSum: number = this.getFrameSum(frame);
    const maxPinAmount = this.calculateMaxPinAmount(frame)

    // if it's the last frame but with bonus roll, return the old frame rule
    if (this.isLastFrameWithBonus(frame)) {
      return frame.rule
    }

    if (frame.rolls.length === 0 && pins === maxPinAmount) return 'strike';

    if (frame.rolls.length > 0 && currentFrameSum + pins === maxPinAmount) return 'spare';

    return 'default'
  }

  isFrameCompleted(frame: Frame): boolean {
    if (!frame.isLast) {
      return frame.rule === 'strike' || frame.rolls.length === 2;
    }

    if (frame.rolls.length >= 3) {
      return true;
    }

    return frame.rolls.length === 2 && frame.rule === 'strike';
  }



  framePinAmountExceeded(frame: Frame, pins: number): boolean {
    const maxPinAmount = this.calculateMaxPinAmount(frame);
    return this.getFrameSum(frame) + pins > maxPinAmount;
  }

  private calculateMaxPinAmount(frame: Frame) {
    if (this.isLastFrameWithBonus(frame)) {
      return this.maxPinAmount * 2;
    }

    return this.maxPinAmount;
  }

  isLastFrameWithBonus(frame: Frame): boolean {
    return frame.isLast && (frame.rule === 'spare' || frame.rule === 'strike')
  }

  private getFrameSum(frame: Frame): number {
    return frame.rolls.reduce((acc, curr) => acc + curr, 0);
  }
}

