import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { USERS } from '../../shared/users';

@Component({
  selector: 'app-users',
  imports: [RouterLink],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  readonly users = USERS;
}
