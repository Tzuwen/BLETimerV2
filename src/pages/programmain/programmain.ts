import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, ModalController, AlertController, ToastController, ItemSliding } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { ValvesPage } from '../valves/valves';
import { ProgramDetailPage } from '../programdetail/programdetail';

@Component({
    selector: 'page-programmain',
    templateUrl: 'programmain.html'
})

export class ProgramMainPage {
    timerSpec: {};
    timerModel: string;
    timerId: string;
    zoneId: number;    

    ecoFunction: boolean;
    sensorFunction: boolean;

    function: string = 'cycle';
    startTime: string = '1980-11-06T00:00:00.000Z';
    cycleBtnColor: string = 'primary';
    weeklyBtnColor: string = 'secondary';
    weeklyToolbarHide: boolean = true;
    hideMainDeleteBtn: boolean = true;
    hideMinorDeleteBtn: boolean = true;

    isEnable: boolean = false;
    waterForSelected: string = '5 Minutes';
    waterEverySelected: string = '4 Hours';
    waterForList = [];
    watereEeryList = [{ item: '4 Hours' }, { item: '6 Hours' }, { item: '8 Hours' },
        { item: '12 Hours' }, { item: '1 Day' }, { item: '2 Days' }, { item: '3 Days' },
        { item: '4 Days' }, { item: '5 Days' }, { item: '6 Days' }, { item: '7 Days' }];

    ecoIsEnable: boolean = false;
    ecoWaterForSelected: string = '3 Minutes';
    ecoPauseSelected: string = '3 Minutes';
    ecoWaterForList = [];
    ecoPauseList = [];

    moistSelected = 3;
    // sensorMoistList = [{ item: 'DRY' }, { item: 'MOIST' }, { item: 'MEDIUM' },
    //     { item: 'WET' }, { item: 'WETTEST' }];

    database: SQLite;
    weeklyDataList = [];

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public platform: Platform,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        this.timerSpec = params.get('timerSpec');
        this.timerModel = params.get('timerSpec').timerModel;
        this.timerId = params.get('timerId');
        this.zoneId = params.get('zoneId');
        this.ecoFunction = params.get('timerSpec').ecoFunction;
        this.sensorFunction = params.get('timerSpec').sensorFunction;
    }

    ngOnInit() {
        this.database = new SQLite();
        this.database.openDatabase({ name: "bleDB.db", location: "default" }).then(() => {
            this.getCycleData();
        }, (error) => {
            //console.log("ERROR: ", error);
        });
    }

    ionViewDidLoad() {
        // var j = 5;
        // for (var i = 0; i < 52; i++) {
        //     this.waterForList.push({ item: j + ' Minutes' });
        //     j += 5;
        // }

        var j = 35
        for (var i = 1; i <= 96; i++) {
            var unit = " Minutes"
            if (i > 30) {
                this.waterForList.push({ item: j + unit });
                j += 5;
            } else {
                if (i == 1) {
                    unit = " Minute";
                }
                this.waterForList.push({ item: i + unit });
            }
        }

        for (var i = 3; i <= 30; i++) {
            this.ecoWaterForList.push({ item: i + ' Minutes' });
        }

        for (var i = 3; i <= 30; i++) {
            this.ecoPauseList.push({ item: i + ' Minutes' });
        }
    }

    // nav to weekly detail page
    goToProgramDetailClick() {
        let programDetailModal = this.modalCtrl.create(ProgramDetailPage, { timerSpec: this.timerSpec, timerId: this.timerId, zoneId: this.zoneId, weeklyDataId: -1 });
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
                    "EcoIsEnable = '" + this.ecoIsEnable + "', " +
                    "Moist = '" + this.moistSelected + "' " +
                    "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
                        //console.log("UPDATED: " + JSON.stringify(data));
                        this.presentToast('Schedule saved');
                    }, (error) => {
                        //console.log("ERROR: " + JSON.stringify(error));
                    });
            } else {
                this.database.executeSql("INSERT INTO cycleSchedule (TimerId, ZoneId, StartTime, WaterFor, WaterEvery, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable, Moist) " +
                    "VALUES ('" + this.timerId + "', '" + this.zoneId + "', '" + this.startTime + "', '" + waterFor +
                    "', '" + waterEvery + "', '" + this.isEnable + "', '" + ecoWaterFor + "', '" + ecoPause + "', '" + this.ecoIsEnable + "', '" + this.moistSelected + "')", []).then((data) => {
                        //console.log('INSERTED: ' + JSON.stringify(data));
                        this.presentToast('Schedule saved');
                    }, (error) => {
                        //console.log('ERROR: ' + JSON.stringify(error));
                    });
            }
        });
    }

    showDeleteClicked() {
        this.hideMinorDeleteBtn = !this.hideMinorDeleteBtn;
    }

    updateWeeklyIsEnable(weeklyData) {
        console.log(weeklyData.waterDay);
        if (weeklyData.waterDay == "") {
            this.editWeeklyClicked(weeklyData);
        } else {
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
    }

    editWeeklyClicked(weeklyData) {
        let programDetailModal = this.modalCtrl.create(ProgramDetailPage, { timerSpec: this.timerSpec, timerId: this.timerId, zoneId: this.zoneId, weeklyDataId: weeklyData.id, cycleId: weeklyData.cycleId });
        // if child page dismmissed
        programDetailModal.onDidDismiss(data => {
            this.function = "weekly";
            this.zoneId = data.zoneId;
            this.getWeeklyData();
        });
        programDetailModal.present();
    }

    deleteWeeklyClicked(weeklyData) {
        console.log(weeklyData);
        this.database.executeSql("DELETE FROM weeklySchedule WHERE id = '" + weeklyData.id + "'", []).then((data) => {
            //console.log("Weekly Schedule deleted: " + JSON.stringify(data));          
            this.presentToast('Schedule deleted');
            this.getWeeklyData();
        }, (error) => {
            //console.log("ERROR: " + JSON.stringify(error.err));
        });
    }

    private getCycleData() {
        this.database.executeSql("SELECT * FROM cycleSchedule " +
            "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
                if (data.rows.length > 0) {
                    this.startTime = data.rows.item(0).StartTime;
                    this.isEnable = data.rows.item(0).IsEnable;
                    this.waterForSelected = data.rows.item(0).WaterFor + ' Minutes';
                    this.waterEverySelected = this.getWaterEvery(data.rows.item(0).WaterEvery);
                    this.ecoIsEnable = data.rows.item(0).EcoIsEnable;
                    this.ecoWaterForSelected = data.rows.item(0).EcoWaterFor + ' Minutes';
                    this.ecoPauseSelected = data.rows.item(0).EcoPause + ' Minutes';
                    this.moistSelected = data.rows.item(0).Moist
                } else {
                    this.startTime = '1980-11-06T00:00:00.000Z';
                    this.isEnable = false;
                    this.waterForSelected = '5 Minutes';
                    this.waterEverySelected = '4 Hours';
                    this.ecoIsEnable = false;
                    this.ecoWaterForSelected = '3 Minutes';
                    this.ecoPauseSelected = '3 Minutes';
                    this.moistSelected = 3;
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
                // if is LCD model, include cycleList
                var cycleList = ['A', 'B', 'C', 'D'];
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        this.weeklyDataList.push({
                            id: data.rows.item(i).id,
                            startTime: this.formatTime(data.rows.item(i).StartTime),
                            isEnable: data.rows.item(i).IsEnable,
                            waterFor: data.rows.item(i).WaterFor + ' Minutes',
                            waterDay: this.getWaterDays(data.rows.item(i).WaterDay),
                            ecoIsEnable: data.rows.item(i).EcoIsEnale,
                            ecoWaterFor: data.rows.item(i).EcoWaterFor + ' Minutes',
                            ecoPause: data.rows.item(i).EcoPause + ' Minutes',
                            moist: data.rows.item(i).Moist,
                            cycleId: this.ecoFunction == true ? "" : cycleList[i]
                        });
                    }
                    this.hideMainDeleteBtn = false;
                } else {
                    this.hideMainDeleteBtn = true;
                    // insert new data if db is null
                    if (this.ecoFunction != true)
                    {
                        this.initialWeeklyData();
                    }
                }
                //console.log("Load Weekly Data: " + JSON.stringify(data));
            }, (error) => {
                //console.log("ERROR(weekly): " + JSON.stringify(error));
            });
        this.hideMinorDeleteBtn = true;
    }

    // this is for the ble lcd moduel water timer
    private initialWeeklyData() {
        for (var i = 0; i <= 3; i++) {
            var startTime = "1980-11-06T00:00:00.000Z";
            var waterFor = 5;
            var weekdaySelected: string = "";
            var ecoWaterFor = 3;
            var ecoPause = 3;
            var moist = "MEDIUM";

            this.database.executeSql("INSERT INTO weeklySchedule (TimerId, ZoneId, StartTime, WaterFor, WaterDay, IsEnable, EcoWaterFor, EcoPause, EcoIsEnable, Moist) " +
                "VALUES ('" + this.timerId + "', '" + this.zoneId + "', '" + startTime + "', '" + waterFor +
                "', '" + weekdaySelected + "', 0, '" + ecoWaterFor + "', '" + ecoPause + "', 0, '" + moist + "')", []).then((data) => {
                    //console.log('INSERTED: ' + JSON.stringify(data));              
                }, (error) => {
                    //console.log('ERROR: ' + JSON.stringify(error));
                });
        }
        this.getWeeklyData();
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

    private getWaterEvery(int: number) {
        var hours = int / 60;
        var result: string;
        return result = hours <= 12 ? hours + ' Hours' : hours / 24 == 1 ? hours / 24 + ' Day' : hours / 24 + ' Days';
    }

    private getWaterDays(str: string) {
        var weekString = "";
        var count = 0;
        if (str != "") {
            var days = [{ item: 'SU' }, { item: 'MO' }, { item: 'TU' },
            { item: 'WE' }, { item: 'TH' }, { item: 'FR' }, { item: 'SA' }];

            for (var i = 0; i < 7; i++) {
                if (str.indexOf(i.toString()) >= 0) {
                    weekString += days[i].item;
                    count++;
                    if (count < str.length && weekString != "") {
                        weekString += ",";
                    }
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
