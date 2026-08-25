import {Component, inject} from '@angular/core';
import {Frame, FrameView} from '../frame/frame-view.component';
import {FrameService} from '../../services/frame-service';

@Component({
  imports: [
    FrameView
  ],
  selector: 'app-scoreboard',
  styleUrl: './scoreboard.css',
  templateUrl: './scoreboard.html',
})
export class Scoreboard {
  frameService = inject(FrameService);
}
