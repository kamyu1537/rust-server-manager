import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  ipAddress: string;
  os: string;
  ownerId: string;
}

class PlayerJoinedHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /([\d.:]+)\/(\d+)\/(.*) joined \[(.*)\/(\d+)\]/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'os', 'ownerId'];

  handle(data: IData): void {
    console.log('player joined:', data);
  }
}

export default PlayerJoinedHandler;
