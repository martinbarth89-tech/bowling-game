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

  describe('getFrameRule - 1st-9th frames (strike, spare, default)', () => {
    it('should complete with first roll: pins < 10 -> default', () => {
      const frame: Frame = { rolls: [], rule: 'default', isLast: false };
      const pins = 6;
      expect(service.getFrameRule(frame, pins)).toBe('default');
    });

    it('should complete with two rolls: pins < 10 -> default', () => {
      const frame: Frame = { rolls: [6], rule: 'default', isLast: false };
      const pins = 3;
      expect(service.getFrameRule(frame, pins)).toBe('default');
    });

    it('should complete with two rolls: pins === 10 -> spare', () => {
      const frame: Frame = { rolls: [6], rule: 'default', isLast: false };
      const pins = 4;
      expect(service.getFrameRule(frame, pins)).toBe('spare');
    });

    it('should complete with one roll: pins === 10 -> strike', () => {
      const frame: Frame = { rolls: [], rule: 'default', isLast: false };
      const pins = 10;
      expect(service.getFrameRule(frame, pins)).toBe('strike');
    });
  });
  describe('getFrameRule - 10th frames (strike, spare, default)', () => {
    it('should complete with first roll: pins < 10 -> default', () => {
      const frame: Frame = { rolls: [], rule: 'default', isLast: true };
      const pins = 6;
      expect(service.getFrameRule(frame, pins)).toBe('default');
    });

    it('should complete with first roll: pins === 10 -> strike', () => {
      const frame: Frame = { rolls: [], rule: 'default', isLast: true };
      const pins = 10;
      expect(service.getFrameRule(frame, pins)).toBe('strike');
    });

    it('should complete with two rolls: pins < 10 -> default', () => {
      const frame: Frame = { rolls: [6], rule: 'default', isLast: true };
      const pins = 3;
      expect(service.getFrameRule(frame, pins)).toBe('default');
    });

    it('should complete with two rolls: pins === 10 -> spare', () => {
      const frame: Frame = { rolls: [6], rule: 'default', isLast: true };
      const pins = 4;
      expect(service.getFrameRule(frame, pins)).toBe('spare');
    });

    it('should complete, rule should stay -> spare', () => {
      const frame: Frame = { rolls: [6, 4], rule: 'spare', isLast: true };
      const pins = 10;
      expect(service.getFrameRule(frame, pins)).toBe('spare');
    });

    it('should complete, rule should stay -> strike', () => {
      const frame: Frame = { rolls: [10, 10], rule: 'strike', isLast: true };
      const pins = 10;
      expect(service.getFrameRule(frame, pins)).toBe('strike');
    });
  });

  describe('isFrameCompleted - 1st-9th frames', () => {
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
  describe('isFrameCompleted - 10th frame', () => {
    it('should not complete after 1 roll even if strike', () => {
      const frame: Frame = { rolls: [10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should not complete after 1 roll (regular)', () => {
      const frame: Frame = { rolls: [5], rule: 'default', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 2 rolls if open frame. no strike, no spare', () => {
      const frame: Frame = { rolls: [3, 5], rule: 'default', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });

    it('should not complete after 2 rolls if spare. entitled to 3rd bonus roll.', () => {
      const frame: Frame = { rolls: [4, 6], rule: 'spare', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);

      it('should complete after 3 rolls. spare and bonus', () => {
        const frame: Frame = { rolls: [5, 5, 8], rule: 'spare', isLast: true };
        expect(service.isFrameCompleted(frame)).toBe(true);
      })
    });

    it('should not complete after 2 rolls if strike in first roll.', () => {
      const frame: Frame = { rolls: [10, 10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(false);
    });

    it('should complete after 3 rolls. 3 strikes', () => {
      const frame: Frame = { rolls: [10, 10, 10], rule: 'strike', isLast: true };
      expect(service.isFrameCompleted(frame)).toBe(true);
    });


  });

});
