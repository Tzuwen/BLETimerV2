import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ProgramDetailPage } from '../programdetail/programdetail';
//import { Global } from '../../app/global';


@Component({
    selector: 'page-programmain',
    templateUrl: 'programmain.html'
})

export class ProgramMainPage {
    timerId: string;
    zone: string = '1';
    function: string = 'cycle';
    currentTime: string = '1980-11-06T00:00:00.000Z';
    ecoOn: boolean = false;

    cycleBtnColor = 'primary';
    weeklyBtnColor = 'secondary';
    zone1BtnColor = 'primary';
    zone2BtnColor = 'secondary';
    zone3BtnColor = 'secondary';
    zone4BtnColor = 'secondary';

    waterForSelected: string = '5 Mins';
    waterEverySelected: string = '4 Hours';
    ecoWaterForSelected: string = '3 Mins';
    ecoPauseSelected: string = '3 Mins';
    waterForList = [];
    watereEeryList = [];
    ecoWaterForList = [];
    ecoPauseList = [];

    constructor(
        public navCtrl: NavController,
        public params: NavParams,
        public modalCtrl: ModalController) {
            this.timerId = this.params.get('timerId');
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

        this.watereEeryList = [
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

    public functionBtnClicked(currentFuction) {
        switch (currentFuction) {
            case 1:
                this.function = 'cycle';
                // todo
                // change image of the button
                // for now, let's just change the color
                this.cycleBtnColor = 'primary';
                this.weeklyBtnColor = 'secondary';
                break;
            case 2:
                this.function = 'weekly';
                // todo
                // change image of the button
                // for now, let's just change the color
                this.cycleBtnColor = 'secondary';
                this.weeklyBtnColor = 'primary';
                break;
        }
    }
}
