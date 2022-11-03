import DiscordClient from '../lib/discord';
import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  steamId: string;
  ipAddress: string;
  displayName: string;
  reason: string;
}

class PlayerDisconnectHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /([\d.:]+)\/(\d+)\/(.*) disconnecting: (.*)/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'reason'];

  handle(data: IData): void {
    const log = `${data.displayName}[${data.steamId}] disconnected ${data.reason}`;
    appendLog(log, 'player-disconnected');

    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerDisconnectHandler;
