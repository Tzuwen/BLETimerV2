import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Camera } from "ionic-native";
import { ValvesPage } from '../valves/valves';

@Component({
  selector: 'page-timers',
  templateUrl: 'timers.html'
})
export class TimersPage {

  isScan: boolean = false;
  scanText: string = 'SCAN';
  scanColor: string = 'primary';
  public base64Image: string = "assets/img/camera.png";
  timers = [];

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public platform: Platform) {
  }

  goToValves(timerId, zones) {
    // reset the scan button
    this.isScan = false;
    this.scanText = 'SCAN';
    this.scanColor = 'primary';
    this.navCtrl.push(ValvesPage, { timerId: timerId, zones: zones });
  }

  scan() {
    // this is just for demo
    this.timers = [
      { timerId: 'Timer-001', zones: 1, Image: this.base64Image },
      { timerId: 'Timer-002', zones: 2, Image: this.base64Image },
      { timerId: 'Timer-003', zones: 4, Image: this.base64Image }
    ];

    // todo
    // scan ble device using cordova plugin

    if (this.isScan == false) {
      this.isScan = true;
      this.scanText = 'STOP';
      this.scanColor = 'danger';
    }
    else {
      this.isScan = false;
      this.scanText = 'SCAN';
      this.scanColor = 'primary';
    }
  }

  public takePicture(timer) {
    if (this.platform.is('ios')) {
      console.log("I'm an iOS device!");
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.NATIVE_URI,
        //destinationType: Camera.DestinationType.DATA_URL, // DATA_URL might cause memory problem
        //sourceType : Camera.PictureSourceType.CAMERA,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 180,
        targetHeight: 120,
        saveToPhotoAlbum: false
      }).then(imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        timer.Image = this.base64Image;
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    } else if (this.platform.is('android')) {
      console.log("I'm an Android device!");
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL, // DATA_URL might cause memory problem
        //sourceType : Camera.PictureSourceType.CAMERA,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 180,
        targetHeight: 120,
        saveToPhotoAlbum: false
      }).then(imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        timer.Image = this.base64Image;
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }

  }
}
