import {inject, Service} from '@angular/core';
import {Frame, GameRule} from '../models/bowling-models';
import {ScoreCalculationService} from './score-calculation-service';

@Service()
export class GameRuleService {
  private scoreCalculationService = inject(ScoreCalculationService);
  readonly maxPinAmount: number = 10;

  getFrameRule(frame: Frame, pins: number): GameRule {
    const currentFrameSum: number = this.scoreCalculationService.calculateSum(frame.rolls);
    const maxPinAmount = this.calculateMaxPinAmount(frame)

    // if it's the last frame but with bonus roll, return the old frame rule
    if (this.isLastFrameWithBonusRoll(frame)) {
      return frame.rule
    }

    if (frame.rolls.length === 0 && pins === maxPinAmount) return 'strike';

    if (frame.rolls.length > 0 && currentFrameSum + pins === maxPinAmount) return 'spare';

    return 'default'
  }

  isFrameCompleted(frame: Frame): boolean {
    if (frame.isLast) {
      if ((frame.rule === 'strike' || frame.rule === 'spare') && frame.rolls.length < 3) {
        return false
      }

      return frame.rolls.length >= 2;
    } else {
      return frame.rule === 'strike' || frame.rolls.length === 2;
    }
  }

  framePinAmountExceeded(frame: Frame, pins: number): boolean {
    if (pins > this.maxPinAmount) {
      return true;
    }

    const maxPinAmount = this.calculateMaxPinAmount(frame);
    return this.scoreCalculationService.calculateSum(frame.rolls) + pins > maxPinAmount;
  }

  private calculateMaxPinAmount(frame: Frame) {
    if (this.isLastFrameWithBonusRoll(frame)) {
      return this.maxPinAmount * 3;
    }

    return this.maxPinAmount;
  }

  isLastFrameWithBonusRoll(frame: Frame): boolean {
    return frame.isLast && (frame.rule === 'spare' || frame.rule === 'strike')
  }
}

