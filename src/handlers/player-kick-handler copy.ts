import DiscordClient from '../lib/discord';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IKickData {
  displayName: string;
  ipAddress: string;
  steamId: string;
  reason: string;
}

class PlayerKickHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /Kicking ([\d.:]+)\/(7656[0-9]{13})\/(.*) (.*)/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'reason'];

  handle(data: IKickData): void {
    console.log('player kicked:', data);
    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerKickHandler;
