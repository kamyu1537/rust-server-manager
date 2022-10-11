// kamyu[76561199039484755] was killed by 434922[434922] at (129.6, 20.3, 24.9)

import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class KillPvpHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] was killed by (.*)\[(7656[0-9]{13})\] at (\([0-9.\- ]+\))/g;
  dataKeys = ['victimName', 'victimId', 'killerName', 'killerId', 'position'];

  handle(data: unknown): void {
    console.info('kill pvp: ', data);
  }
}

export default KillPvpHandler;
