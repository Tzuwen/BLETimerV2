import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Valves page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-valves',
  templateUrl: 'valves.html'
})
export class ValvesPage {

  timerId: string;
  zones: number;
  zoneList = [];
  zoneSelected: number;

  constructor(public navCtrl: NavController, public params: NavParams) {
    this.timerId = params.get('timerId');
    this.zones = params.get('zones');
    for (var i = 1; i <= this.zones; i++) {
      this.zoneList.push({ id: i });
    }
  }

  ionViewDidLoad() {}

  goToTabs(event, zone) {
    this.zoneSelected = zone.id;
    this.navCtrl.push(TabsPage, { timerId: this.timerId, zoneId: this.zoneSelected });
  }
}
