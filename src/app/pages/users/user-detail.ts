import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {}
