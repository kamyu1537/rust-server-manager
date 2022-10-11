import DiscordClient from '../lib/discord';
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
    console.log('player eac kicked:', data);
    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerEacKickHandler;
