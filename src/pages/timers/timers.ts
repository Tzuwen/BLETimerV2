import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ValvesPage } from '../valves/valves';

@Component({
  selector: 'page-timers',
  templateUrl: 'timers.html'
})
export class TimersPage {

  isScan: boolean = false;
  scanText: string = 'SCAN';
  scanColor: string = 'primary';
  timers = [];
  public base64Image: string;

  constructor(
    public navCtrl: NavController,
    public params: NavParams) {
    this.base64Image = "../../../assets/img/productimg.png";
  }

  goToProgram(event, timer) {
    // reset the scan button
    this.isScan = false;
    this.scanText = 'SCAN';
    this.scanColor = 'primary';
    this.navCtrl.push(ValvesPage, { timerId: timer.timerId, zones: timer.zones });
  }

  scan() {
    // this is just for demo
    this.timers = [{ timerId: 'Timer-001', zones: 1 },
    { timerId: 'Timer-002', zones: 2 },
    { timerId: 'Timer-003', zones: 4 }];


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
