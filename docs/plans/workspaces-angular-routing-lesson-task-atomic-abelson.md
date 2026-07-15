# План: демо-приложение Angular для вебинара «Маршрутизация (Routing)»

## Context

Этот репозиторий — демо для вебинара OTUS `otus-angular-routing`. Полный бриф лежит в
`task.md` (самодостаточный, все развилки уже согласованы с заказчиком). Нужно:

1. **`main`** — заготовка для живого кодинга: вся вёрстка и данные готовы,
   **роутинга нет вообще** (нет `provideRouter`, нет `app.routes.ts`, App статически
   рендерит `<app-home />`). Лектор в эфире пишет только роутинг-код.
2. **5 накопительных веток** `live-1-done` … `live-5-done` — снепшоты «после LIVE N»,
   каждая = ровно дельта соответствующего runbook'а (Часть 2 брифа).
3. **README** — runbook лектора (Часть 5 брифа).

Ценность демо — в чистых дельтах между ветками: `git diff live-(N-1)-done..live-N-done`
должен содержать только шаги соответствующего LIVE.

Раздел брифа «Синхронизация со SPEAKER_NOTES» — задача в **другом** репозитории
(презентации), здесь **вне скоупа**.

## Решения (мои, в рамках дискреции брифа)

- Имя приложения: `routing-demo` (package.json name), заголовок шапки — «Routing Demo».
- Шаблоны — **отдельные `.html`** у всех компонентов (бриф: «предпочтительнее»), единообразно.
- Стили: глобальные токены и все классы в `src/styles.css` (страницы простые, свои css-файлы
  компонентам не нужны — меньше шума в дельтах).
- `task.md` остаётся в корне `main` (бриф проекта); `docs/plans/` — тоже.
- Коммиты: один коммит на ветку, сообщение вида `live-1: подключение маршрутизации`.
- Push в origin: **да**, main + все 5 веток (подтверждено пользователем).

## Окружение (проверено)

- Node v24.18.0 (`.nvmrc`), npm 11.16, реестр доступен, `@angular/cli` latest = **22.0.7**.
- Remote: `git@github.com:banana6boom/angular-routing-lesson.git`, ветка `main`.

## Шаги

### 1. Скаффолд (в `main`)

- `npx -y @angular/cli@22 new routing-demo` **во временной директории** (scratchpad),
  флаги: `--style=css --ssr=false --skip-git --skip-tests --zoneless`, non-interactive
  (сначала `ng new --help` — свериться с актуальными флагами v22, в т.ч. отключение
  AI-конфигов, если есть промпт).
- Перенести содержимое в корень репо, сохранив `.devcontainer/`, `.nvmrc`, `task.md`,
  `docs/`. Корневой README заменяется на runbook (шаг 3).
- **Важно:** CLI v22 генерирует роутинг по умолчанию — удалить `app.routes.ts`,
  `provideRouter` из `app.config.ts`, `RouterOutlet`/`<router-outlet>` из App.
  В `app.config.ts` остаются дефолты CLI (`provideZonelessChangeDetection` и пр.).
- Удалить spec-файлы, если сгенерируются; Prettier/ESLint — не добавлять (дефолты CLI).

### 2. Наполнение `main` (структура — Часть 1 брифа, дословно)

- `src/styles.css`: токены палитры indigo/slate из Части 3 брифа, base font ≥ 18px,
  тёмная тема, классы шапки/nav/`.active`/карточек/модалки-overlay — **готовые заранее**
  (разметку меню пишут в LIVE 4).
- `src/app/app.ts|html`: шапка «Routing Demo» + статический `<app-home />`. Без меню.
- Страницы (все: standalone, `ChangeDetectionStrategy.OnPush`, отдельный html, крупный
  `<h1>` со своим emoji): `pages/home/`, `pages/about/`, `pages/settings/settings.*`,
  `pages/settings/profile.*`, `pages/users/user-detail.*`, `pages/users/user-edit.*`,
  `pages/not-found/`, `pages/dialogs/confirm-dialog.*` — содержимое каждой описано
  в Части 1 брифа (Home выводит USERS текстом, NotFound — кнопка без обработчика,
  UserDetail params не читает и т.д.).
- `shared/users.ts` (константа USERS из 3 человек), `shared/feature-flags.ts`
  (`FeatureFlagsService`, `newUserPage = true`).
- **Никаких закомментированных подсказок роутинга** — только вёрстка и данные.
- `npm run build` — зелёная сборка; `ng serve` + Playwright: страница рендерит Home,
  правка URL `/about` ничего не меняет.

### 3. README — runbook лектора (в `main`)

По Части 5 брифа: запуск (`npm ci && npm start`, Node из `.nvmrc`), таблица-карта веток,
runbook каждого LIVE (шаги из Части 2, с пометками «предсказание в чат»), фолбэк
(`git stash` + `git checkout live-N-done`), сброс после репетиции.

### 4. Ветки live-N-done (последовательно, каждая от предыдущей)

Дельты — **дословно** по Части 2 брифа, код должен визуально совпадать со слайдами
(сверка по Части 4). Кратко:

- **live-1-done**: `app.routes.ts` (`''`→Home, `about`→About), `provideRouter`,
  `<app-home />` → `<router-outlet />`.
- **live-2-done**: `''` → redirect на `/home` (`pathMatch: 'full'`), Home на `home`;
  `title` на роутах; stub `users/:id` → UserDetail; функциональный redirect
  `legacy/:id` через `inject(FeatureFlagsService)`; роут `docs` → `/about` с
  `pathMatch: 'full'` + комментарий про контраст prefix/full; wildcard `**` → NotFound
  в конце. Порядок: пустой → статические → параметризованные → `**`.
- **live-3-done**: children у `settings` (`profile`) + вложенный `<router-outlet />`
  в Settings (+ текстовая подсказка `/settings/profile`); About и Profile на
  `loadComponent`; `shared/flag-preload-strategy.ts` (`FlagPreloadStrategy`),
  About получает `data: { preload: true }`; в конфиге —
  `withPreloading(FlagPreloadStrategy)` (PreloadAllModules показывают live, но в ветке
  остаётся финальная стратегия).
- **live-4-done**: меню в шапке (RouterLink/RouterLinkActive, exact на «Главная»,
  «Пользователь 1» с queryParams); Home — `@for` со ссылками; Settings — относительная
  `routerLink="profile"`; NotFound — `inject(Router).navigate(['/'])`; роут
  `users/:id/edit` + кнопка «Редактировать» с `relativeTo`; подписка на
  NavigationStart/NavigationEnd с type guard в конструкторе App; secondary outlet
  `modal` (`<router-outlet name="modal" />`, роут `confirm`, открытие/закрытие через
  `{ outlets: { modal: … } }` из Settings и ConfirmDialog).
- **live-5-done**: UserDetail — три подхода бок о бок (snapshot `idOnce`,
  `toSignal(paramMap/queryParamMap)`, `input.required<string>()` + `input<string>()`),
  `computed`-поиск по USERS; `withComponentInputBinding()` в конфиге; бонус
  `routerOutletData` — Settings передаёт `{ plan: 'Pro' }` во вложенный outlet,
  Profile читает через `inject(ROUTER_OUTLET_DATA)` и показывает бейдж.

Каждая ветка: реализовать дельту → `npm run build` → проверить, что
`git diff live-(N-1)-done..live-N-done` не содержит лишнего → коммит.

### 5. Verification (сквозная, на `live-5-done`)

`ng serve` + Playwright MCP — пройти чек-лист из брифа (13 пунктов): редирект `/`→`/home`
и title, 404 + кнопка, `/legacy/2`→`/users/2`, lazy-чанки в Network (about — в фоне,
profile — по заходу), exact-подсветка меню, вложенный outlet, `?tab=posts` через поток
и input, переход `users/1→users/2` без пересоздания (idOnce=1, поток/input=2), relative
`edit`, пары NavigationStart/End в консоли, `/docs` vs `/docs/intro`, модалка
`/settings(modal:confirm)` + открытие URL в новой вкладке, бейдж «Pro».

Плюс на каждой ветке — зелёный `npm run build`.

### 6. Публикация

`git push origin main live-1-done live-2-done live-3-done live-4-done live-5-done`.

## Ключевые файлы

- Создаются: весь скаффолд Angular в корне; `src/app/pages/**`, `src/app/shared/users.ts`,
  `src/app/shared/feature-flags.ts`, (с live-3) `src/app/shared/flag-preload-strategy.ts`,
  (с live-1) `src/app/app.routes.ts`; `README.md`.
- Источник истины по содержимому: `task.md` (Части 1–5).

## Риски / примечания

- Точные флаги `ng new` v22 сверить по `--help` перед запуском (промпты про zoneless/AI
  могли поменяться) — скаффолд должен пройти non-interactive.
- `ROUTER_OUTLET_DATA` / `[routerOutletData]` — API из v19.2+, в v22 доступен; если
  сигнатура отличается от брифа, адаптировать код, сохранив суть демо.
- Итоговое приложение должно оставаться «zoneless + дефолты CLI» — ничего сверх брифа.
