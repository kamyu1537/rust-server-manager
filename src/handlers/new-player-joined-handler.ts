import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  ipAddress: string;
}

class NewPlayerJoinedHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*) with steamid (\d+) joined from ip ([\d.:]+)/g;
  dataKeys = ['displayName', 'steamId', 'ipAddress'];

  handle(data: IData): void {
    console.log('new player joined:', data);
  }
}

export default NewPlayerJoinedHandler;
