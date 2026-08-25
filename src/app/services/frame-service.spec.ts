import { TestBed } from '@angular/core/testing';
import { FrameService } from './frame-service';
import { GameRuleService } from './game-rule-service';
import { ScoreCalculationService } from './score-calculation-service';

describe('FrameService', () => {
  let service: FrameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FrameService,
        GameRuleService,
        ScoreCalculationService
      ]
    });
    service = TestBed.inject(FrameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with 10 frames', () => {
      const frames = service.frames();
      expect(frames.length).toBe(10);
    });

    it('should set first 9 frames as isLast=false and 10th as isLast=true', () => {
      const frames = service.frames();
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
      expect(service.getGameIsOver()()).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset frames, scores, and gameCompleted state', () => {
      service.roll(10);
      service.roll(5);
      service.roll(3);

      service.resetGame();

      const frames = service.frames();
      expect(frames.length).toBe(10);
      expect(frames[0].rolls).toEqual([]);
      expect(frames[0].type).toBe('open');
      expect(frames[0].sum).toBeUndefined();
      expect(service.getGameIsOver()()).toBe(false);
    });
  });

  describe('Input Validation on roll()', () => {
    it('should reject null input', () => {
      const result = service.roll(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid input.');
    });

    it('should accept 0 pins (gutter ball)', () => {
      const result = service.roll(0);
      expect(result.success).toBe(true);
      expect(service.frames()[0].rolls).toEqual([0]);
    });

    it('should reject negative pin values', () => {
      const result = service.roll(-1);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid pins amount. Min 0, max 10 pins');
    });

    it('should reject pin values greater than 10', () => {
      const result = service.roll(11);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid pins amount. Min 0, max 10 pins');
    });

    it('should reject second roll if frame pin sum exceeds 10 in standard frame', () => {
      service.roll(6);
      const result = service.roll(5);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Pin amount exceeded');
      expect(service.frames()[0].rolls).toEqual([6]);
    });
  });

  describe('Frame Progression in Standard Frames (1st to 9th)', () => {
    it('should advance to next frame after two open rolls', () => {
      service.roll(3);
      service.roll(4);

      expect(service.frames()[0].rolls).toEqual([3, 4]);
      expect(service.frames()[0].type).toBe('open');

      service.roll(5);
      expect(service.frames()[1].rolls).toEqual([5]);
    });

    it('should advance to next frame immediately on a strike', () => {
      const result = service.roll(10);

      expect(result.success).toBe(true);
      expect(service.frames()[0].rolls).toEqual([10]);
      expect(service.frames()[0].type).toBe('strike');

      service.roll(4);
      expect(service.frames()[1].rolls).toEqual([4]);
    });

    it('should advance to next frame after a spare', () => {
      service.roll(7);
      service.roll(3);

      expect(service.frames()[0].rolls).toEqual([7, 3]);
      expect(service.frames()[0].type).toBe('spare');

      service.roll(6);
      expect(service.frames()[1].rolls).toEqual([6]);
    });
  });

  describe('10th Frame and Game Completion', () => {
    const playToTenthFrame = () => {
      for (let i = 0; i < 18; i++) {
        service.roll(0);
      }
    };

    it('should complete game after 2 rolls in 10th frame if open frame', () => {
      playToTenthFrame();

      expect(service.getGameIsOver()()).toBe(false);

      service.roll(3);
      expect(service.getGameIsOver()()).toBe(false);

      service.roll(4);
      expect(service.getGameIsOver()()).toBe(true);
      expect(service.frames()[9].rolls).toEqual([3, 4]);

      const extraRoll = service.roll(5);
      expect(extraRoll.success).toBe(false);
      expect(extraRoll.message).toBe('Game is over. Reset the game.');
    });

    it('should allow 3rd bonus roll in 10th frame after a spare', () => {
      playToTenthFrame();

      service.roll(6);
      service.roll(4);
      expect(service.getGameIsOver()()).toBe(false);
      expect(service.frames()[9].type).toBe('spare');

      service.roll(8);
      expect(service.getGameIsOver()()).toBe(true);
      expect(service.frames()[9].rolls).toEqual([6, 4, 8]);
    });

    it('should allow 2 bonus rolls in 10th frame after a strike', () => {
      playToTenthFrame();

      service.roll(10);
      expect(service.getGameIsOver()()).toBe(false);
      expect(service.frames()[9].type).toBe('strike');

      service.roll(10);
      expect(service.getGameIsOver()()).toBe(false);

      service.roll(10);
      expect(service.getGameIsOver()()).toBe(true);
      expect(service.frames()[9].rolls).toEqual([10, 10, 10]);
    });
  });

  describe('Complete Game Simulations', () => {
    it('should correctly simulate a Perfect Game (300 points)', () => {
      for (let i = 0; i < 12; i++) {
        const result = service.roll(10);
        expect(result.success).toBe(true);
      }

      expect(service.getGameIsOver()()).toBe(true);
      const frames = service.frames();
      expect(frames.map(f => f.sum)).toEqual([
        30, 60, 90, 120, 150, 180, 210, 240, 270, 300
      ]);
    });

    it('should correctly simulate a Gutter Game (0 points)', () => {
      for (let i = 0; i < 20; i++) {
        const result = service.roll(0);
        expect(result.success).toBe(true);
      }

      expect(service.getGameIsOver()()).toBe(true);
      const frames = service.frames();
      expect(frames[9].sum).toBe(0);
    });

    it('should correctly simulate a typical mixed game', () => {
      // Frame 1: Strike -> [10]
      service.roll(10);
      // Frame 2: Spare -> [7, 3]
      service.roll(7);
      service.roll(3);
      // Frame 3: Open -> [9, 0]
      service.roll(9);
      service.roll(0);
      // Frame 4: Strike -> [10]
      service.roll(10);
      // Frame 5: Strike -> [10]
      service.roll(10);
      // Frame 6: Open -> [0, 8]
      service.roll(0);
      service.roll(8);
      // Frame 7: Spare -> [8, 2]
      service.roll(8);
      service.roll(2);
      // Frame 8: Open -> [0, 6]
      service.roll(0);
      service.roll(6);
      // Frame 9: Strike -> [10]
      service.roll(10);
      // Frame 10: Strike + Spare -> [10, 6, 4]
      service.roll(10);
      service.roll(6);
      service.roll(4);

      expect(service.getGameIsOver()()).toBe(true);
      const frames = service.frames();
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
