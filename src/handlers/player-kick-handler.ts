import DiscordClient from '../lib/discord';
import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IKickData {
  displayName: string;
  ipAddress: string;
  steamId: string;
  reason: string;
}

class PlayerKickHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /Kicking ([\d.:]+)\/(7656[0-9]{13})\/(.*) \((.*)\)/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'reason'];

  handle(data: IKickData): void {
    const log = `${data.displayName}[${data.steamId}] was kicked for ${data.reason}`;
    appendLog(log, 'player-kicked');

    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerKickHandler;
