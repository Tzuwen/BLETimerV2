import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { ValvesPage } from '../valves/valves';
import { ProgramDetailPage } from '../programdetail/programdetail';

@Component({
    selector: 'page-programmain',
    templateUrl: 'programmain.html'
})

export class ProgramMainPage {
    timerId: string;
    zoneId: number = 1;
    function: string = 'cycle';
    startTime: string = '1980-11-06T00:00:00.000Z';
    cycleBtnColor: string = 'primary';
    weeklyBtnColor: string = 'secondary';
    weeklyToolbarHide: boolean = true;
    hideDeleteBtn: boolean = true;

    isEnable: boolean = false;
    waterForSelected: string = '5 Mins';
    waterEverySelected: string = '4 Hours';
    waterForList = [];
    watereEeryList = [];

    ecoIsEnable: boolean = false;
    ecoWaterForSelected: string = '3 Mins';
    ecoPauseSelected: string = '3 Mins';
    ecoWaterForList = [];
    ecoPauseList = [];

    database: SQLite;
    weeklyDataList = [];

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public platform: Platform,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        this.timerId = this.params.get('timerId');
        this.zoneId = this.params.get('zoneId');
        platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({ name: "data.db", location: "default" }).then(() => {
                this.getCycleData();
            }, (error) => {
                //console.log("ERROR: ", error);
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

        this.watereEeryList = [{ item: '4 Hours' }, { item: '6 Hours' }, { item: '8 Hours' },
        { item: '12 Hours' }, { item: '1 Day' }, { item: '2 Days' }, { item: '3 Days' },
        { item: '4 Days' }, { item: '5 Days' }, { item: '6 Days' }, { item: '7 Days' }];
    }

    // nav to weekly detail page
    goToProgramDetailClick() {
        let programDetailModal = this.modalCtrl.create(ProgramDetailPage, { timerId: this.timerId, zoneId: this.zoneId, weeklyDataId: -1 });
        // if child page dismmissed
        programDetailModal.onDidDismiss(data => {
            this.function = "weekly";
            this.zoneId = data.zoneId;
            this.getWeeklyData();
        });
        programDetailModal.present();
    }

    functionBtnClicked(currentFuction) {
        // todo
        // change image of the button
        // for now, let's just change the color
        switch (currentFuction) {
            case 1:
                this.function = 'cycle';
                this.cycleBtnColor = 'primary';
                this.weeklyBtnColor = 'secondary';
                this.weeklyToolbarHide = true;
                this.getCycleData();
                break;
            case 2:
                this.function = 'weekly';
                this.cycleBtnColor = 'secondary';
                this.weeklyBtnColor = 'primary';
                this.weeklyToolbarHide = false;
                this.getWeeklyData();
                break;
        }
    }

    saveClicked() {
        var waterFor = this.getMinutes(this.waterForSelected);
        var waterEvery = this.getMinutes(this.waterEverySelected);
        var ecoWaterFor = this.getMinutes(this.ecoWaterForSelected);
        var ecoPause = this.getMinutes(this.ecoPauseSelected);

        this.database.executeSql("SELECT * FROM cycleSchedule WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
            if (data.rows.length > 0) {
                this.database.executeSql("UPDATE cycleSchedule SET StartTime = '" + this.startTime + "', " +
                    "WaterFor = '" + waterFor + "', " +
                    "WaterEvery = '" + waterEvery + "', " +
                    "IsEnable = '" + this.isEnable + "', " +
                    "EcoWaterFor = '" + ecoWaterFor + "', " +
                    "EcoPause = '" + ecoPause + "', " +
                    "EcoIsEnable = '" + this.ecoIsEnable + "' " +
                    "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
                        //console.log("UPDATED: " + JSON.stringify(data));
                        this.presentToast('Schedule saved');
                    }, (error) => {
                        //console.log("ERROR: " + JSON.stringify(error));
                    });
            } else {
                this.database.executeSql("INSERT INTO cycleSchedule (TimerId, ZoneId, StartTime, WaterFor, WaterEvery, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable) " +
                    "VALUES ('" + this.timerId + "', '" + this.zoneId + "', '" + this.startTime + "', '" + waterFor +
                    "', '" + waterEvery + "', '" + this.isEnable + "', '" + ecoWaterFor + "', '" + ecoPause + "', '" + this.ecoIsEnable + "')", []).then((data) => {
                        //console.log('INSERTED: ' + JSON.stringify(data));
                        this.presentToast('Schedule saved');
                    }, (error) => {
                        //console.log('ERROR: ' + JSON.stringify(error));                      
                    });
            }
        });
    }

    showDeleteClicked() {
        if (this.hideDeleteBtn == true) {
            this.hideDeleteBtn = false;
        } else {
            this.hideDeleteBtn = true;
        }
    }

    updateWeeklyIsEnable(weeklyData) {
         this.database.executeSql("UPDATE weeklySchedule set IsEnable = '" + weeklyData.isEnable + 
         "' WHERE id = '" + weeklyData.id + "'", []).then((data) => {
             if (weeklyData.isEnable == true) {
                 this.presentToast("Program On");
             } else {
                 this.presentToast("Program Off");
             }
        //console.log("update weekly isenable : " + JSON.stringify(data));
      }, (error) => {
          //console.log("ERROR(weekly): " + JSON.stringify(error));
      });
    }
 
    deleteWeeklyClicked(weeklyData) {       
        this.database.executeSql("DELETE FROM weeklySchedule WHERE id = '" + weeklyData.id + "'", []).then((data) => {
            //console.log("Weekly Schedule deleted: " + JSON.stringify(data));          
            this.presentToast('Schedule deleted');
            this.getWeeklyData();
        }, (error) => {
            //console.log("ERROR: " + JSON.stringify(error.err));
        });
    }

    editWeeklyClicked(weeklyData) {
        let programDetailModal = this.modalCtrl.create(ProgramDetailPage, { timerId: this.timerId, zoneId: this.zoneId, weeklyDataId: weeklyData.id });
        // if child page dismmissed
        programDetailModal.onDidDismiss(data => {
            this.function = "weekly";
            this.zoneId = data.zoneId;
            this.getWeeklyData();
        });
        programDetailModal.present();
    }

    private getCycleData() {
        this.database.executeSql("SELECT * FROM cycleSchedule " +
            "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
                if (data.rows.length > 0) {
                    this.startTime = data.rows.item(0).StartTime;
                    this.isEnable = data.rows.item(0).IsEnable;
                    this.waterForSelected = data.rows.item(0).WaterFor + ' Mins';
                    this.waterEverySelected = this.getWaterEvery(data.rows.item(0).WaterEvery);
                    this.ecoIsEnable = data.rows.item(0).EcoIsEnable;
                    this.ecoWaterForSelected = data.rows.item(0).EcoWaterFor + ' Mins';
                    this.ecoPauseSelected = data.rows.item(0).EcoPause + ' Mins';
                } else {
                    this.startTime = '1980-11-06T00:00:00.000Z';
                    this.isEnable = false;
                    this.waterForSelected = '5 Mins';
                    this.waterEverySelected = '4 Hours';
                    this.ecoIsEnable = false;
                    this.ecoWaterForSelected = '3 Mins';
                    this.ecoPauseSelected = '3 Mins';
                }
                //console.log("Load Cycle Data: " + JSON.stringify(data));
            }, (error) => {
                //console.log("ERROR(cycle): " + JSON.stringify(error));
            });
    }

    private getWeeklyData() {
        this.database.executeSql("SELECT * FROM weeklySchedule " +
            "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
                this.weeklyDataList = [];
                if (data.rows.length > 0) {                    
                    for (var i = 0; i < data.rows.length; i++) {
                        this.weeklyDataList.push({
                            id: data.rows.item(i).id,
                            startTime: this.formatTime(data.rows.item(i).StartTime),
                            isEnable: data.rows.item(i).IsEnable,
                            waterFor: data.rows.item(i).WaterFor + ' Mins',
                            waterDay: this.getWaterDays(data.rows.item(i).WaterDay),
                            ecoIsEnable: data.rows.item(i).EcoIsEnale,
                            ecoWaterFor: data.rows.item(i).EcoWaterFor + ' Mins',
                            ecoPause: data.rows.item(i).EcoPause + ' Mins'
                        });                        
                    }
                }
                //console.log("Load Weekly Data: " + JSON.stringify(data));
            }, (error) => {
                //console.log("ERROR(weekly): " + JSON.stringify(error));
            });
        this.hideDeleteBtn = true;
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

    private getWaterEvery(int: number) {
        var hours = int / 60;
        var result: string;
        return result = hours <= 12 ? hours + ' Hours' : hours / 24 == 1 ? hours / 24 + ' Day' : hours / 24 + ' Days';
    }

    private getWaterDays(str: string) {
        if (str != "") {
            var days = [{ item: 'Sun ' }, { item: 'Mon ' }, { item: 'Tue ' },
            { item: 'Wed ' }, { item: 'Thu ' }, { item: 'Fri ' }, { item: 'Sat' }];
            var weekString = "";
            for (var i = 0; i < 7; i++) {
                if (str.indexOf(i.toString()) >= 0) {
                    weekString += days[i].item;
                }
            }
        }
        return weekString;
    }

    private formatTime(time) {
        var hours = time.substring(11, 13);
        var minutes = time.substring(14, 16);
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
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
