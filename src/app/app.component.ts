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

      // create database
       db.openDatabase({
        name: "bleDB.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS bleTimer (" +
          "TimerName TEXT, TimerId TEXT, ZoneId INTEGER, PhotoPath TEXT, CurrentMode TEXT, RainDelay TEXT)",
          {}).then((data) => {
            console.log("TABLE CREATED: ", data);
          }, (error) => {
            console.error("Unable to execute sql", error);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });

       db.openDatabase({
        name: "bleDB.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS manualSchedule (" +
          "TimerName TEXT, TimerId TEXT, ZoneId INTEGER " + 
          "StartTime TEXT, TimeRemain INTEGER, Started INTEGER, Stoped INTEGER, IsWatering INTEGER)",
          {}).then((data) => {
            console.log("TABLE CREATED: ", data);
          }, (error) => {
            console.error("Unable to execute sql", error);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });

      db.openDatabase({
        name: "bleDB.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS cycleSchedule (" +
          "TimerName TEXT, TimerId TEXT, ZoneId INTEGER, StartTime TEXT, " +
          "WaterFor INTEGER, WaterEvery INTEGER, IsEnable INTEGER, EcoWaterFor INTEGER, EcoPause INTEGER, EcoIsEnable INTEGER, Moist TEXT)",
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
        name: "bleDB.db",
        location: "default"
      }).then(() => {
        db.executeSql("CREATE TABLE IF NOT EXISTS weeklySchedule (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "TimerName TEXT, TimerId TEXT, ZoneId INTEGER, StartTime TEXT, " +
          "WaterFor INTEGER, WaterDay TEXT, IsEnable INTEGER, EcoWaterFor INTEGER, EcoPause INTEGER, EcoIsEnable INTEGER, Moist TEXT)",
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
