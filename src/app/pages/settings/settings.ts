import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private router = inject(Router);

  // источник для routerOutletData — сигнал: ребёнок увидит смену плана без пересоздания
  readonly plan = signal('Pro');

  togglePlan() {
    this.plan.update((p) => (p === 'Pro' ? 'Free' : 'Pro'));
  }

  openResetConfirm() {
    this.router.navigate([{ outlets: { modal: ['confirm'] } }]);
  }
}
