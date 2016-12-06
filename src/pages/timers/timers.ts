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
  timerModels = [
      { timerModel: 'LCDws-1V', zones: 1, ecoFunction: false, sensorFunction: false },// LCD with wire sensor
      { timerModel: 'LCDws-2V', zones: 2, ecoFunction: false, sensorFunction: false },
      { timerModel: 'LCDws-4V', zones: 4, ecoFunction: false, sensorFunction: false },
      { timerModel: 'LCDrfs-1V', zones: 1, ecoFunction: false, sensorFunction: true },// LCD with rf sensor
      { timerModel: 'LCDrfs-2V', zones: 2, ecoFunction: false, sensorFunction: true },
      { timerModel: 'LCDrfs-4V', zones: 4, ecoFunction: false, sensorFunction: true },
      { timerModel: 'BLEws-1V', zones: 1, ecoFunction: true, sensorFunction: false },// Only wire sensor, no LCD
      { timerModel: 'BLEws-2V', zones: 2, ecoFunction: true, sensorFunction: false },
      { timerModel: 'BLEws-4V', zones: 4, ecoFunction: true, sensorFunction: false }
    ];
      
  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public platform: Platform) {
  }

  goToValves(timerModel, timerId) {
    // reset the scan button
    this.isScan = false;
    this.scanText = 'SCAN';
    this.scanColor = 'primary';
    // get model spec
    this.timerModels.forEach(element => {
      if (element.timerModel == timerModel) {       
        this.navCtrl.push(ValvesPage, { timerSpec: element, timerId: timerId });
      }
    });
    
  }

  scan() {
    // this is just for demo
    this.timers = [
      { timerModel: 'LCDws-1V', timerId: 'aa:bb:cc:dd:ee:ff', Image: this.base64Image },
      { timerModel: 'LCDrfs-2V', timerId: '11:22:33:44:55:66', Image: this.base64Image },
      { timerModel: 'BLEws-4V', timerId: 'a1:b1:c1:d1:e1:f1', Image: this.base64Image }
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
        //destinationType: Camera.DestinationType.NATIVE_URI,
        destinationType: Camera.DestinationType.DATA_URL, // DATA_URL might cause memory problem
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
        //destinationType: Camera.DestinationType.FILE_URI,
        destinationType: Camera.DestinationType.DATA_URL, // DATA_URL might cause memory problem
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
