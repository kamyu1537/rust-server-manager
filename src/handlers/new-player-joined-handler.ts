import { config } from '../lib/config';
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
    const { isocode, proxy } = await playerService.getIpAddressData(ipAddressWithoutPort);

    console.info(`${data.displayName}[${data.steamId}] joined on server (${data.ipAddress}/${isocode})`);

    if (config.allowProxy && !proxy) {
      console.info('proxy detected, kicking player');
      webrcon.commandAsync('kick ' + data.steamId + ' Proxy detected');
      return;
    }

    if (config.allowedCountries.length > 0 && isocode !== 'unknown') {
      if (!config.allowedCountries.includes(isocode)) {
        console.info('country not allowed, kicking player');
        webrcon.commandAsync('kick ' + data.steamId + ' Country not allowed');
        return;
      }
    }
  }
}

export default NewPlayerJoinedHandler;
