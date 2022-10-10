import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
}

class PlayerSpawnHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] has spawned/g;
  dataKeys = ['displayName', 'steamId'];

  handle(data: IData): void {
    console.log('player spawned:', data);
  }
}

export default PlayerSpawnHandler;
