import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Camera } from "ionic-native";
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-valves',
  templateUrl: 'valves.html'
})
export class ValvesPage {
  timerSpec: {};
  timerModel: string;
  timerId: string;
  zones: number;
  zoneSelected: number;
  public base64Image: string = "assets/img/camera.png";
  zoneList = [];

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public platform: Platform) {
    this.timerSpec = params.get('timerSpec');
    this.timerModel = params.get('timerSpec').timerModel;
    this.timerId = params.get('timerId');
    this.zones = params.get('timerSpec').zones;
  }

  ionViewDidLoad() {
    // todo, load zones from db
    for (var i = 1; i <= this.zones; i++) {
      this.zoneList.push({ id: i, Image: this.base64Image });
    }
  }

  goToTabs(zoneId) {
    this.zoneSelected = zoneId;
    this.navCtrl.push(TabsPage, { timerSpec: this.timerSpec, timerId: this.timerId, zoneId: this.zoneSelected });
  }

  public takePicture(zone) {
    if (this.platform.is('ios')) {
      // This will only print when on iOS
      console.log("I'm an iOS device!");
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.NATIVE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        //sourceType : Camera.PictureSourceType.CAMERA,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 180,
        targetHeight: 120,
        saveToPhotoAlbum: false
      }).then(imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        zone.Image = this.base64Image;
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    } else if (this.platform.is('android')) {
      console.log("I'm an Android device!");
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        //sourceType : Camera.PictureSourceType.CAMERA,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 180,
        targetHeight: 120,
        saveToPhotoAlbum: false
      }).then(imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        zone.Image = this.base64Image;
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }

  }
}
