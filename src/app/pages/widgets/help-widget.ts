import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-widget',
  templateUrl: './help-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpWidget {
  private router = inject(Router);

  close() {
    // null очищает named outlet — сегмент (widget:help) исчезает из URL
    this.router.navigate([{ outlets: { widget: null } }]);
  }
}
