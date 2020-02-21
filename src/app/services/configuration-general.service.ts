import { Injectable } from '@angular/core';
import { DeskHourVariables } from '@app/models/DeskHourVariables';

const { IframeMessageProxy } = require('iframe-message-proxy');

@Injectable()
export class ConfigurationGeneralService {
  sendMessage(_action: string, _content: number) {
    IframeMessageProxy.sendMessage({
      action: _action,
      content: _content
    });
  }

  async setResource(key: any, value: any) {
    const bucket = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'MessagingHubService',
        command: {
          method: 'set',
          uri: '/resources/' + key,
          type: 'application/x-my-type+json',
          resource: value
        }
      }
    });

    return bucket;
  }

  async getResources() {
    const bucket = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'MessagingHubService',
        command: {
          method: 'get',
          uri: '/resources'
        }
      }
    });
    return bucket.response as DeskHourVariables;
  }
}
