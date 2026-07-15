import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    inject(Router)
      .events.pipe(
        filter(
          (e): e is NavigationStart | NavigationEnd =>
            e instanceof NavigationStart || e instanceof NavigationEnd,
        ),
      )
      .subscribe((e) => console.log(e.constructor.name, e.url));
  }
}
