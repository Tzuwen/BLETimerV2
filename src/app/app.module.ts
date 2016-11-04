import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// Import Pages
import { TimersPage } from '../pages/timers/timers';
import { ValvesPage } from '../pages/valves/valves'
import { TabsPage } from '../pages/tabs/tabs';
import { ProgramMainPage } from '../pages/programmain/programmain';
import { ProgramDetailPage } from '../pages/programdetail/programdetail';
import { ManualPage } from '../pages/manual/manual';
import { ConfigPage } from '../pages/config/config';

// Import Providers


@NgModule({
  declarations: [
    MyApp,
    TimersPage,
    ValvesPage,
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
    ValvesPage,
    ProgramMainPage,
    ProgramDetailPage,
    ManualPage,
    ConfigPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
