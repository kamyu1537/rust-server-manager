import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
}

class PlayerKickHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /Kicked: (.*)/g;
  dataKeys = ['displayName'];

  handle(data: IData): void {
    console.log('player kicked:', data.displayName);
  }
}

export default PlayerKickHandler;
