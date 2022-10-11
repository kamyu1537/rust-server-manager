import DiscordClient from '../lib/discord';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  ipAddress: string;
  os: string;
  ownerId: string;
}

class PlayerDisconnectHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /([\d.:]+)\/(\d+)\/(.*) disconnecting: (.*)/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'reason'];

  handle(data: IData): void {
    console.log('player disconnect:', data);
    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerDisconnectHandler;
