import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private router = inject(Router);

  close() {
    // null очищает именованный outlet — сегмент (modal:confirm) исчезает из URL
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
