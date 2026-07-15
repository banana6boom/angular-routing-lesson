import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [Home],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
