# Routing Demo — вебинар OTUS «Маршрутизация (Routing)»

Демо-приложение для живого кодинга: ветка `main` — заготовка со всей вёрсткой и данными,
но **без единой строчки роутинга**. Весь роутинг-код пишется в эфире за 5 LIVE-сессий;
результат каждой сессии сохранён в фолбэк-ветке `live-N-done`.

## Запуск

Требуется Node.js из `.nvmrc` (v24).

```bash
npm ci
npm start   # http://localhost:4200
```

## Карта веток

| Ветка | Что добавляет |
|---|---|
| `main` | Заготовка: вся вёрстка и данные, роутинга нет (App статически рендерит Home) |
| `live-1-done` | Подключение маршрутизации: `app.routes.ts`, `provideRouter`, `<router-outlet />` |
| `live-2-done` | Конфигурация: redirect `''`→`/home`, `title`, `users/:id`, функциональный redirect, `pathMatch`, wildcard `**` |
| `live-3-done` | Lazy и вложенность: children `settings/profile`, `loadComponent`, preloading + `FlagPreloadStrategy` |
| `live-4-done` | Навигация: меню `routerLink`/`routerLinkActive`, `navigate` + `relativeTo`, события Router, secondary outlet |
| `live-5-done` | Данные маршрута: snapshot vs `paramMap`+`toSignal` vs `withComponentInputBinding`, бонус `routerOutletData` |

Ветки **накопительные**: каждая создана от предыдущей, дельта ветки = ровно шаги её LIVE
(`git diff live-2-done..live-3-done` показывает только материал LIVE 3).

## Runbook LIVE 1 — подключение маршрутизации (слайд 17)

Старт: ветка `main`. Показать: приложение работает, но правка URL на `/about` ничего не меняет.

1. Создать `src/app/app.routes.ts`:
   ```ts
   export const appRoutes: Routes = [
     { path: '', component: Home },
     { path: 'about', component: About },
   ];
   ```
2. В `app.config.ts` добавить `provideRouter(appRoutes)`.
3. В `app.html` заменить `<app-home />` на `<router-outlet />`
   (в `app.ts`: импорт `RouterOutlet` вместо `Home`).

Проверка: правка URL `/` ↔ `/about` меняет контент **без перезагрузки страницы**.

## Runbook LIVE 2 — конфигурация роутов (слайд 24)

1. Пустой путь → редирект: `{ path: '', redirectTo: '/home', pathMatch: 'full' }`;
   Home переезжает на `{ path: 'home', component: Home }`.
2. Wildcard в конец: `{ path: '**', component: NotFound }`. Показать `/nope` → 404.
   > 💬 **Предсказание в чат**: «что произойдёт, если поставить `**` ПЕРВЫМ в массиве?» —
   > перенести, показать (все пути ведут в 404), вернуть на место.
3. `title` на роутах: `'Главная'`, `'О приложении'` (+ на остальных по мере появления).
4. Stub-роут `{ path: 'users/:id', component: UserDetail, title: 'Пользователь' }`.
5. Функциональный redirect (слайд 23):
   ```ts
   {
     path: 'legacy/:id',
     redirectTo: ({ params }) =>
       inject(FeatureFlagsService).newUserPage
         ? `/users/${params['id']}`
         : '/home',
   },
   ```
   Показать `/legacy/2` → `/users/2`.
6. Демо `pathMatch` (слайд 22) на роуте `{ path: 'docs', redirectTo: '/about', pathMatch: 'full' }`:
   с `full` — `/docs` редиректит, `/docs/intro` → 404 (URL целиком не совпал);
   поменять на `'prefix'` (или убрать — это дефолт) — `/docs/intro` тоже редиректит.
   В ветке остаётся `'full'` + комментарий с контрастом.

Порядок в массиве (слайд 20): пустой → статические → параметризованные → `**`.

## Runbook LIVE 3 — lazy loading и вложенность (слайд 30)

1. Children: `{ path: 'settings', component: Settings, title: 'Настройки', children: [{ path: 'profile', component: Profile }] }`;
   в шаблон Settings — вложенный `<router-outlet />` (+ текст-подсказка URL `/settings/profile`).
2. About → lazy:
   ```ts
   { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About), title: 'О приложении' },
   ```
   DevTools → Network: отдельный chunk по первому заходу на `/about`.
   > 💬 **Предсказание в чат**: «включаю `withPreloading(PreloadAllModules)` — когда теперь
   > загрузится chunk about?» — в фоне сразу после старта.
3. `provideRouter(appRoutes, withPreloading(PreloadAllModules))` — показать фоновую догрузку.
4. Кастомная стратегия по флагу в `data` (слайд 29): Profile тоже на `loadComponent`
   (второй chunk для контраста), About получает `data: { preload: true }`;
   пишется `shared/flag-preload-strategy.ts` и заменяет `PreloadAllModules`:
   ```ts
   @Injectable({ providedIn: 'root' })
   export class FlagPreloadStrategy implements PreloadingStrategy {
     preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
       return route.data?.['preload'] ? load() : of(null);
     }
   }
   ```
   Проверка: chunk about (флаг стоит) — в фоне; chunk profile — только при первом заходе
   на `/settings/profile`.

## Runbook LIVE 4 — навигация (слайд 38)

1. Меню в шапке (`app.html`, CSS-классы уже готовы):
   ```html
   <nav>
     <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Главная</a>
     <a routerLink="/about" routerLinkActive="active">О приложении</a>
     <a routerLink="/settings" routerLinkActive="active">Настройки</a>
     <a [routerLink]="['/users', 1]" [queryParams]="{ tab: 'posts' }" routerLinkActive="active">Пользователь 1</a>
   </nav>
   ```
   Импорты `RouterLink, RouterLinkActive` в App. В Home список USERS — ссылки
   `[routerLink]="['/users', user.id]"`. В Settings подсказка становится ссылкой
   `routerLink="profile"` — относительная, без слэша.
2. Кнопка «На главную» в NotFound: `inject(Router).navigate(['/'])`.
3. Роут `{ path: 'users/:id/edit', component: UserEdit }` + кнопка «Редактировать» в UserDetail.
   > 💬 **Предсказание в чат**: «куда приведёт `navigate(['edit'], { relativeTo: this.route })`
   > с `/users/2`?» — на `/users/2/edit`: команды без ведущего слэша — относительные.
4. Подписка на события Router в конструкторе App (слайд 37):
   ```ts
   inject(Router).events
     .pipe(
       filter(
         (e): e is NavigationStart | NavigationEnd =>
           e instanceof NavigationStart || e instanceof NavigationEnd,
       ),
     )
     .subscribe((e) => console.log(e.constructor.name, e.url));
   ```
5. Secondary outlet (слайды 15–16): роут `{ path: 'confirm', component: ConfirmDialog, outlet: 'modal' }`,
   в `app.html` рядом с primary — `<router-outlet name="modal" />`, в Settings кнопка
   «Сбросить настройки»:
   ```ts
   this.router.navigate([{ outlets: { modal: ['confirm'] } }]);  // открыть
   this.router.navigate([{ outlets: { modal: null } }]);         // закрыть (обе кнопки модалки)
   ```
   Показать URL `/settings(modal:confirm)`: скопировать, открыть в новой вкладке — модалка
   «переживает» перезагрузку и шарится ссылкой.

## Runbook LIVE 5 — данные маршрута (слайд 46)

1. UserDetail: оба подхода бок о бок (роут `users/:id` уже есть с LIVE 2):
   ```ts
   idOnce = this.route.snapshot.paramMap.get('id');                                  // снимок
   idFromStream = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));       // поток
   tabFromStream = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('tab'))));
   ```
2. `withComponentInputBinding()` в `provideRouter` + инпуты (слайд 44):
   ```ts
   id = input.required<string>(); // имя совпадает с :id из path
   tab = input<string>();         // из ?tab=…
   ```
   `user = computed(() => USERS.find((u) => String(u.id) === this.id()))` — имя в шаблоне.
   > 💬 **Предсказание в чат**: «перехожу `users/1 → users/2` — что покажет каждое из трёх
   > значений?» — `idOnce` останется `1`, поток и input обновятся; компонент НЕ пересоздаётся
   > (можно добавить `console.log` в конструктор прямо в эфире).
3. Бонус сверх слайдов — `routerOutletData` (четвёртый способ передать данные вниз):
   ```html
   <!-- settings.html: родитель кладёт значение в input вложенного outlet'а -->
   <router-outlet [routerOutletData]="{ plan: 'Pro' }" />
   ```
   ```ts
   // profile.ts: ребёнок читает сигналом
   outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ plan: string }>;
   ```
   Profile показывает бейдж тарифа из `outletData().plan`.

## Фолбэк (если не успеваю)

```bash
git stash                      # спрятать недописанное
git checkout live-N-done       # мгновенно готовое состояние «после LIVE N»
```

Dev-сервер перезапускать **не нужно** — `ng serve` подхватит смену ветки сам.

## Сброс после репетиции

```bash
git checkout main
git stash drop     # если что-то прятали
git clean -fd      # если появлялись новые нетрекнутые файлы
```
