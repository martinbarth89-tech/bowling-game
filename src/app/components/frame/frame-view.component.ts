import {Component, input} from '@angular/core';
import {JsonPipe} from '@angular/common';

@Component({
  imports: [
    JsonPipe
  ],
  selector: 'app-frame-view',
  styleUrl: './frame-view.component.css',
  templateUrl: './frame-view.component.html',
})
export class FrameView {
  frame = input.required<Frame>()
}

export interface Frame {
  rolls: number[];
  rule: GameRule;
  isLast: boolean;
}

export type GameRule = 'default' | 'spare' | 'strike';
