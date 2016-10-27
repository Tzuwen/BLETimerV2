import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ProgramDetailPage } from '../programdetail/programdetail';

@Component({
    selector: 'page-programmain',
    templateUrl: 'programmain.html'
})

export class ProgramMainPage {
    timerId: string;
    zone: string = "1";
    function: string = "cycle";
    currentTime: string = new Date().toISOString();  
    ecoOn: boolean = false;

    waterForSelected: string = "5 Mins";
    waterEverySelected: string = "4 Hours";
    ecoWaterForSelected: string = "3 Mins";
    ecoPauseSelected: string = "3 Mins";
    waterForList = [];
    watereEeryList = [
        { item: '4 Hours' },
        { item: '6 Hours' },
        { item: '8 Hours' },
        { item: '12 Hours' },
        { item: '1 Day' },
        { item: '2 Days' },
        { item: '3 Days' },
        { item: '4 Days' },
        { item: '5 Days' },
        { item: '6 Days' },
        { item: '7 Days' }];
    ecoWaterForList = [];
    ecoPauseList = [];

    constructor(public navCtrl: NavController, public params: NavParams, public modalCtrl: ModalController ) {
        this.timerId = params.get("timerId");
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

    // nav to weekly detail page
    goProgramDetailClick() {
        let programDetailModal = this.modalCtrl.create(ProgramDetailPage, { timerId: this.timerId, zone: this.zone });
        // if child page dismmissed
        programDetailModal.onDidDismiss(data => {
            this.function = "weekly";
            this.zone = data.zone;
        });

        programDetailModal.present();
    }
}
