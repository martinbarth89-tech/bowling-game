import { Service } from '@angular/core';
import {Frame} from '../models/bowling-models';

@Service()
export class ScoreCalculationService {

  calculateScoreForAllFrames(frames: Frame[]): Frame[] {
    return frames.map((frame, index) => {
      frame.sum = this.calculateScoreForFrame(frames, index);
      return {...frame};
    });
  }

  calculateSum(points: number[]): number {
    return points.reduce((acc, curr) => acc + curr, 0);
  }

  private calculateScoreForFrame(frames: Frame[], targetFrameIndex: number): number | undefined {
    const targetFrame = frames[targetFrameIndex];

    if (targetFrame.rolls.length === 0) {
      return undefined;
    }

    const frameRollsSum = this.calculateSum(targetFrame.rolls);
    const previousScoreSum = this.getPreviousScoreSum(frames, targetFrameIndex);
    const finalFrameScore = frameRollsSum + previousScoreSum;

    switch (targetFrame.rule) {
      case 'strike':
        const strikeBonus = this.calculateBonus(frames, targetFrameIndex, 2);
        return finalFrameScore + strikeBonus;
      case 'spare':
        const spareBonus = this.calculateBonus(frames, targetFrameIndex, 1);
        return finalFrameScore + spareBonus;
      default:
        return finalFrameScore;
    }
  }

  private calculateBonus(frames: Frame[], targetFrameIndex: number, bonusRolls: number): number {
    const allFollowingRolls = this.getAllFollowingRolls(frames, targetFrameIndex);
    const nextTwoRolls = allFollowingRolls.slice(0, bonusRolls);
    return this.calculateSum(nextTwoRolls);
  }

  private getAllFollowingRolls(frames: Frame[], targetFrameIndex: number) {
    return frames.slice(targetFrameIndex + 1).flatMap(frames => frames.rolls);
  }

  private getPreviousScoreSum(frames: Frame[], targetFrameIndex: number) {
    if (targetFrameIndex <= 0) {
      return 0;
    }

    return frames[targetFrameIndex - 1]?.sum ?? 0;
  }
}
