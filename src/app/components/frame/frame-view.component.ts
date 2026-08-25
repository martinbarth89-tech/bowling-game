import {Component, input} from '@angular/core';
import {Frame} from '../../models/bowling-models';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-frame-view',
  styleUrl: './frame-view.component.css',
  templateUrl: './frame-view.component.html',
  imports: [
    JsonPipe
  ]
})
export class FrameView {
  frame = input.required<Frame>()
}
