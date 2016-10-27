import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { ProgramTimerPage } from '../pages/programtimer/programtimer';
import { ProgramMainPage } from '../pages/programmain/programmain';
import { ProgramDetailPage } from '../pages/programdetail/programdetail';
import { ManualPage } from '../pages/manual/manual';
import { ConfigPage } from '../pages/config/config';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,   
    ProgramTimerPage,
    ProgramMainPage,
    ProgramDetailPage,
    ManualPage,
    ConfigPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProgramTimerPage,
    ProgramMainPage,
    ProgramDetailPage,
    ManualPage,
    ConfigPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
