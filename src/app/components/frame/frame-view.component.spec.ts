import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrameView } from './frame-view.component';

describe('Frame', () => {
  let component: FrameView;
  let fixture: ComponentFixture<FrameView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameView],
    }).compileComponents();

    fixture = TestBed.createComponent(FrameView);
    fixture.componentRef.setInput('frame', { rolls: [], type: 'open', isLast: false });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
