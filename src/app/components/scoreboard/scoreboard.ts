import {Component, inject} from '@angular/core';
import {FrameService} from '../../services/frame-service';
import {FrameView} from '../frame/frame-view.component';

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
