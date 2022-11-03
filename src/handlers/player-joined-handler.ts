import { config } from '../lib/config';
import DiscordClient from '../lib/discord';
import { appendLog } from '../lib/log';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';
import playerService from '../services/player-service';

interface IPlayerJoinData {
  displayName: string;
  steamId: string;
  ipAddress: string;
  os: string;
  ownerId: string;
}

class PlayerJoinedHandler implements IMessageHandler<IPlayerJoinData> {
  type: RconMessageType = 'Generic';
  pattern = /([\d.:]+)\/(\d+)\/(.*) joined \[(.*)\/(\d+)\]/g;
  dataKeys = ['ipAddress', 'steamId', 'displayName', 'os', 'ownerId'];

  async handle(data: IPlayerJoinData, webrcon: WebRcon): Promise<void> {
    const ipAddressWithoutPort = data.ipAddress.split(':')[0];
    const ipAddressData = await playerService.getIpAddressData(ipAddressWithoutPort);
    const { isocode, provider } = ipAddressData;

    const log = `${data.displayName}[${data.steamId}] joined on server (${data.ipAddress}/${isocode}/${provider}/${data.os})`;
    appendLog(log, 'player-joined');

    if (!config.whitelist.includes(data.steamId)) {
      const kickReason = await playerService.checkPlayerIpAddress(ipAddressData);
      if (!!kickReason) {
        const kickLog = `${data.displayName}[${data.steamId}] kicked for ${kickReason}`;
        appendLog(kickLog, 'player-kicked');
        webrcon.commandAsync('kick ' + data.steamId + ' "' + kickReason + '"');
      }
    }

    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerJoinedHandler;
