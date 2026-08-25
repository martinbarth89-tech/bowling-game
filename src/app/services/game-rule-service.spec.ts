import { TestBed } from '@angular/core/testing';
import { GameRuleService } from './game-rule-service';
import { Frame } from '../models/bowling-models';

describe('GameRuleService', () => {
  let service: GameRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRuleService]
    });
    service = TestBed.inject(GameRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isFrameCompleted for normal frames (1-9)', () => {
    it('should complete on strike in first roll', () => {
      const frame: Frame = { rolls: [10], rule: 'strike', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete on first roll if not strike', () => {
      const frame: Frame = { rolls: [4], rule: 'default', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after two rolls (open frame)', () => {
      const frame: Frame = { rolls: [3, 4], rule: 'default', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should complete after two rolls (spare)', () => {
      const frame: Frame = { rolls: [3, 7], rule: 'spare', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });
  });

  describe('isFrameCompleted for 10th frame (isLast = true)', () => {
    it('should not complete after 1 roll even if strike', () => {
      const frame: Frame = { rolls: [10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should not complete after 1 roll (regular)', () => {
      const frame: Frame = { rolls: [5], rule: 'default', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 2 rolls if open frame (no strike, no spare)', () => {
      const frame: Frame = { rolls: [3, 5], rule: 'default', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete after 2 rolls if spare (entitled to 3rd bonus roll)', () => {
      const frame: Frame = { rolls: [4, 6], rule: 'spare', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should not complete after 2 rolls if strike in first roll (entitled to 3rd roll)', () => {
      const frame: Frame = { rolls: [10, 10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 3 rolls (e.g. 3 strikes)', () => {
      const frame: Frame = { rolls: [10, 10, 10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should complete after 3 rolls (spare + bonus)', () => {
      const frame: Frame = { rolls: [5, 5, 8], rule: 'spare', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });
  });
});
