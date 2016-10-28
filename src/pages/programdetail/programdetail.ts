import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-programdetail',
  templateUrl: 'programdetail.html'
})
export class ProgramDetailPage {
  timerId: string;
  timerName: string;
  zone: string;
  zoneName: string;
  currentTime: string = '1980-11-06T00:00:00.000Z';
  weekdaySelected: string = '';
  ecoOn: boolean = false;

  zone1BtnColor = 'primary';
  zone2BtnColor = 'secondary';
  zone3BtnColor = 'secondary';
  zone4BtnColor = 'secondary';

  waterForSelected: string = '5 Mins';
  ecoWaterForSelected: string = '3 Mins';
  ecoPauseSelected: string = '3 Mins';
  waterForList = [];
  ecoWaterForList = [];
  ecoPauseList = [];
  weekdays = [
    { id: 0, isEnable: false, color: 'secondary' },
    { id: 1, isEnable: false, color: 'secondary' },
    { id: 2, isEnable: false, color: 'secondary' },
    { id: 3, isEnable: false, color: 'secondary' },
    { id: 4, isEnable: false, color: 'secondary' },
    { id: 5, isEnable: false, color: 'secondary' },
    { id: 6, isEnable: false, color: 'secondary' }
  ] 

  database: SQLite;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.timerId = params.get('timerId');
    this.zone = params.get('zone');
    platform.ready().then(() => {
      this.database = new SQLite();
    });
  }

  ionViewDidLoad() {
    var j = 5;
    for (var i = 0; i < 52; i++) {
      this.waterForList.push({ item: j + ' Mins' });
      j += 5;
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoWaterForList.push({ item: i + ' Mins' });
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoPauseList.push({ item: i + ' Mins' });
    }
  }

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

  public weekdayBtnClicked(currentDay) {   
    this.weekdays.forEach(element => {
      if (element.id == currentDay) {
        if (element.isEnable == true) {
          element.isEnable = false;
          element.color = 'secondary';
        } else {
          element.isEnable = true;
          element.color = 'primary';
        }
      }
    });
  }

  cancelClicked() {
    let datao = { 'zone': this.zone };
    this.viewCtrl.dismiss(datao);
  }

  saveClicked() {
    this.weekdays.forEach(element => {
     if (element.isEnable == true) {
       this.weekdaySelected += element.id.toString();
     }
    });

    if (this.weekdaySelected != '') {
      this.database.executeSql("INSERT INTO weeklySchedule (TimerId, TimerName, Zone, ZoneName, StartTime, WaterFor, WaterDay, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable) " +
        "VALUES ('" + this.timerId + "', '" + this.timerName + "', '" + this.zone + "', '" + this.zoneName + "', '" + this.currentTime + "', '" + this.waterForSelected +
        "', '" + this.weekdays + "', 1, '" + this.ecoWaterForSelected + "', '" + this.ecoPauseSelected + "', '" + this.ecoOn + "')", []).then((data) => {
          console.log('INSERTED: ' + JSON.stringify(data));
          //console.log("Weekly data saved");
          let datao = { 'Zone': this.zone };
          this.viewCtrl.dismiss(datao);
        }, (error) => {
          console.log('ERROR: ' + JSON.stringify(error));
        });
    } else {
      this.showAlert('Please select at least one weekday.');
    }
    let datao = { 'zone': this.zone };
    this.viewCtrl.dismiss(datao);
  }

  showAlert(myAlert) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: myAlert,
      buttons: ['OK']
    });
    alert.present();
  }
}
