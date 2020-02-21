import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { DeskHourVariables } from '@app/models/DeskHourVariables';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-desk-hour-weekend',
  templateUrl: './hour-weekend.component.html',
  styleUrls: ['./hour-weekend.component.scss']
})
export class HourWeekendComponent implements OnInit, OnDestroy {
  @Input() templates: any[];
  @Input() botId: any;
  @Input() accessKey: any;
  unsub = new Subject();

  abertura?: string;
  abertura_domingo?: string;
  abertura_feriado?: string;
  abertura_procon?: string;
  abertura_sabado?: string;
  fechamento?: string;
  fechamento_domingo?: string;
  fechamento_sabado?: string;
  feriado_com_atendimento?: string;
  sem_atendimento?: string;


  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async saveConfigurations() {
    this.loadingService.showLoad();
    
    await this.configurationService
      .setResource(this.abertura, this.abertura)
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
      .getResources()
      .then(
        res => {
          this.abertura = res.abertura ? res.abertura : null;
          this.abertura_domingo = res.abertura_domingo ? res.abertura_domingo : null;
          this.abertura_feriado = res.abertura_feriado ? res.abertura_feriado : null;
          this.abertura_procon = res.abertura_procon ? res.abertura_procon : null;
          this.abertura_sabado = res.abertura_sabado ? res.abertura_sabado : null;
          this.fechamento = res.fechamento ? res.fechamento : null;
          this.fechamento_domingo = res.fechamento_domingo ? res.fechamento_domingo : null;
          this.sem_atendimento = res.sem_atendimento ? res.sem_atendimento : null;
        },
        error => {
          this.abertura = null;
          this.abertura_domingo = null;
          this.abertura_feriado = null;
          this.abertura_procon = null;
          this.abertura_sabado = null;
          this.fechamento = null;
          this.fechamento_domingo = null;
          this.sem_atendimento = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }

  validationFields(variable: DeskHourVariables): boolean {
    // if (!variable.day) {
    //   this.iframeService.showToast({
    //     type: 'danger',
    //     message: 'Você precisa definir o dia!'
    //   });
    //   return false;
    // }

    return true;
  }
}
