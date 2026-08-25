import {inject, Service, Signal, signal} from '@angular/core';
import {GameRuleService} from './game-rule-service';
import {Frame} from '../models/bowling-models';
import {ScoreCalculationService} from './score-calculation-service';

@Service()
export class FrameService {
  private gameRuleService = inject(GameRuleService);
  private scoreCalculationService = inject(ScoreCalculationService);

  private gameCompleted = signal(false);
  private currentFrameIndex = signal(0);
  readonly frames = signal<Frame[]>(this.getInitialFrames());

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
    this.frames.set(this.getInitialFrames());
    this.currentFrameIndex.set(0);
    this.gameCompleted.set(false);
  }

  roll(pins: number | null) {
    if (this.gameCompleted()) throw new Error('Game is over. Reset the game.')

    if (!pins && pins !== 0) throw new Error('Invalid input.')

    if (pins < 0 || pins > 10) throw new Error('Invalid pins amount. Min 0, max 10 pins');

    const currentFrame = this.frames()[this.currentFrameIndex()]
    if (this.gameRuleService.framePinAmountExceeded(currentFrame, pins)){
      throw new Error('Pin amount exceeded');
    }

    this.updateFrameWithPins(pins);
  }

  private updateFrameWithPins(pins: number) {
    this.frames.update(frames => {
      const currentFrameIndex = this.currentFrameIndex();

      const updatedTargetFrame = this.updateFrame(frames[currentFrameIndex], pins);

      const isFrameCompleted = this.gameRuleService.isFrameCompleted(updatedTargetFrame);
      if (isFrameCompleted) {
        if (updatedTargetFrame.isLast) {
          this.gameCompleted.set(true);
        } else {
          this.nextFrame();
        }
      }

      let updatedFrames = frames.map((frame, arrayIndex) => {
        return arrayIndex === currentFrameIndex ? updatedTargetFrame : frame;
      });

      updatedFrames = this.scoreCalculationService.calculateScoreForAllFrames(updatedFrames);

      return updatedFrames
    })
  }

  private nextFrame(){
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
    return this.gameCompleted.asReadonly();
  }
}
