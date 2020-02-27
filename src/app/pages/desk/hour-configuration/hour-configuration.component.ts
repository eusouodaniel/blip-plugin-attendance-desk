import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { IframeService } from '@app/services/iframe.service';
import { DeskHourVariables } from '@app/models/DeskHourVariables';
import { LoadingService } from '@app/services/loading.service';


@Component({
  selector: 'app-desk-hour-configuration',
  templateUrl: './hour-configuration.component.html',
  styleUrls: ['./hour-configuration.component.scss']
})
export class HourConfigurationComponent implements OnInit, OnDestroy {
  unsub = new Subject();

  abertura?: string;
  fechamento?: string;

  constructor(
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async saveConfigurations() {
    this.loadingService.showLoad();
    
    await this.configurationService
      .setResource('abertura', this.abertura)
      .then(
        async res => {
          await this.configurationService
        .setResource('fechamento', this.fechamento)
          .then(
            res => {
              this.iframeService.showToast({
                type: 'success',
                message: 'Dados armazenados com sucesso!'
              });
            }
          )
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
      .getResources()
      .then(
        res => {
          this.abertura = res.abertura ? res.abertura : null;
          this.fechamento = res.fechamento ? res.fechamento : null;
        },
        error => {
          this.abertura = null;
          this.fechamento = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }

  validationFields(variable: DeskHourVariables): boolean {
    if (!variable.abertura) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir o horário de início!'
      });
      return false;
    }
    if (!variable.fechamento) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir o horário de fim!'
      });
      return false;
    }

    return true;
  }
}
