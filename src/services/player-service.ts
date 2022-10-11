import ky from 'ky';
import type {
  IGetIpAddressDataResult,
  IPlayerService,
  ProxyCheckResponse,
} from './player-service.types';

class PlayerService implements IPlayerService {
  async getIpAddressData(ipAddress: string): Promise<IGetIpAddressDataResult> {
    try {
      const res = (await ky
        .get('https://proxycheck.io/v2/' + ipAddress + '?vpn=1&asn=1')
        .json()) as ProxyCheckResponse;

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
