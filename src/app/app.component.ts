import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';
import { TimersPage } from '../pages/timers/timers';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TimersPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // SQLite
      let db = new SQLite();

      // create cycle database
      db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS cycleSchedule (" +
          "TimerId TEXT, TimerName TEXT, Zone TEXT, ZoneName TEXT, StartTime TEXT, " +
          "WaterFor TEXT, WaterEvery TEXT, IsEnable INTEGER, EcoWaterFor TEXT, EcoPause TEXT, EcoIsEnable INTEGER, Img TEXT)",
          {}).then((data) => {
            console.log("TABLE CREATED: ", data);
          }, (error) => {
            console.error("Unable to execute sql", error);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });

      // create weekly database
      db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS weeklySchedule (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "TimerId TEXT, TimerName TEXT, Zone TEXT, ZoneName TEXT, StartTime TEXT, " +
          "WaterFor TEXT, WaterDay TEXT, IsEnable INTEGER, EcoWaterFor TEXT, EcoPause TEXT, EcoIsEnable INTEGER, Img TEXT)",
          {}).then((data) => {
            console.log("TABLE CREATED: ", data);
          }, (error) => {
            console.error("Unable to execute sql", error);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });
    });
  }
}
