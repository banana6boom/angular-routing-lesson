import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  // данные из input-свойства <router-outlet [routerOutletData]> родителя — реактивный сигнал
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ plan: string }>;
}
