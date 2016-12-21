import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Component({
    selector: 'page-manual',
    templateUrl: 'manual.html'
})

export class ManualPage {

    timerId: string;
    zoneId: number = 1;

    currentIndex: number = 0;
    sliderMins = [];
    imgSrc = "assets/img/water-drop-off_g.png";

    started: boolean = false;
    startTime: string;
    stoped: boolean = false;
    isWatering: boolean = false;
    timeRemain: number;
    showTime: string;
    

    waterForSelected: string = '5 Minutes';
    waterForList = [];

    mySlideOptions1 = {
        initialSlide: 0,
        direction: 'vertical',
        loop: false,
        speed: 10,
        freeMode: true,
        freeModeSticky: true,
        slidesPerView: 3,
        spaceBetween: 50,
        effect: 'coverflow',
        coverflow: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false
        }
    };

    database: SQLite;
    weeklyDataList = [];

    @ViewChild('mySlider1') slider1: Slides;

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public toastCtrl: ToastController) {
        this.timerId = this.params.get('timerId');
        this.zoneId = this.params.get('zoneId');
    }

    ionViewDidLoad() {
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

        if (this.isWatering == false && this.started == false && this.stoped == false) {
            this.showTime = this.secondsToHms(this.getMinutes(this.waterForSelected) * 60);
        }
    }

    // private getManualData() {
    //     this.database.executeSql("SELECT * FROM manualSchedule " +
    //         "WHERE TimerId = '" + this.timerId + "' and ZoneId = '" + this.zoneId + "'", []).then((data) => {
    //             if (data.rows.length > 0) {
    //                 this.startTime = data.rows.item(0).StartTime;
    //                 this.started = data.rows.item(0).Started;
    //                 this.stoped = data.rows.item(0).Stoped;
    //                 this.isWatering = data.rows.item(0).IsWatering;
    //                 this.timeRemain = data.rows.item(0).TimeRemain;
    //             } else {
    //                 this.resumeClicked();
    //             }
    //             //console.log("Load Cycle Data: " + JSON.stringify(data));
    //         }, (error) => {
    //             //console.log("ERROR(cycle): " + JSON.stringify(error));
    //         });
    // }

    selectedChanged() {
        if (this.isWatering == false && this.started == false && this.stoped == false) {
            this.showTime = this.secondsToHms(this.getMinutes(this.waterForSelected) * 60);
        }
    }

    startClicked() {
        this.isWatering = true;
        this.started = true;
        this.stoped = false;
        this.imgSrc = "assets/img/water-drop-on.png";
        this.countdownStart(this.getMinutes(this.waterForSelected) * 60);
    }

    resumeClicked() {
        this.isWatering = true;
        this.stoped = false;
        this.imgSrc = "assets/img/water-drop-on.png";
        this.countdownStart(this.timeRemain);
    }

    pauseClicked() {
        this.isWatering = false;
        this.stoped = true;
        this.imgSrc = "assets/img/water-drop-off_g.png";
    }

    resetClicked() {
        this.isWatering = false;
        this.started = false;
        this.stoped = false;
        this.imgSrc = "assets/img/water-drop-off_g.png";
        this.showTime = this.secondsToHms(this.getMinutes(this.waterForSelected) * 60);
    }

    countdownStart(duration: number) {
        if (this.started == true && this.stoped == false) {
            setTimeout(() => {
                duration--;
                if (duration > -1) {
                    this.countdownStart(duration);
                    this.timeRemain = duration;
                }
                else {
                    this.isWatering = false;
                    this.started = false;
                    this.stoped = false;
                    this.timeRemain = 0;
                    duration = 0;
                    this.imgSrc = "assets/img/water-drop-off_g.png";
                }
            }, 1000);
        }
        if (duration == 0) {
            this.showTime = this.secondsToHms(this.getMinutes(this.waterForSelected) * 60);
        } else {
            this.showTime = this.secondsToHms(duration);
        }

    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 1500,
            position: 'top'
        });
        toast.present();
    }

    onSlideChanged() {
        // console.log(this.slider1.getActiveIndex());
    }

    private getMinutes(str: string) {
        var strsplited = strsplited = str.split(' ');
        var result: number = 0;
        if (strsplited[1] == 'Minutes' || strsplited[1] == 'Minute') {
            result = strsplited[0];
        } else if (strsplited[1] == 'Hours') {
            result = strsplited[0] * 60;
        } else {
            result = (strsplited[0] * 24) * 60;
        }
        return result;
    }

    private secondsToHms(d) {
        d = Number(d);        
        var m = Math.floor(d / 60);
        var s = Math.floor(d % 3600 % 60);        
        var mDisplay = m < 10 ? '0' + m.toString() : m.toString();
        var sDisplay = s < 10 ? '0' + s.toString() : s.toString();
        return mDisplay + ":" + sDisplay;
        // d = Number(d);
        // var h = Math.floor(d / 3600);
        // var m = Math.floor(d % 3600 / 60);
        // var s = Math.floor(d % 3600 % 60);

        // var hDisplay = h < 10 ? '0' + h.toString() : h.toString();
        // var mDisplay = m < 10 ? '0' + m.toString() : m.toString();
        // var sDisplay = s < 10 ? '0' + s.toString() : s.toString();
        // return hDisplay + ":" + mDisplay + ":" + sDisplay;
    }

    
}
