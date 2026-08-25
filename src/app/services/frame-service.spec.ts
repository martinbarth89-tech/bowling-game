import { TestBed } from '@angular/core/testing';
import { FrameService } from './frame-service';
import { GameRuleService } from './game-rule-service';
import { ScoreCalculationService } from './score-calculation-service';

describe('FrameService', () => {
  let frameService: FrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FrameService,
        GameRuleService,
        ScoreCalculationService
      ]
    });
    frameService = TestBed.inject(FrameService);
  });

  it('should be created', () => {
    expect(frameService).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with 10 frames', () => {
      const frames = frameService.frames();
      expect(frames.length).toBe(10);
    });

    it('should set first 9 frames as isLast=false and 10th as isLast=true', () => {
      const frames = frameService.frames();
      for (let i = 0; i < 9; i++) {
        expect(frames[i].isLast).toBe(false);
        expect(frames[i].type).toBe('open');
        expect(frames[i].rolls).toEqual([]);
      }
      expect(frames[9].isLast).toBe(true);
      expect(frames[9].type).toBe('open');
      expect(frames[9].rolls).toEqual([]);
    });

    it('should have gameCompleted as false initially', () => {
      expect(frameService.getGameIsOver()()).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset frames, scores, and gameCompleted state', () => {
      frameService.roll(10);
      frameService.roll(5);
      frameService.roll(3);

      frameService.resetGame();

      const frames = frameService.frames();
      expect(frames.length).toBe(10);
      expect(frames[0].rolls).toEqual([]);
      expect(frames[0].type).toBe('open');
      expect(frames[0].sum).toBeUndefined();
      expect(frameService.getGameIsOver()()).toBe(false);
    });
  });

  describe('Input Validation on roll()', () => {
    it('should reject null input', () => {
      const result = frameService.roll(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid input.');
    });

    it('should accept 0 pins (gutter ball)', () => {
      const result = frameService.roll(0);
      expect(result.success).toBe(true);
      expect(frameService.frames()[0].rolls).toEqual([0]);
    });

    it('should reject negative pin values', () => {
      const result = frameService.roll(-1);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid pins amount. Min 0, max 10 pins');
    });

    it('should reject pin values greater than 10', () => {
      const result = frameService.roll(11);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid pins amount. Min 0, max 10 pins');
    });

    it('should reject second roll if frame pin sum exceeds 10 in standard frame', () => {
      frameService.roll(6);
      const result = frameService.roll(5);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Pin amount exceeded');
      expect(frameService.frames()[0].rolls).toEqual([6]);
    });
  });

  describe('Frame Progression in Standard Frames (1st to 9th)', () => {
    it('should advance to next frame after two open rolls', () => {
      frameService.roll(3);
      frameService.roll(4);

      expect(frameService.frames()[0].rolls).toEqual([3, 4]);
      expect(frameService.frames()[0].type).toBe('open');

      frameService.roll(5);
      expect(frameService.frames()[1].rolls).toEqual([5]);
    });

    it('should advance to next frame immediately on a strike', () => {
      const result = frameService.roll(10);

      expect(result.success).toBe(true);
      expect(frameService.frames()[0].rolls).toEqual([10]);
      expect(frameService.frames()[0].type).toBe('strike');

      frameService.roll(4);
      expect(frameService.frames()[1].rolls).toEqual([4]);
    });

    it('should advance to next frame after a spare', () => {
      frameService.roll(7);
      frameService.roll(3);

      expect(frameService.frames()[0].rolls).toEqual([7, 3]);
      expect(frameService.frames()[0].type).toBe('spare');

      frameService.roll(6);
      expect(frameService.frames()[1].rolls).toEqual([6]);
    });
  });

  describe('10th Frame and Game Completion', () => {
    const playToTenthFrame = () => {
      for (let i = 0; i < 18; i++) {
        frameService.roll(0);
      }
    };

    it('should complete game after 2 rolls in 10th frame if open frame', () => {
      playToTenthFrame();

      expect(frameService.getGameIsOver()()).toBe(false);

      frameService.roll(3);
      expect(frameService.getGameIsOver()()).toBe(false);

      frameService.roll(4);
      expect(frameService.getGameIsOver()()).toBe(true);
      expect(frameService.frames()[9].rolls).toEqual([3, 4]);

      const extraRoll = frameService.roll(5);
      expect(extraRoll.success).toBe(false);
      expect(extraRoll.message).toBe('Game is over. Reset the game.');
    });

    it('should allow 3rd bonus roll in 10th frame after a spare', () => {
      playToTenthFrame();

      frameService.roll(6);
      frameService.roll(4);
      expect(frameService.getGameIsOver()()).toBe(false);
      expect(frameService.frames()[9].type).toBe('spare');

      frameService.roll(8);
      expect(frameService.getGameIsOver()()).toBe(true);
      expect(frameService.frames()[9].rolls).toEqual([6, 4, 8]);
    });

    it('should allow 2 bonus rolls in 10th frame after a strike', () => {
      playToTenthFrame();

      frameService.roll(10);
      expect(frameService.getGameIsOver()()).toBe(false);
      expect(frameService.frames()[9].type).toBe('strike');

      frameService.roll(10);
      expect(frameService.getGameIsOver()()).toBe(false);

      frameService.roll(10);
      expect(frameService.getGameIsOver()()).toBe(true);
      expect(frameService.frames()[9].rolls).toEqual([10, 10, 10]);
    });
  });

  describe('Complete Game Simulations', () => {
    it('should correctly simulate a Perfect Game (300 points)', () => {
      for (let i = 0; i < 12; i++) {
        const result = frameService.roll(10);
        expect(result.success).toBe(true);
      }

      expect(frameService.getGameIsOver()()).toBe(true);
      const frames = frameService.frames();
      expect(frames.map(f => f.sum)).toEqual([
        30, 60, 90, 120, 150, 180, 210, 240, 270, 300
      ]);
    });

    it('should correctly simulate a Gutter Game (0 points)', () => {
      for (let i = 0; i < 20; i++) {
        const result = frameService.roll(0);
        expect(result.success).toBe(true);
      }

      expect(frameService.getGameIsOver()()).toBe(true);
      const frames = frameService.frames();
      expect(frames[9].sum).toBe(0);
    });

    it('should cancel the roll. Game is over', () => {
      for (let i = 0; i < 21; i++) {
        const result = frameService.roll(0);

        if (i === 20) {
          expect(result.success).toBe(false);
        } else {
          expect(result.success).toBe(true);
        }
      }
    });

    it('should cancel the roll. Just 10 pins possible', () => {
      const result = frameService.roll(12);
      expect(result.success).toBe(false);
    });

    it('should cancel the roll. Min pin amount is 0', () => {
      const result = frameService.roll(-5);
      expect(result.success).toBe(false);
    });

    it('should cancel the roll. Invalid input', () => {
      const result = frameService.roll(null);
      expect(result.success).toBe(false);
    });

    it('should correctly simulate a typical mixed game', () => {
      // Frame 1: Strike -> [10]
      frameService.roll(10);
      // Frame 2: Spare -> [7, 3]
      frameService.roll(7);
      frameService.roll(3);
      // Frame 3: Open -> [9, 0]
      frameService.roll(9);
      frameService.roll(0);
      // Frame 4: Strike -> [10]
      frameService.roll(10);
      // Frame 5: Strike -> [10]
      frameService.roll(10);
      // Frame 6: Open -> [0, 8]
      frameService.roll(0);
      frameService.roll(8);
      // Frame 7: Spare -> [8, 2]
      frameService.roll(8);
      frameService.roll(2);
      // Frame 8: Open -> [0, 6]
      frameService.roll(0);
      frameService.roll(6);
      // Frame 9: Strike -> [10]
      frameService.roll(10);
      // Frame 10: Strike + Spare -> [10, 6, 4]
      frameService.roll(10);
      frameService.roll(6);
      frameService.roll(4);

      expect(frameService.getGameIsOver()()).toBe(true);
      const frames = frameService.frames();
      expect(frames[0].sum).toBe(20);  // 10 + 7 + 3
      expect(frames[1].sum).toBe(39);  // 20 + (7 + 3 + 9)
      expect(frames[2].sum).toBe(48);  // 39 + 9
      expect(frames[3].sum).toBe(68);  // 48 + (10 + 10 + 0)
      expect(frames[4].sum).toBe(86);  // 68 + (10 + 0 + 8)
      expect(frames[5].sum).toBe(94);  // 86 + 8
      expect(frames[6].sum).toBe(104); // 94 + (8 + 2 + 0)
      expect(frames[7].sum).toBe(110); // 104 + 6
      expect(frames[8].sum).toBe(136); // 110 + (10 + 10 + 6)
      expect(frames[9].sum).toBe(156); // 136 + (10 + 6 + 4)
    });
  });
});
