import {inject, Service, Signal, signal} from '@angular/core';
import {Frame} from '../components/frame/frame-view.component';
import {GameRuleService} from './game-rule-service';

@Service()
export class FrameService {
  private currentFrameIndex = signal(0);
  private readonly maxFrames = 10;
  private gameRuleService = inject(GameRuleService);

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
  }

  roll(pins: number | null) {
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

    this.updateFramesSignal(pins);
  }

  private updateFramesSignal(pins: number) {
    this.allFrames.update(frames => {
      const currentFrameIndex = this.currentFrameIndex();

      const updatedFrames = frames.map((frame, arrayIndex) => {
        if (arrayIndex === currentFrameIndex) {
          const updatedFrame = {
            ...frame,
            rule: this.gameRuleService.getFrameRule(frame, pins),
            rolls: [...frame.rolls, pins]
          };

          if (this.gameRuleService.isFrameCompleted(updatedFrame)) {
            this.currentFrameIndex.set(currentFrameIndex + 1);
          }

          return updatedFrame
        }
        return frame;
      });

      return updatedFrames;
    })
  }
}
