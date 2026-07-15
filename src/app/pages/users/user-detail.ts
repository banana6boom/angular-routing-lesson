import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { USERS } from '../../shared/users';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  templateUrl: './user-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly users = USERS;
  // разные query у ссылок — потоки queryParamMap/tab оживают при переключении
  readonly tabs = ['posts', 'photos', 'likes'];

  // 1) снимок на момент создания: останется '1' навсегда (слайд 42)
  idOnce = this.route.snapshot.paramMap.get('id');

  // 2) реактивное значение: обновится без пересоздания компонента
  idFromStream = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));
  tabFromStream = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('tab'))));

  // 3) withComponentInputBinding: имена совпадают с :id из path и ?tab= (слайд 44)
  id = input.required<string>();
  tab = input<string>();

  // имя пользователя по id — чтобы переход users/1 → users/2 был нагляден
  user = computed(() => USERS.find((u) => String(u.id) === this.id()));

  edit() {
    // команды без ведущего «/» — навигация относительно текущего роута
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
