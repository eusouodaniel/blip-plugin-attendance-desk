import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-desk-hour-configuration',
  templateUrl: './hour-configuration.component.html',
  styleUrls: ['./hour-configuration.component.scss']
})
export class HourConfigurationComponent implements OnInit, OnDestroy {
  @Input() templates: any[];

  unsub = new Subject();

  hourStart?: string;
  hourEnd?: string;
  configDesk: string;

  constructor(
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private loadingService: LoadingService
  ) {
    this.configDesk = 'config-attendance'
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async saveConfigurations() {
    this.loadingService.showLoad();
    const resources = {
      hourStart: this.hourStart,
      hourEnd: this.hourEnd
    };
    await this.configurationService
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

  async getConfigurations(variable: any) {
    this.loadingService.showLoad();
    const bucket = await this.configurationService
      .getBucket(variable)
      .then(
        res => {
          this.hourStart = res.hourStart ? res.hourStart : null;
          this.hourEnd = res.hourEnd ? res.hourEnd : null;
        },
        error => {
          this.hourStart = null;
          this.hourEnd = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }
}
