import {Component, input} from '@angular/core';
import {Frame} from '../../models/bowling-models';

@Component({
  selector: 'app-frame-view',
  styleUrl: './frame-view.component.css',
  templateUrl: './frame-view.component.html',
})
export class FrameView {
  frame = input.required<Frame>()
}
