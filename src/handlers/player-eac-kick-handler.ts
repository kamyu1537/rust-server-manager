import DiscordClient from '../lib/discord';
import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IEacKickData {
  displayName: string;
  steamId: string;
  reason: string;
}

class PlayerEacKickHandler implements IMessageHandler<IEacKickData> {
  type: RconMessageType = 'Generic';
  pattern = /\[EAC\] Kicking (.*) \/ (7656[0-9]{13}) (.*)/g;
  dataKeys = ['displayName', 'steamId', 'reason'];

  handle(data: IEacKickData): void {
    const log = `${data.displayName}[${data.steamId}] was kicked for EAC ${data.reason}`;
    appendLog(log, 'player-kicked');

    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerEacKickHandler;
