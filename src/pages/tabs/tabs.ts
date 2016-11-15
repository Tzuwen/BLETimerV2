import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TimersPage } from '../timers/timers';
import { ProgramMainPage } from '../programmain/programmain';
import { ManualPage } from '../manual/manual';
import { ConfigPage } from '../config/config';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  timerId: string;
  zoneId: number;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  //tab1Root: any = TimersPage;
  tab1Root: any = ProgramMainPage;
  tab2Root: any = ManualPage;
  tab3Root: any = ConfigPage;

  constructor(public navCtrl: NavController, public params: NavParams) {
    this.timerId = params.get('timerId');
    this.zoneId = params.get('zoneId');
  }

  test() {
    console.log('hello');
  }
}
