import {inject, Service} from '@angular/core';
import {Frame, FrameType} from '../models/bowling-models';
import {ScoreCalculationService} from './score-calculation-service';

@Service()
export class GameRuleService {
  private scoreCalculationService = inject(ScoreCalculationService);
  readonly MAX_PIN_AMOUNT: number = 10;

  getFrameType(frame: Frame, pins: number): FrameType {
    const currentFrameSum: number = this.scoreCalculationService.calculateSum(frame.rolls);
    const maxPinAmount = this.calculateMaxPinAmount(frame)

    // if it's the last frame but with bonus roll, return the current frame rule
    if (this.isLastFrameWithBonusRoll(frame)) {
      return frame.type
    }

    if (frame.rolls.length === 0 && pins === maxPinAmount) return 'strike';

    if (frame.rolls.length > 0 && currentFrameSum + pins === maxPinAmount) return 'spare';

    return 'open'
  }

  isFrameCompleted(frame: Frame): boolean {
    if (frame.isLast) {
      if ((frame.type === 'strike' || frame.type === 'spare') && frame.rolls.length < 3) {
        return false
      }

      return frame.rolls.length >= 2;
    } else {
      return frame.type === 'strike' || frame.rolls.length === 2;
    }
  }

  framePinAmountExceeded(frame: Frame, pins: number): boolean {
    if (pins > this.MAX_PIN_AMOUNT) {
      return true;
    }

    const maxPinAmount = this.calculateMaxPinAmount(frame);
    return this.scoreCalculationService.calculateSum(frame.rolls) + pins > maxPinAmount;
  }

  private calculateMaxPinAmount(frame: Frame) {
    if (this.isLastFrameWithBonusRoll(frame)) {

      // this happens when in the 10th frame the second roll is not a strike
      if (frame.type === 'strike' && frame.rolls.length >= 2 && frame.rolls[1] < 10) {
        return this.MAX_PIN_AMOUNT * 2;
      }

      // this happens when in the 10th frame are just strikes
      return this.MAX_PIN_AMOUNT * 3;
    }

    return this.MAX_PIN_AMOUNT;
  }

  isLastFrameWithBonusRoll(frame: Frame): boolean {
    return frame.isLast && (frame.type === 'spare' || frame.type === 'strike')
  }
}

