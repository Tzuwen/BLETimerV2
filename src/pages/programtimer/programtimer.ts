import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ProgramMainPage } from '../programmain/programmain';

@Component({
  selector: 'page-programtimer',
  templateUrl: 'programtimer.html'
})
export class ProgramTimerPage {

  isScan: boolean = false;
  scanText: string = "SCAN";
  scanColor: string = "primary";
  timers = [];

  constructor(public navCtrl: NavController) {

  }

   goProgram(event, timer) {
    // reset the scan button
    this.isScan = false;
    this.scanText = "SCAN";
    this.scanColor = "primary";

    var timerId = timer.id;
    this.navCtrl.push(ProgramMainPage, { timerId: timerId });
  }

  scan() {
    // this is just for demo
    this.timers = [{ id: 'Timer-001' }, { id: 'Timer-002' }];

    // todo
    // scan ble device using cordova plugin

    if (this.isScan == false) {
      this.isScan = true;
      this.scanText = "STOP";
      this.scanColor = "danger";
    }
    else {
      this.isScan = false;
      this.scanText = "SCAN";
      this.scanColor = "primary";
    }
  }

}
