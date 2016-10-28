import { Injectable } from '@angular/core';

@Injectable()

export class Global {
  
  currentTimer: string;

  constructor() {
    this.currentTimer = 'test';
  }

  setCurrentTimer(value) {
    this.currentTimer = value;
  }

  getCurrentTimer() {
    return this.currentTimer;
  }
}