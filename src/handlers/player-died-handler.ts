// kamyu[76561199039484755] was killed by polarbear (Polarbear) at (408.2, 4.6, 469.5)

import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class DiedHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] died (.*)/g;
  dataKeys = ['displayName', 'id', 'deathType'];

  handle(data: unknown): void {
    console.info('died: ', data);
  }
}

export default DiedHandler;
