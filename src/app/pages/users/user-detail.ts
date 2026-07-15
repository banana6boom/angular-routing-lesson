import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  edit() {
    // команды без ведущего «/» — навигация относительно текущего роута
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
