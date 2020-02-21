import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeskRoutingModule } from './desk-routing.module';
import { DeskComponent } from './desk.component';
import { BlipService } from '@app/services/blip.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { HourConfigurationComponent } from './hour-configuration/hour-configuration.component';
import { HourWeekendComponent } from './hour-weekend/hour-weekend.component';
import { HourHolidayComponent } from './hour-holiday/hour-holiday.component';
import { HourOpenHolidayComponent } from './hour-open-holiday/hour-open-holiday.component';
import { ConfigurationGeneralService } from '@app/services/configuration-general.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    MaterialFileInputModule,
    DeskRoutingModule
  ],
  declarations: [
    DeskComponent,
    HourConfigurationComponent,
    HourWeekendComponent,
    HourHolidayComponent,
    HourOpenHolidayComponent
  ],
  providers: [BlipService, ConfigurationGeneralService]
})
export class DeskModule {}
