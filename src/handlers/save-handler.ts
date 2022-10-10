import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class SaveHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = 'Saving complete';

  handle(_: unknown, webrcon: WebRcon): void {
    console.info('save detected, run backup command');
    webrcon.commandAsync('server.backup').then().catch(console.error);
  }
}

export default SaveHandler;
