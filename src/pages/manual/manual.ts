import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { Global } from '../../app/global';

@Component({
  selector: 'page-manual',
  templateUrl: 'manual.html'
})
export class ManualPage {
  timerId: string;
  zone: string = '1';
  zone1BtnColor = 'primary';
  zone2BtnColor = 'secondary';
  zone3BtnColor = 'secondary';
  zone4BtnColor = 'secondary';

  constructor(
    public navCtrl: NavController,
    public params: NavParams) {
      this.timerId = this.params.get('timerId');
  }

  ionViewDidLoad() { }

  public zoneBtnClicked(currentZone) {
    switch (currentZone) {
      case 1:
        this.zone = '1';
        this.zone1BtnColor = 'primary';
        this.zone2BtnColor = 'secondary';
        this.zone3BtnColor = 'secondary';
        this.zone4BtnColor = 'secondary';
        break;
      case 2:
        this.zone = '2';
        this.zone1BtnColor = 'secondary';
        this.zone2BtnColor = 'primary';
        this.zone3BtnColor = 'secondary';
        this.zone4BtnColor = 'secondary';
        break;
      case 3:
        this.zone = '3';
        this.zone1BtnColor = 'secondary';
        this.zone2BtnColor = 'secondary';
        this.zone3BtnColor = 'primary';
        this.zone4BtnColor = 'secondary';
        break;
      case 4:
        this.zone = '4';
        this.zone1BtnColor = 'secondary';
        this.zone2BtnColor = 'secondary';
        this.zone3BtnColor = 'secondary';
        this.zone4BtnColor = 'primary';
        break;
    }
  }
}
