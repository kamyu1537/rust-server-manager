import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class SaveHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = 'Saving complete';

  handle(): void {
    console.info('saved!');
  }
}

export default SaveHandler;
