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

  stateId?: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];

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

  async selectedTemplateBucket(event: any) {
    this.templateVariables = [];
    this.template = this.templates.find(t => t.id == event.value);
    this.templateDescription = this.template.components.find((td: any) => td.type == 'BODY').text;
    await this.getConfigurations(this.template.name);
  }

  variableId(text: any): string {
    return 'var' + text.replace(/{*}*/g, '');
  }

  async saveConfigurations() {
    this.loadingService.showLoad();
    const resources = {
      stateId: this.stateId
    };
    await this.configurationService
      .storeBucket(this.template.name, resources)
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
          this.stateId = res.stateId ? res.stateId : null;
        },
        error => {
          this.stateId = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }
}
