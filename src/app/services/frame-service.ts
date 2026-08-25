import {inject, Service, Signal, signal} from '@angular/core';
import {GameRuleService} from './game-rule-service';
import {Frame} from '../models/bowling-models';

@Service()
export class FrameService {
  private gameRuleService = inject(GameRuleService);

  private gameIsOver = signal(false);
  private currentFrameIndex = signal(0);
  readonly allFrames = signal<Frame[]>(this.getInitialFrames());

  private getInitialFrames(): Frame[] {
    return [
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(),
      this.getNewFrame(true),
    ];
  }

  private getNewFrame(isLastFrame = false): Frame {
    return {rule: "default", rolls: [], isLast: isLastFrame};
  }

  resetGame() {
    this.allFrames.set(this.getInitialFrames());
    this.currentFrameIndex.set(0);
    this.gameIsOver.set(false);
  }

  roll(pins: number | null) {
    if (this.gameIsOver()) {
      throw new Error('Game is over. Reset the game')
    }

    if (!pins && pins !== 0) {
      throw new Error('Invalid pins input')
    }

    if (pins < 0 || pins > 10) {
      throw new Error('Invalid pins amount. Min 0, max 10 pins');
    }

    const currentFrame = this.allFrames()[this.currentFrameIndex()]
    if (this.gameRuleService.framePinAmountExceeded(currentFrame, pins)){
      throw new Error('Pin amount exceeded');
    }

    this.updateFrames(pins);
  }

  private updateFrames(pins: number) {
    this.allFrames.update(frames => {
      const currentFrameIndex = this.currentFrameIndex();

      const updatedFrame = this.updateFrame(frames[currentFrameIndex], pins);

      const isFrameCompleted = this.gameRuleService.isFrameCompleted(updatedFrame);
      if (isFrameCompleted) {
        if (!updatedFrame.isLast) {
          this.increaseCurrentFrameIndex();
        } else {
          this.gameIsOver.set(true);
        }
      }

      return frames.map((frame, arrayIndex) => {
        if (arrayIndex === currentFrameIndex) {
          return updatedFrame
        }
        return frame;
      });
    })
  }

  private increaseCurrentFrameIndex(){
    this.currentFrameIndex.set(this.currentFrameIndex() + 1);
  }

  private updateFrame(frame: Frame, pins: number): Frame {
    return {
      ...frame,
      rule: this.gameRuleService.getFrameRule(frame, pins),
      rolls: [...frame.rolls, pins]
    };
  }

  getGameIsOver(): Signal<boolean> {
    return this.gameIsOver.asReadonly();
  }
}
