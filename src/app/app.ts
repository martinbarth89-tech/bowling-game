import {Component, inject} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Scoreboard} from './components/scoreboard/scoreboard';
import {FrameService} from './services/frame-service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [MatFormField, MatLabel, MatInput, MatButton, Scoreboard, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  frameService = inject(FrameService);
  rollInput = new FormControl<number>(0);

  roll() {
    this.frameService.roll(this.rollInput.value)
  }
}
