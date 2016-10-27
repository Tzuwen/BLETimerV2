import { Component } from '@angular/core';
import { ProgramTimerPage } from '../programtimer/programtimer';
import { ManualPage } from '../manual/manual';
import { ConfigPage } from '../config/config';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProgramTimerPage;
  tab2Root: any = ManualPage;
  tab3Root: any = ConfigPage;

  constructor() {

  }
}
