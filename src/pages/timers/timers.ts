import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ProgramMainPage } from '../programmain/programmain';
import { TabsPage } from '../tabs/tabs';
//import { Global } from '../../app/global';
 
@Component({
  selector: 'page-timers',
  templateUrl: 'timers.html'
})
export class TimersPage {
  id: string;
  isScan: boolean = false;
  scanText: string = 'SCAN';
  scanColor: string = 'primary';
  timers = [];

  constructor(
    public navCtrl: NavController, 
    public params: NavParams) {
  }

  goProgram(event, timer) {
    // reset the scan button
    this.isScan = false;
    this.scanText = 'SCAN';
    this.scanColor = 'primary';
    this.id = timer.id;    
    this.navCtrl.push(TabsPage, { timerId: this.id });
  }

  scan() {
    // this is just for demo
    this.timers = [{ id: 'Timer-001' }, { id: 'Timer-002' }];

    // todo
    // scan ble device using cordova plugin

    if (this.isScan == false) {
      this.isScan = true;
      this.scanText = 'STOP';
      this.scanColor = 'danger';
    }
    else {
      this.isScan = false;
      this.scanText = 'SCAN';
      this.scanColor = 'primary';
    }
  }
}
