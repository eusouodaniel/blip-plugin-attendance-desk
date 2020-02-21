import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationGeneralService } from '@app/services/configuration-general.service';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-desk-hour-holiday',
  templateUrl: './hour-holiday.component.html',
  styleUrls: ['./hour-holiday.component.scss']
})
export class HourHolidayComponent implements OnInit, OnDestroy {
  unsub = new Subject();

  day?: string;
  hourStart?: string;
  hourEnd?: string;
  dayStatus: boolean;
  configDesk: string;

  constructor(
    private iframeService: IframeService,
    private configurationGeneralService: ConfigurationGeneralService,
    private loadingService: LoadingService
  ) {
    this.configDesk = 'config-attendance'
  }

  ngOnInit() {
    this.getConfigurations();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async saveConfigurations() {
    this.loadingService.showLoad();

    const resources = {
      day: this.day,
      hourStart: this.hourStart,
      hourEnd: this.hourEnd,
      dayStatus: this.dayStatus
    };
    await this.configurationGeneralService
      .storeBucket(this.configDesk, resources)
      .then(
        res => {
          this.iframeService.showToast({
            type: 'success',
            message: 'Dados armazenados com sucesso!'
          });
        },
        error => {
          this.iframeService.showToast({
            type: 'danger',
            message: 'Falha ao armazenar os dados!'
          });
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
  }

  async getConfigurations() {
    this.loadingService.showLoad();
    const bucket = await this.configurationGeneralService
      .getBucket(this.configDesk)
      .then(
        res => {
          this.day = res.day ? res.day : null;
          this.hourStart = res.hourStart ? res.hourStart : null;
          this.hourEnd = res.hourEnd ? res.hourEnd : null;
          this.dayStatus = res.dayStatus ? res.dayStatus : false;
        },
        error => {
          this.day = null;
          this.hourStart = null;
          this.hourEnd = null;
          this.dayStatus = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }
}
