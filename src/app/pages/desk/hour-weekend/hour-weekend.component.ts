import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { NotificationService } from '@app/services/notification.service';
import { NotificationIndividual } from '@app/models/NotificationIndividual';
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

  showTemplate = false;

  phoneNumber: string;
  email: string;
  defaultConfig: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];
  deskHourVariables: DeskHourVariables;

  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService
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
        this.deskHourVariables = res;
      },
      error => {
        this.deskHourVariables = {};
      }
    );
  }

  validationFields(variable: NotificationIndividual): boolean {
    if (!variable.telephone) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir o número de telefone!'
      });
      return false;
    }
    if (!variable.namespace) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa configurar o namespace para fazer os disparos!'
      });
      return false;
    }

    return true;
  }
}
