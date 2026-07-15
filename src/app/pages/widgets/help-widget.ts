import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-help-widget',
  templateUrl: './help-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpWidget {}
