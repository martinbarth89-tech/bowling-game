import {Component, inject, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Scoreboard} from './components/scoreboard/scoreboard';
import {FrameService} from './services/frame-service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-root',
  imports: [MatButton, Scoreboard, ReactiveFormsModule, MatFormField, MatLabel, MatInput],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  frameService = inject(FrameService);
  buttonsArray: number[] = [...Array(11).keys()];
  rollInput = new FormControl<number>(0);
  showError = signal<string | null>(null);

  roll(pins: number | null) {
    const rollResult = this.frameService.roll(pins);

    if (rollResult.success) {
      this.showError.set(null);
    } else {
      this.showError.set(rollResult.message || '');
    }
  }

  resetGame() {
    this.frameService.resetGame();
  }
}
