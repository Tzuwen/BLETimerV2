import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TimersPage } from '../pages/timers/timers';
import { ProgramMainPage } from '../pages/programmain/programmain';
import { ProgramDetailPage } from '../pages/programdetail/programdetail';
import { ManualPage } from '../pages/manual/manual';
import { ConfigPage } from '../pages/config/config';
import { TabsPage } from '../pages/tabs/tabs';
import { Global } from './global'

@NgModule({
  declarations: [
    MyApp,   
    TimersPage,
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
    TimersPage,
    ProgramMainPage,
    ProgramDetailPage,
    ManualPage,
    ConfigPage,
    TabsPage
  ],
  providers: [ Global ]
})
export class AppModule {}
