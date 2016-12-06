import { CompileMetadataWithIdentifier } from '@angular/compiler';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
  selector: 'page-programdetail',
  templateUrl: 'programdetail.html'
})
export class ProgramDetailPage {
  timerSpec: {};
  timerModel: string;
  timerId: string;
  zoneId: number;
  ecoFunction: boolean;
  sensorFunction: boolean;
  weeklyDataId: number;
  cycleId: string;
  startTime: string = '1980-11-06T00:00:00.000Z';
  weekdaySelected: string = '';


  waterForSelected: string = '5 Minutes';
  waterForList = [];

  ecoIsEnable: boolean = false;
  ecoWaterForSelected: string = '3 Minutes';
  ecoPauseSelected: string = '3 Minutes';
  ecoWaterForList = [];
  ecoPauseList = [];

  moistSelected = "MEDIUM";
  sensorMoistList = [{ item: 'DRY' }, { item: 'MOIST' }, { item: 'MEDIUM' },
  { item: 'WET' }, { item: 'WETTEST' }];

  weekdays = [
    { id: 0, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off0_g.png' },
    { id: 1, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off1_g.png' },
    { id: 2, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off2_g.png' },
    { id: 3, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off3_g.png' },
    { id: 4, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off4_g.png' },
    { id: 5, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off5_g.png' },
    { id: 6, isEnable: false, color: 'secondary', img: 'assets/img/water-drop-off6_g.png' }
  ]

  database: SQLite;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.timerSpec = params.get('timerSpec');
    this.timerModel = params.get('timerSpec').timerModel;
    this.timerId = params.get('timerId');
    this.zoneId = params.get('zoneId');
    this.ecoFunction = params.get('timerSpec').ecoFunction;
    this.sensorFunction = params.get('timerSpec').sensorFunction;
    this.weeklyDataId = params.get('weeklyDataId');
    this.cycleId = this.ecoFunction == true ? "" : ", Cycle " + params.get('cycleId');
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
      this.waterForList.push({ item: j + ' Minutes' });
      j += 5;
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoWaterForList.push({ item: i + ' Minutes' });
    }

    for (var i = 3; i <= 30; i++) {
      this.ecoPauseList.push({ item: i + ' Minutes' });
    }
  }

  weekdayBtnClicked(currentDay) {
    this.weekdays.forEach(element => {
      if (element.id == currentDay) {
        if (element.isEnable == true) {
          element.isEnable = false;
          element.img = "assets/img/water-drop-off" + currentDay + "_g.png";
          //element.color = 'secondary';
        } else {
          element.isEnable = true;
          element.img = "assets/img/water-drop-on" + currentDay + ".png";
          //element.color = 'primary';
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
            "EcoIsEnable = '" + this.ecoIsEnable + "', " +
            "Moist = '" + this.moistSelected + "' " +
            "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "' and id ='" + this.weeklyDataId + "'", []).then((data) => {
              console.log("UPDATED: " + JSON.stringify(data));
              this.presentToast('Schedule saved');
              let datao = { 'zoneId': this.zoneId };
              this.viewCtrl.dismiss(datao);
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
            });
        } else {
          this.database.executeSql("INSERT INTO weeklySchedule (TimerId, ZoneId, StartTime, WaterFor, WaterDay, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable, Moist) " +
            "VALUES ('" + this.timerId + "', '" + this.zoneId + "', '" + this.startTime + "', '" + waterFor +
            "', '" + this.weekdaySelected + "', 1, '" + ecoWaterFor + "', '" + ecoPause + "', '" + this.ecoIsEnable + "', '" + this.moistSelected + "')", []).then((data) => {
              console.log('INSERTED: ' + JSON.stringify(data));
              this.presentToast('Schedule saved');
              let datao = { 'zoneId': this.zoneId };
              this.viewCtrl.dismiss(datao);
            }, (error) => {
              console.log('ERROR: ' + JSON.stringify(error));
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
          this.waterForSelected = data.rows.item(0).WaterFor + ' Minutes';
          this.ecoIsEnable = data.rows.item(0).EcoIsEnable;
          this.ecoWaterForSelected = data.rows.item(0).EcoWaterFor + ' Minutes';
          this.ecoPauseSelected = data.rows.item(0).EcoPause + ' Minutes';
          this.moistSelected = data.rows.item(0).Moist;
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
    if (strsplited[1] == 'Minutes') {
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
