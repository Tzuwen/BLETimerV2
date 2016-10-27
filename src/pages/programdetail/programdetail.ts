import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-programdetail',
  templateUrl: 'programdetail.html'
})
export class ProgramDetailPage {

  timerId: string;
  zone: string;
  currentTime: string = new Date().toISOString();
  ecoOn: boolean = false;

  waterForSelected: string = "5 Mins";
  ecoWaterForSelected: string = "3 Mins";
  ecoPauseSelected: string = "3 Mins";
  waterForList = [];  
  ecoWaterForList = [];
  ecoPauseList = [];

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController) {
    this.timerId = params.get("timerId");
    this.zone = params.get("zone");
  }

  ionViewDidLoad() {
    var j = 5;
    for (var i = 0; i < 52; i++) {
      this.waterForList.push({ item: j + " Mins" });
      j += 5;
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoWaterForList.push({ item: i + " Mins" });
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoPauseList.push({ item: i + " Mins" });
    }
  }

  cancelClicked() {
    let datao = { 'zone': this.zone };
    this.viewCtrl.dismiss(datao);
  }

  saveClicked() {
    // todo
    // save data
    let datao = { 'zone': this.zone };
    this.viewCtrl.dismiss(datao);
  }
}
