import { config } from '../lib/config';
import { appendLog } from '../lib/log';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';
import playerService from '../services/player-service';

interface IPlayerJoinData {
  displayName: string;
  steamId: string;
  ipAddress: string;
}

class NewPlayerJoinedHandler implements IMessageHandler<IPlayerJoinData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*) with steamid (\d+) joined from ip ([\d.:]+)/g;
  dataKeys = ['displayName', 'steamId', 'ipAddress'];

  async handle(data: IPlayerJoinData, webrcon: WebRcon): Promise<void> {
    const ipAddressWithoutPort = data.ipAddress.split(':')[0];
    const ipAddressData = await playerService.getIpAddressData(ipAddressWithoutPort);
    const { isocode, provider } = ipAddressData;

    const log = `${data.displayName}[${data.steamId}] joined on server (${data.ipAddress}/${isocode}/${provider}/new_player)`;
    appendLog(log, 'player-joined');
    appendLog(log, 'new-player-joined');

    if (!config.whitelist.includes(data.steamId)) {
      const kickReason = await playerService.checkPlayerIpAddress(ipAddressData);
      if (!!kickReason) {
        const kickLog = `${data.displayName}[${data.steamId}] kicked for ${kickReason}`;
        appendLog(kickLog, 'player-kicked');
        webrcon.commandAsync('kick ' + data.steamId + ' "' + kickReason + '"');
      }
    }
  }
}

export default NewPlayerJoinedHandler;
