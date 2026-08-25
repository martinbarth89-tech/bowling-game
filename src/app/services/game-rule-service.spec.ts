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

  describe('getFrameType - 1st-9th frames (strike, spare, open)', () => {
    it('should complete with first roll: pins < 10 -> open', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: false };
      const pins = 6;
      expect(service.getFrameType(frame, pins)).toBe('open');
    });

    it('should complete with two rolls: pins < 10 -> open', () => {
      const frame: Frame = { rolls: [6], type: 'open', isLast: false };
      const pins = 3;
      expect(service.getFrameType(frame, pins)).toBe('open');
    });

    it('should complete with two rolls: pins === 10 -> spare', () => {
      const frame: Frame = { rolls: [6], type: 'open', isLast: false };
      const pins = 4;
      expect(service.getFrameType(frame, pins)).toBe('spare');
    });

    it('should complete with one roll: pins === 10 -> strike', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: false };
      const pins = 10;
      expect(service.getFrameType(frame, pins)).toBe('strike');
    });
  });
  describe('getFrameType - 10th frames (strike, spare, open)', () => {
    it('should complete with first roll: pins < 10 -> open', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: true };
      const pins = 6;
      expect(service.getFrameType(frame, pins)).toBe('open');
    });

    it('should complete with first roll: pins === 10 -> strike', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: true };
      const pins = 10;
      expect(service.getFrameType(frame, pins)).toBe('strike');
    });

    it('should complete with two rolls: pins < 10 -> open', () => {
      const frame: Frame = { rolls: [6], type: 'open', isLast: true };
      const pins = 3;
      expect(service.getFrameType(frame, pins)).toBe('open');
    });

    it('should complete with two rolls: pins === 10 -> spare', () => {
      const frame: Frame = { rolls: [6], type: 'open', isLast: true };
      const pins = 4;
      expect(service.getFrameType(frame, pins)).toBe('spare');
    });

    it('should complete, type should stay -> spare', () => {
      const frame: Frame = { rolls: [6, 4], type: 'spare', isLast: true };
      const pins = 10;
      expect(service.getFrameType(frame, pins)).toBe('spare');
    });

    it('should complete, type should stay -> strike', () => {
      const frame: Frame = { rolls: [10, 10], type: 'strike', isLast: true };
      const pins = 10;
      expect(service.getFrameType(frame, pins)).toBe('strike');
    });
  });

  describe('isFrameCompleted - 1st-9th frames', () => {
    it('should complete on strike in first roll', () => {
      const frame: Frame = { rolls: [10], type: 'strike', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete on first roll if not strike', () => {
      const frame: Frame = { rolls: [4], type: 'open', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after two rolls (open frame)', () => {
      const frame: Frame = { rolls: [3, 4], type: 'open', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should complete after two rolls (spare)', () => {
      const frame: Frame = { rolls: [3, 7], type: 'spare', isLast: false };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });
  });
  describe('isFrameCompleted - 10th frame', () => {
    it('should not complete after 1 roll even if strike', () => {
      const frame: Frame = { rolls: [10], type: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should not complete after 1 roll (regular)', () => {
      const frame: Frame = { rolls: [5], type: 'open', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 2 rolls if open frame. no strike, no spare', () => {
      const frame: Frame = { rolls: [3, 5], type: 'open', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete after 2 rolls if spare. entitled to 3rd bonus roll.', () => {
      const frame: Frame = { rolls: [4, 6], type: 'spare', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 3 rolls. spare and bonus', () => {
      const frame: Frame = { rolls: [5, 5, 8], type: 'spare', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete after 2 rolls if strike in first roll.', () => {
      const frame: Frame = { rolls: [10, 10], type: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 3 rolls. 3 strikes', () => {
      const frame: Frame = { rolls: [10, 10, 10], type: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });
  });

  describe('framePinAmountExceeded - 1st-9th frames', () => {
    it('should return false when first roll pins <= 10', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: false };
      expect(service.framePinAmountExceeded(frame, 10)).toBe(false);
      expect(service.framePinAmountExceeded(frame, 5)).toBe(false);
    });

    it('should return true when first roll pins > 10', () => {
      const frame: Frame = { rolls: [], type: 'open', isLast: false };
      expect(service.framePinAmountExceeded(frame, 11)).toBe(true);
    });

    it('should return false when sum of rolls and pins <= 10', () => {
      const frame: Frame = { rolls: [4], type: 'open', isLast: false };
      expect(service.framePinAmountExceeded(frame, 6)).toBe(false);
      expect(service.framePinAmountExceeded(frame, 3)).toBe(false);
    });

    it('should return true when sum of rolls and pins > 10', () => {
      const frame: Frame = { rolls: [4], type: 'open', isLast: false };
      expect(service.framePinAmountExceeded(frame, 7)).toBe(true);
    });
  });

  describe('framePinAmountExceeded - 10th frame', () => {
    it('should return false when pins <= 10 for open type in 10th frame', () => {
      const frame: Frame = { rolls: [4], type: 'open', isLast: true };
      expect(service.framePinAmountExceeded(frame, 6)).toBe(false);
    });

    it('should return true when pins > 10 for open type in 10th frame', () => {
      const frame: Frame = { rolls: [4], type: 'open', isLast: true };
      expect(service.framePinAmountExceeded(frame, 7)).toBe(true);
    });

    it('should allow up to 30 pins in total for strike in 10th frame', () => {
      const frame: Frame = { rolls: [10, 10], type: 'strike', isLast: true };
      expect(service.framePinAmountExceeded(frame, 10)).toBe(false);
      expect(service.framePinAmountExceeded(frame, 11)).toBe(true);
    });

    it('should allow up to 30 pins in total for spare in 10th frame', () => {
      const frame: Frame = { rolls: [5, 5], type: 'spare', isLast: true };
      expect(service.framePinAmountExceeded(frame, 10)).toBe(false);
      expect(service.framePinAmountExceeded(frame, 20)).toBe(true);
      expect(service.framePinAmountExceeded(frame, 21)).toBe(true);
    });
  });

});
