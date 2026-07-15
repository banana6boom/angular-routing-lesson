import { ChangeDetectionStrategy, Component } from '@angular/core';
import { USERS } from '../../shared/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  readonly users = USERS;
}
