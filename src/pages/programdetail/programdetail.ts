import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-programdetail',
  templateUrl: 'programdetail.html'
})
export class ProgramDetailPage {
  timerId: string;
  zoneId: number;
  weeklyDataId: number;
  startTime: string = '1980-11-06T00:00:00.000Z';
  weekdaySelected: string = '';


  waterForSelected: string = '5 Mins';
  waterForList = [];

  ecoIsEnable: boolean = false;
  ecoWaterForSelected: string = '3 Mins';
  ecoPauseSelected: string = '3 Mins';
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
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.timerId = params.get('timerId');
    this.zoneId = params.get('zoneId');
    this.weeklyDataId = params.get('weeklyDataId');
    platform.ready().then(() => {
      this.database = new SQLite();
      this.database.openDatabase({ name: "bleDB.db", location: "default" }).then(() => {
        if (this.weeklyDataId != -1) {
          // load weekly data by id
          this.loadWeeklyData();
        }
      }, (error) => {
        console.log("ERROR: ", error);
      });
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

  weekdayBtnClicked(currentDay) {
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
    let datao = { 'zoneId': this.zoneId };
    this.viewCtrl.dismiss(datao);
  }

  saveClicked() {
    var waterFor = this.getMinutes(this.waterForSelected);
    var ecoWaterFor = this.getMinutes(this.ecoWaterForSelected);
    var ecoPause = this.getMinutes(this.ecoPauseSelected);

    this.weekdays.forEach(element => {
      if (element.isEnable == true) {
        this.weekdaySelected += element.id.toString();
      }
    });

    if (this.weekdaySelected != '') {
      this.database.executeSql("SELECT * FROM weeklySchedule WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "' and id = '" + this.weeklyDataId + "'", []).then((data) => {
        if (data.rows.length > 0) {
          this.database.executeSql("UPDATE weeklySchedule SET StartTime = '" + this.startTime + "', " +
            "WaterFor = '" + waterFor + "', " +
            "WaterDay = '" + this.weekdaySelected + "', " +
            "IsEnable = '1', " +
            "EcoWaterFor = '" + ecoWaterFor + "', " +
            "EcoPause = '" + ecoPause + "', " +
            "EcoIsEnable = '" + this.ecoIsEnable + "' " +
            "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "' and id ='" + this.weeklyDataId + "'", []).then((data) => {
              //console.log("UPDATED: " + JSON.stringify(data));
              this.presentToast('Schedule saved');
              let datao = { 'zoneId': this.zoneId };
              this.viewCtrl.dismiss(datao);
            }, (error) => {
              //console.log("ERROR: " + JSON.stringify(error));
            });
        } else {
          this.database.executeSql("INSERT INTO weeklySchedule (TimerId, ZoneId, StartTime, WaterFor, WaterDay, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable) " +
            "VALUES ('" + this.timerId + "', '" + this.zoneId + "', '" + this.startTime + "', '" + waterFor +
            "', '" + this.weekdaySelected + "', 1, '" + ecoWaterFor + "', '" + ecoPause + "', '" + this.ecoIsEnable + "')", []).then((data) => {
              //console.log('INSERTED: ' + JSON.stringify(data));
              this.presentToast('Schedule saved');
              let datao = { 'zoneId': this.zoneId };
              this.viewCtrl.dismiss(datao);
            }, (error) => {
              //console.log('ERROR: ' + JSON.stringify(error));
            });
        }
      });
    } else {
      this.presentAlert('Please select at least one weekday.');
    }
  }

  private loadWeeklyData() {
    this.database.executeSql("SELECT * FROM weeklySchedule " +
      "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "' and id = '" + this.weeklyDataId + "'", []).then((data) => {
        if (data.rows.length > 0) {
          this.startTime = data.rows.item(0).StartTime;
          this.waterForSelected = data.rows.item(0).WaterFor + ' Mins';
          this.ecoIsEnable = data.rows.item(0).EcoIsEnable;
          this.ecoWaterForSelected = data.rows.item(0).EcoWaterFor + ' Mins';
          this.ecoPauseSelected = data.rows.item(0).EcoPause + ' Mins';
          var days = data.rows.item(0).WaterDay.split("");
          for (var i = 0; i < days.length; i++) {
            this.weekdayBtnClicked(days[i]);
          }
        }
        //console.log("Load Weekly Data: " + JSON.stringify(data));
      }, (error) => {
        //console.log("ERROR(weekly): " + JSON.stringify(error));
      });

  }

  private getMinutes(str: string) {
    var strsplited = strsplited = str.split(' ');
    var result: number = 0;
    if (strsplited[1] == 'Mins') {
      result = strsplited[0];
    } else if (strsplited[1] == 'Hours') {
      result = strsplited[0] * 60;
    } else {
      result = (strsplited[0] * 24) * 60;
    }
    return result;
  }

  private presentAlert(myAlert) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: myAlert,
      buttons: ['OK']
    });
    alert.present();
  }

  private presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
}
