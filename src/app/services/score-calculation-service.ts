import { Service } from '@angular/core';
import {Frame} from '../models/bowling-models';

@Service()
export class ScoreCalculationService {

  calculateScoreForAllFrames(frames: Frame[]): Frame[] {
    const updatedFrames: Frame[] = [];

    for (let index = 0; index < frames.length; index++) {
      const frame = frames[index];
      const previousFrameScore = this.getPreviousScoreSum(updatedFrames, index);
      const frameScore = this.calculateScoreForFrame(frames, index);
      const frameScoreSum = frameScore === undefined ? undefined : previousFrameScore + frameScore;

      updatedFrames.push({
        ...frame,
        sum: frameScoreSum
      });
    }

    return updatedFrames;
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

    switch (targetFrame.type) {
      case 'strike':
        const strikeBonus = this.calculateBonus(frames, targetFrameIndex, 2);
        return frameRollsSum + strikeBonus;
      case 'spare':
        const spareBonus = this.calculateBonus(frames, targetFrameIndex, 1);
        return frameRollsSum + spareBonus;
      default:
        return frameRollsSum;
    }
  }

  private calculateBonus(frames: Frame[], targetFrameIndex: number, bonusRolls: number): number {
    const allFollowingRolls = this.getAllFollowingRolls(frames, targetFrameIndex);
    const nextBonusRolls = allFollowingRolls.slice(0, bonusRolls);
    return this.calculateSum(nextBonusRolls);
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
