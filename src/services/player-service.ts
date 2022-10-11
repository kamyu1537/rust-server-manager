import got from 'got';
import type { IGetIpAddressDataResult, IPlayerService, ProxyCheckResponse } from './player-service.types';

class PlayerService implements IPlayerService {
  async getIpAddressData(ipAddress: string): Promise<IGetIpAddressDataResult> {
    try {
      const res = (await got
        .get('https://proxycheck.io/v2/' + ipAddress + '?vpn=1&asn=1')
        .json()) as ProxyCheckResponse;

      if (res.status === 'error') {
        return { isocode: 'unknown', proxy: false };
      }

      return {
        isocode: res[ipAddress].isocode,
        proxy: res[ipAddress].proxy === 'yes',
      };
    } catch (err) {
      console.error(err);
      return { isocode: 'unknown', proxy: false };
    }
  }
}

export default new PlayerService();
