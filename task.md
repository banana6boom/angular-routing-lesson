# План демо-приложения для вебинара «Маршрутизация (Routing)»

## Context

Вебинар OTUS `otus-angular-routing` (Slidev, ~110 мин, 52 слайда) — про Angular Router:
подключение, конфигурация роутов, lazy loading, навигация, данные маршрута. В презентации
**5 LIVE-сессий** (слайды 17, 24, 30, 38, 46), каждая — живой кодинг в IDE по runbook'у из
SPEAKER_NOTES. Контрольные точки тайминга ссылаются на **фолбэк-ветки** `live-2-done`,
`live-3-done`, `live-5-done` — «если не успеваю, переключаюсь на готовую ветку».

Нужно демо-приложение (в **отдельном репозитории**), которое является одновременно:

1. **заготовкой для живого кодинга** — `main` содержит всю вёрстку, но ноль роутинга;
   лектор в эфире пишет ТОЛЬКО роутинг-код;
2. **набором фолбэк-веток** `live-1-done` … `live-5-done` — накопительные снепшоты
   состояния «после LIVE N», на которые можно мгновенно переключиться.

Это принципиально другой жанр, чем демо для `otus-http-client` (готовое приложение
с разделами): здесь ценность — в **дельте между ветками**, она и есть сценарий live.

Этот документ — **самодостаточный бриф для агента в другом репозитории**: включает
структуру заготовки, точное содержимое каждой ветки, дословный код со слайдов и
требования к внешнему виду.

**Стек:** Angular 22 (standalone, signals, `input()`, `@if/@for`, `toSignal`),
без бэкенда — данные в памяти. Zoneless / прочие дефолты — как генерирует актуальный
Angular CLI. Максимально концентрированно: без state-менеджеров, UI-китов, тестов,
абстракций «на вырост». Именование файлов — современный style guide (без суффикса
`.component`: `home.ts`, класс `Home`).

---

## Решения (согласовано с заказчиком)

| Развилка | Решение |
|---|---|
| Внешний вид | **Indigo/slate** — та же палитра, что в демо `otus-http-client` (см. «Внешний вид») |
| Доменная легенда | **Нейтральная, ровно по runbook'ам**: Home, About, Settings/Profile, Users/:id, NotFound |
| Заготовка `main` | **Все компоненты сверстаны заранее**; лектор пишет только роутинг-код |
| README | **Полный runbook для лектора**: карта веток, шаги каждого LIVE, команды, фолбэки |
| `users/:id` | Stub-роут появляется уже в `live-2-done` (нужен как цель функционального redirect); LIVE 5 фокусируется на чтении параметров |

---

## Часть 1. Заготовка — ветка `main`

Состояние, с которого лектор начинает LIVE 1: приложение собирается и запускается,
**роутинга нет вообще** (в `app.config.ts` нет `provideRouter`, файла `app.routes.ts` нет,
в шаблоне App нет `<router-outlet>` — App статически рендерит `<app-home />`).
Лектор показывает: правка URL на `/about` ничего не меняет.

### Структура

```
src/app/
  app.config.ts          # provideZonelessChangeDetection и пр. — БЕЗ provideRouter
  app.ts / app.html      # shell: шапка с названием, <app-home /> статически.
                         #   Меню в шапке НЕ сверстано (его пишут в LIVE 4),
                         #   но CSS-классы для nav/ссылок уже готовы в styles.css
  pages/
    home/home.ts         # «Главная»: приветствие + список пользователей из USERS
                         #   (пока просто текст, НЕ ссылки — ссылками станут в LIVE 4)
    about/about.ts       # «О приложении»: пара абзацев — чтобы был заметный chunk в LIVE 3
    settings/settings.ts # «Настройки»: заголовок + пара фейк-переключателей;
                         #   БЕЗ <router-outlet> (его добавляют в LIVE 3)
    settings/profile.ts  # «Профиль»: карточка с именем/почтой (ребёнок settings в LIVE 3)
    users/user-detail.ts # «Пользователь»: карточка-заглушка, params НЕ читает
                         #   (чтение пишут в LIVE 5)
    users/user-edit.ts   # «Редактирование пользователя»: заглушка (цель relativeTo в LIVE 4)
    not-found/not-found.ts # «404 — страница не найдена», крупно; кнопка «На главную»
                         #   сверстана, но обработчика нет (напишут в LIVE 4)
    dialogs/confirm-dialog.ts # модалка «Подтвердите действие» (Да/Отмена): вёрстка и CSS
                         #   (overlay поверх контента) готовы — станет secondary outlet в LIVE 4
  shared/
    users.ts             # export const USERS = [{ id: 1, name: 'Ада Лавлейс' },
                         #   { id: 2, name: 'Грейс Хоппер' }, { id: 3, name: 'Маргарет Гамильтон' }]
    feature-flags.ts     # @Injectable({ providedIn: 'root' }) FeatureFlagsService
                         #   с полем newUserPage = true (для inject() в functional redirect, LIVE 2)
```

Каждый pages-компонент: standalone, `ChangeDetectionStrategy.OnPush`, инлайн-шаблон
(или отдельный html — на вкус агента, но единообразно), крупный `<h1>` — страницы должны
мгновенно различаться на проекторе.

**Важно для живого кодинга:** компоненты не должны содержать «забегания вперёд» —
никаких закомментированных подсказок роутинга. Единственные допустимые заготовки —
вёрстка и данные.

---

## Часть 2. Ветки `live-N-done`

Ветки **накопительные**: `live-1-done` создаётся от `main`, каждая следующая — от
предыдущей. Каждая ветка = ровно дельта соответствующего runbook'а, собирается
(`ng build`) и проходит ручной чек-лист (см. Verification).

### `live-1-done` — подключение маршрутизации (слайд 17)

1. `app.routes.ts`: `appRoutes: Routes = [{ path: '', component: Home }, { path: 'about', component: About }]`.
2. `app.config.ts`: `provideRouter(appRoutes)`.
3. `app.html`: `<app-home />` → `<router-outlet />`.

Проверка: правка URL `/` ↔ `/about` меняет контент **без перезагрузки страницы**.

### `live-2-done` — конфигурация роутов (слайд 24)

1. Пустой путь → редирект: `{ path: '', redirectTo: '/home', pathMatch: 'full' }`,
   Home переезжает на `{ path: 'home', component: Home }`.
2. Wildcard в конце: `{ path: '**', component: NotFound }`.
3. `title` на роутах: `'Главная'`, `'О приложении'` (+ на остальных по мере появления).
4. Stub-роут `{ path: 'users/:id', component: UserDetail, title: 'Пользователь' }`.
5. Функциональный redirect (дословно в духе слайда 23):

   ```ts
   {
     path: 'legacy/:id',
     redirectTo: ({ params }) =>
       inject(FeatureFlagsService).newUserPage
         ? `/users/${params['id']}`
         : '/home',
   },
   ```

6. **Демо отличия `pathMatch: 'prefix'` vs `'full'`** (слайд 22). Роут
   `{ path: 'docs', redirectTo: '/about', pathMatch: 'full' }`:
   - с `full`: `/docs` → редирект на `/about`, а `/docs/intro` → **404** (URL целиком
     не совпал);
   - лектор меняет на `pathMatch: 'prefix'` (или убирает — это дефолт): теперь и
     `/docs/intro` редиректит — совпало **начало** URL.
   В `live-2-done` остаётся вариант с `'full'` + комментарий с этим контрастом.

Порядок в массиве — как учит слайд 20: пустой → статические → параметризованные → `**`.

### `live-3-done` — lazy и вложенность (слайд 30)

1. Children: `{ path: 'settings', component: Settings, title: 'Настройки', children: [{ path: 'profile', component: Profile }] }`;
   в шаблон Settings добавляется вложенный `<router-outlet />` (и текстовая ссылка-URL
   `/settings/profile` для демонстрации — кликабельной она станет в LIVE 4).
2. About переводится на lazy: `{ path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About), title: 'О приложении' }`.
3. `provideRouter(appRoutes, withPreloading(PreloadAllModules))`.
4. **Кастомная стратегия по флагу в `data`** (слайд 29, третий буллет). Profile тоже
   переводится на `loadComponent` (второй lazy-чанк для контраста), About получает
   `data: { preload: true }`; пишется стратегия и заменяет PreloadAllModules:

   ```ts
   // shared/flag-preload-strategy.ts
   @Injectable({ providedIn: 'root' })
   export class FlagPreloadStrategy implements PreloadingStrategy {
     preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
       return route.data?.['preload'] ? load() : of(null);
     }
   }

   // app.config.ts
   provideRouter(appRoutes, withPreloading(FlagPreloadStrategy)),
   ```

Проверка: в DevTools → Network виден отдельный chunk about; с PreloadAllModules он
догружается в фоне после старта; с FlagPreloadStrategy — about (флаг стоит) в фоне,
chunk profile — только при первом заходе на `/settings/profile`.

### `live-4-done` — навигация (слайд 38)

1. Меню в шапке App (по заготовленным CSS-классам):

   ```html
   <nav>
     <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Главная</a>
     <a routerLink="/about" routerLinkActive="active">О приложении</a>
     <a routerLink="/settings" routerLinkActive="active">Настройки</a>
     <a [routerLink]="['/users', 1]" [queryParams]="{ tab: 'posts' }" routerLinkActive="active">Пользователь 1</a>
   </nav>
   ```

   (импорты `RouterLink, RouterLinkActive` в App; в Home список USERS превращается
   в `@for` со ссылками `[routerLink]="['/users', user.id]"`; в Settings ссылка на profile
   становится `routerLink="profile"` — относительная, без слэша.)
2. Кнопка «На главную» в NotFound: `inject(Router).navigate(['/'])`.
3. Роут `{ path: 'users/:id/edit', component: UserEdit }` + кнопка «Редактировать»
   в UserDetail: `this.router.navigate(['edit'], { relativeTo: this.route })` —
   относительная навигация, команды без ведущего слэша.
4. Подписка на события в конструкторе App (в духе слайда 37; без `any`-кастов —
   type guard в `filter` сужает тип, у обоих событий есть `url`):

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

5. **Secondary outlet** (слайды 15–16 + ответ «как открыть из кода» из SPEAKER_NOTES).
   В App рядом с primary добавляется именованный outlet, в конфиг — роут модалки,
   в Settings — кнопка «Сбросить настройки», открывающая её императивно:

   ```ts
   // app.routes.ts
   { path: 'confirm', component: ConfirmDialog, outlet: 'modal' },

   // app.html
   <router-outlet />
   <router-outlet name="modal" />

   // settings.ts — открыть; в ConfirmDialog обе кнопки закрывают
   this.router.navigate([{ outlets: { modal: ['confirm'] } }]);
   this.router.navigate([{ outlets: { modal: null } }]);
   ```

   Показать URL `/settings(modal:confirm)`: скопировать, открыть в новой вкладке —
   модалка «переживает» перезагрузку и шарится ссылкой (мотивация со слайда 16).

### `live-5-done` — данные маршрута (слайд 46)

UserDetail дорабатывается, оба подхода бок о бок (шаблон выводит все значения
с подписями — контраст виден на экране):

```ts
export class UserDetail {
  private route = inject(ActivatedRoute);

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
}
```

В `app.config.ts`: `provideRouter(appRoutes, withPreloading(FlagPreloadStrategy), withComponentInputBinding())`.

**Бонус: input-свойство `routerOutletData` у `<router-outlet>`** — четвёртый способ
передать данные вниз, минуя конфигурацию роутов: родитель кладёт значение в input
outlet'а, ребёнок читает его сигналом через токен `ROUTER_OUTLET_DATA`. Демо на
вложенном outlet'е Settings → Profile:

```ts
// settings.html — родитель передаёт данные во вложенный outlet
<router-outlet [routerOutletData]="{ plan: 'Pro' }" />

// profile.ts — ребёнок читает сигналом
outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ plan: string }>;
```

Profile показывает бейдж тарифа из `outletData().plan`. Значение реактивно: если
родитель передаст сигнал/изменяемый объект, ребёнок увидит обновление без пересоздания.

Проверка ключевого концепта: переход `users/1 → users/2` (ссылки между пользователями
или правка URL) — `idOnce` остаётся `1`, поток и input обновляются, компонент не
пересоздаётся (лог `ngOnInit`/constructor не повторяется — можно добавить `console.log`
в конструктор прямо в эфире).

---

## Часть 3. Внешний вид

Та же система, что в демо `otus-http-client` — демо курса выглядят единообразно:

```
--accent:    #6366f1  (indigo)    — активная навигация (.active), кнопки, ссылки
--bg-dark:   #0f172a  (slate-900) — фон
--surface:   #1e293b  (slate-800) — карточки/шапка
--text:      #e2e8f0
--muted:     #94a3b8
--divider:   #334155
```

- Шрифты: system-ui/Inter; моноширинный для URL/кода — ui-monospace.
- **Крупный кегль** (base ≥ 18px): демо показывается на проекторе.
- Тёмная тема, высокий контраст. Без UI-китов — чистый CSS с токенами в `styles.css`.
- Шапка: название («Routing Demo» или подобное) слева, `<nav>` справа; `.active`
  — indigo-подчёркивание/фон. Классы готовы в `main`, разметка меню пишется в LIVE 4.
- Каждая страница — крупный `<h1>` + карточка контента; страницы должны различаться
  с первого взгляда (заголовок и, например, свой emoji в h1).
- NotFound — крупная «404», visually loud: её показ — отдельный шаг LIVE 2.

---

## Часть 4. Код-ориентиры со слайдов (для сверки «один в один»)

Live-код должен визуально совпадать с примерами на слайдах — зал видит их за минуты
до live. Дословные фрагменты:

**Слайд 23 — функциональный redirectTo** (образец формы):

```ts
{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
{
  path: 'legacy/:id', // функция вызывается в injection context
  redirectTo: ({ params }) =>
    inject(FeatureFlagsService).newProfile
      ? `/profile/${params['id']}`
      : `/users/${params['id']}`,
}
```

**Слайд 15 — именованный outlet в конфигурации** (демо на слайде 16: URL
`/dashboard(modal:confirm)`):

```ts
{
  path: 'confirm',
  component: ConfirmDialogComponent,
  outlet: 'modal',
},
```

**Слайд 22 — pathMatch** (формулировка из заметок): `prefix` — сегменты `path`
являются префиксом URL; `full` — совпадение URL целиком.

**Слайд 27 — lazy loading**: `loadComponent: () => import('./login-page').then((m) => m.LoginPage)`.

**Слайд 29 — preloading**: `provideRouter(appRoutes, withPreloading(PreloadAllModules));`

**Слайд 36 — navigate/navigateByUrl**:

```ts
this.router.navigate(['/users', id], { queryParams: { tab: 'posts' } });
this.router.navigate(['edit'], { relativeTo: this.route }); // без «/»
this.router.navigateByUrl('/users/42?tab=posts');
```

**Слайд 37 — события**: `inject(Router).events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(...)`.

**Слайд 42 — snapshot vs observable**:

```ts
idOnce = this.route.snapshot.paramMap.get('id');
id = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))));
```

**Слайд 44 — input binding**:

```ts
id = input.required<string>(); // имя совпадает с :id из path
tab = input<string>();         // из ?tab=…
```

---

## Часть 5. README — runbook лектора

README.md в корне демо-репо, разделы:

1. **Запуск**: `npm ci && npm start` (порт 4200), требуемая версия Node.
2. **Карта веток**: таблица `main → live-1-done → … → live-5-done` с одной строкой
   «что добавляет» на ветку.
3. **Runbook каждого LIVE** — шаги из Части 2 (они же — runbook'и SPEAKER_NOTES),
   с пометками «предсказание в чат» там, где они есть в заметках лектора:
   - LIVE 2: перед переносом `**` в начало массива;
   - LIVE 3: перед включением PreloadAllModules;
   - LIVE 4: перед `navigate(['edit'], { relativeTo })`;
   - LIVE 5: перед переходом `users/1 → users/2`.
4. **Фолбэк**: `git checkout live-N-done` (+ `git stash` недописанного), dev-сервер
   перезапускать не нужно.
5. **Сброс после репетиции**: `git checkout main && git stash drop` и т.п.

---

## Verification (как проверить готовое демо)

На **каждой** ветке: `npm ci` (один раз), `ng build` — зелёная сборка, ноль ошибок.

Сквозной ручной чек-лист (финальная ветка `live-5-done`):

1. `/` → редирект на `/home`, вкладка браузера — «Главная».
2. `/nope` → страница 404; кнопка «На главную» работает без перезагрузки.
3. `/legacy/2` → редирект на `/users/2`, видно имя второго пользователя.
4. DevTools Network: chunk about (флаг `preload: true`) догружается в фоне после старта;
   chunk profile — только при первом заходе на `/settings/profile` (FlagPreloadStrategy).
5. Меню: активный пункт подсвечен; на `/about` пункт «Главная» НЕ подсвечен (exact).
6. `/settings/profile` — профиль рендерится во вложенном outlet, настройки вокруг видны.
7. «Пользователь 1» из меню → `/users/1?tab=posts`; `tab` виден и через поток, и через input.
8. `users/1 → users/2`: `idOnce` = 1, поток и input = 2, конструктор не вызывается повторно.
9. «Редактировать» на `/users/2` → `/users/2/edit`.
10. Консоль: пары NavigationStart/NavigationEnd на каждый переход.
11. `/docs` → редирект на `/about`; `/docs/intro` → 404 (`pathMatch: 'full'`).
12. «Сбросить настройки» открывает модалку, URL — `/settings(modal:confirm)`;
    URL с модалкой открывается в новой вкладке; «Да»/«Отмена» закрывают (сегмент
    исчезает из URL).
13. `/settings/profile`: виден бейдж «Pro» из `routerOutletData`.

Дельта-проверка веток: `git diff live-(N-1)-done..live-N-done` — в дельте только
шаги соответствующего runbook'а, ничего лишнего.

---

## Синхронизация со SPEAKER_NOTES (задача в ЭТОМ репо, после сборки демо)

Мелкие уточнения, которые стоит внести в `presentations/otus-angular-routing/SPEAKER_NOTES.md`:

1. **LIVE 2, шаг 5** — уточнить: вместе с functional redirect добавляется stub-роут
   `users/:id` (цель редиректа). Если шаг пропущен по времени — роут создаётся в LIVE 5, шаг 1.
2. **LIVE 5, шаг 1** — переформулировать: «роут `users/:id` уже есть (LIVE 2) — выводим id
   через paramMap + toSignal» (или создаём, если LIVE 2 закончился на шаге 4).
3. Добавить в «Контрольные точки» упоминание веток `live-1-done`/`live-4-done`
   (сейчас упомянуты только 2, 3, 5 — ветки будут для всех пяти).
4. **Расширения runbook'ов** (новые шаги демо, в заметках их пока нет):
   - LIVE 2 — демо `pathMatch: 'prefix'` vs `'full'` на роуте `docs` (слайд 22 это
     объясняет, но live-шага не было);
   - LIVE 3 — кастомная FlagPreloadStrategy (слайд 29, третий буллет);
   - LIVE 4 — secondary outlet `(modal:confirm)` (слайды 15–16; ответ «как открыть
     из кода» переезжает из «если спросят» в шаг runbook'а);
   - LIVE 5 — `routerOutletData` / `ROUTER_OUTLET_DATA`. ⚠️ Этого API **нет на слайдах
     вообще** — демо расширяет презентацию; лектор проговаривает, что это бонус сверх
     слайдов (возможно, стоит добавить упоминание на слайд 16 или 44).

---

## Открытые вопросы для агента (не блокирующие)

- Точное имя репо/приложения (`otus-routing-demo` или подобное) — на усмотрение.
- Инлайн-шаблоны vs отдельные html — на усмотрение, но единообразно по всем компонентам. Отдельные html предпочтительнее
- Prettier/ESLint — дефолты CLI, без кастомизации.
