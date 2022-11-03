// kamyu[76561199039484755] was killed by polarbear (Polarbear) at (408.2, 4.6, 469.5)

import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  deathType: string;
}

class DiedHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] died (.*)/g;
  dataKeys = ['displayName', 'steamId', 'deathType'];

  handle(data: IData): void {
    const log = `${data.displayName} died ${data.deathType}`;
    appendLog(log, 'player-died');
  }
}

export default DiedHandler;
