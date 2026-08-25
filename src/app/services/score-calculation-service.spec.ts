import { TestBed } from '@angular/core/testing';
import { ScoreCalculationService } from './score-calculation-service';
import { Frame } from '../models/bowling-models';

describe('ScoreCalculationService', () => {
  let service: ScoreCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreCalculationService]
    });
    service = TestBed.inject(ScoreCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateSum', () => {
    it('should return 0 for an empty array', () => {
      expect(service.calculateSum([])).toBe(0);
    });

    it('should calculate the sum of numbers correctly', () => {
      expect(service.calculateSum([3, 5, 2])).toBe(10);
      expect(service.calculateSum([10])).toBe(10);
      expect(service.calculateSum([0, 0, 0])).toBe(0);
    });
  });

  describe('calculateScoreForAllFrames', () => {
    const createEmptyFrames = (): Frame[] => [
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: false },
      { rolls: [], type: 'open', isLast: true },
    ];

    it('should return undefined sum for frames with no rolls', () => {
      const frames = createEmptyFrames();
      const result = service.calculateScoreForAllFrames(frames);

      expect(result.length).toBe(10);
      result.forEach(frame => {
        expect(frame.sum).toBeUndefined();
      });
    });

    it('should calculate score for open frames without strikes or spares', () => {
      const frames = createEmptyFrames();
      frames[0] = { rolls: [3, 4], type: 'open', isLast: false };
      frames[1] = { rolls: [2, 5], type: 'open', isLast: false };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[0].sum).toBe(7);
      expect(result[1].sum).toBe(14);
      expect(result[2].sum).toBeUndefined();
    });

    it('should calculate. Sum is 0', () => {
      const frames: Frame[] = [
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: false },
        { rolls: [0, 0], type: 'open', isLast: true },
      ];

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[9].sum).toBe(0);
      result.forEach(frame => {
        expect(frame.sum).toBe(0);
      });
    });

    it('should calculate score with a spare (adds next single roll)', () => {
      const frames = createEmptyFrames();
      frames[0] = { rolls: [6, 4], type: 'spare', isLast: false };
      frames[1] = { rolls: [5, 2], type: 'open', isLast: false };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[0].sum).toBe(15);
      expect(result[1].sum).toBe(22);
    });

    it('should calculate score with a strike (adds next two rolls)', () => {
      const frames = createEmptyFrames();
      frames[0] = { rolls: [10], type: 'strike', isLast: false };
      frames[1] = { rolls: [3, 6], type: 'open', isLast: false };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[0].sum).toBe(19);
      expect(result[1].sum).toBe(28);
    });

    it('should calculate strikes in a row', () => {
      const frames = createEmptyFrames();
      frames[0] = { rolls: [10], type: 'strike', isLast: false };
      frames[1] = { rolls: [10], type: 'strike', isLast: false };
      frames[2] = { rolls: [4, 2], type: 'open', isLast: false };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[0].sum).toBe(24);
      expect(result[1].sum).toBe(40);
      expect(result[2].sum).toBe(46);
    });

    it('should calculate 12 strikes to 300 points', () => {
      const frames: Frame[] = [
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10], type: 'strike', isLast: false },
        { rolls: [10, 10, 10], type: 'strike', isLast: true },
      ];

      const result = service.calculateScoreForAllFrames(frames);

      expect(result.map(f => f.sum)).toEqual([
        30, 60, 90, 120, 150, 180, 210, 240, 270, 300
      ]);
    });

    it('should calculate an all-spares game to 150 points', () => {
      const frames: Frame[] = [
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5], type: 'spare', isLast: false },
        { rolls: [5, 5, 5], type: 'spare', isLast: true },
      ];

      const result = service.calculateScoreForAllFrames(frames);

      expect(result.map(f => f.sum)).toEqual([
        15, 30, 45, 60, 75, 90, 105, 120, 135, 150
      ]);
    });

    it('should correctly calculate 10th frame with spare and bonus roll', () => {
      const frames = createEmptyFrames();
      frames[8] = { rolls: [3, 4], type: 'open', isLast: false };
      frames[9] = { rolls: [7, 3, 8], type: 'spare', isLast: true };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[8].sum).toBe(7);
      expect(result[9].sum).toBe(25);
    });

    it('should correctly calculate 10th frame with strike and bonus rolls', () => {
      const frames = createEmptyFrames();
      frames[8] = { rolls: [5, 3], type: 'open', isLast: false };
      frames[9] = { rolls: [10, 4, 3], type: 'strike', isLast: true };

      const result = service.calculateScoreForAllFrames(frames);

      expect(result[8].sum).toBe(8);
      expect(result[9].sum).toBe(25);
    });
  });
});
