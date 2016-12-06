import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Slides, ToastController } from 'ionic-angular';

@Component({
    selector: 'page-manual',
    templateUrl: 'manual.html'
})

export class ManualPage {

    timerId: string;
    zoneId: number = 1;
    isWatering: boolean = false;
    currentIndex: number = 0;
    sliderMins = [];
    //minSelected: string = '1';
    imgSrc = "assets/img/water-drop-off_g.png";
    timeRemain = 0;

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

    @ViewChild('mySlider1') slider1: Slides;

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public toastCtrl: ToastController) {
        this.timerId = this.params.get('timerId');
        this.zoneId = this.params.get('zoneId');
    }

    ionViewDidLoad() {
        // var j = 35
        // for (var i = -1; i <= 97; i++) {
        //     if (i == -1 || i == 97) {
        //         this.sliderMins.push({ item: '' });
        //     } else if (i > 30 && i < 97) {
        //         this.sliderMins.push({ item: j });
        //         j += 5;
        //     } else {
        //         if (i != 0) {
        //             this.sliderMins.push({ item: i });
        //         }
        //     }
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
    }

    manualEnable() {
        this.isWatering = !this.isWatering;
        if (this.isWatering) {
            this.imgSrc = "assets/img/water-drop-on.png";
            this.presentToast('Start water for ' + this.waterForSelected);           
            this.countdownStart(this.getMinutes(this.waterForSelected) * 60);
        }
        else {
            this.imgSrc = "assets/img/water-drop-off_g.png";
            this.presentToast('Stop manual watering');
        }
    }

    startClicked() {
        var minutes = (this.slider1.getActiveIndex() + 1);
        if (minutes == -1 || minutes >= 97) {
            if (minutes == -1) {
                minutes = 5;
            } else {
                minutes = 360;
            }
        } else {
            minutes = this.sliderMins[minutes].item;
        }
        this.isWatering = true;
        this.presentToast('Start water for ' + this.waterForSelected);
    }

    stopClicked() {
        this.isWatering = false;
        this.presentToast('Stop manual watering');
    }

    countdownStart(duration: number) {  
        console.log(duration);     
        setInterval(function () {
            if (duration > 0) {                
                duration--;
                console.log(duration);                
            }            
        }, 1000);
        this.timeRemain = duration;
    }

    // countdownStart(duration: number) {
    //     var timer = duration, minutes, seconds;
    //     setInterval(function () {
    //         minutes = parseInt((timer / 60).toString(), 10);
    //         seconds = parseInt((timer % 60).toString(), 10);)
    //         minutes = minutes < 10 ? "0" + minutes : minutes;
    //         seconds = seconds < 10 ? "0" + seconds : seconds;
    //         this.timerRemain = minutes + ':' + seconds;

    //         if (timer > 0) {
    //             console.log(this.timerRemain);
    //             timer--;
    //         }
    //     }, 1000);
    // }

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
        if (strsplited[1] == 'Minutes') {
            result = strsplited[0];
        } else if (strsplited[1] == 'Hours') {
            result = strsplited[0] * 60;
        } else {
            result = (strsplited[0] * 24) * 60;
        }
        return result;
    }
}
