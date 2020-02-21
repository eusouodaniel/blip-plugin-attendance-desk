import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { DeskHourConfigurationVariables } from '@app/models/DeskHourConfigurationVariables';
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

  showTemplate = false;

  phoneNumber: string;
  email: string;
  defaultConfig: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];
  deskHourConfigurationVariables: DeskHourConfigurationVariables;

  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService
  ) {
    this.defaultConfig = 'default-config';
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  selectedTemplate(event: any) {
    this.templateVariables = [];
    this.template = this.templates.find(t => t.id == event.value);
    this.templateDescription = this.template.components.find((td: any) => td.type == 'BODY').text;
    const variables = this.templateDescription.match(/{{[0-9]*}}/gm) || [];
    variables.forEach((item: any) => {
      if (this.templateVariables.indexOf(item) == -1) {
        this.templateVariables.push(item);
      }
    });
    this.showTemplate = true;
  }

  variableId(text: any): string {
    return 'var' + text.replace(/{*}*/g, '');
  }

  variableValues(variableArray: any[]) {
    const variableValues: any = {};
    variableArray.forEach(element => {
      variableValues[this.variableId(element)] = (document.getElementById(
        this.variableId(element)
      ) as HTMLInputElement).value;
    });
    return variableValues;
  }

  async getConfigurations(variable: any) {
    await this.configurationService.getBucket(variable).then(
      res => {
        this.deskHourConfigurationVariables = res;
      },
      error => {
        this.deskHourConfigurationVariables = {};
      }
    );
  }

  validationFields(variable: DeskHourConfigurationVariables): boolean {
    if (!variable.day) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir o número de telefone!'
      });
      return false;
    }
    if (!variable.dayStatus) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa configurar o namespace para fazer os disparos!'
      });
      return false;
    }
    if (!variable.hourStart) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa configurar o namespace para fazer os disparos!'
      });
      return false;
    }
    if (!variable.hourEnd) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa configurar o namespace para fazer os disparos!'
      });
      return false;
    }

    return true;
  }
}
