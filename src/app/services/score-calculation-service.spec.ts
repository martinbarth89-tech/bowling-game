import { TestBed } from '@angular/core/testing';
import { ScoreCalculationService } from './score-calculation-service';

describe('ScoreCalculationService', () => {
  let service: ScoreCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
