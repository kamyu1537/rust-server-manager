import got from 'got';
import { config } from '../lib/config';
import type { IGetIpAddressDataResult, IPlayerService, ProxyCheckResponse } from './player-service.types';

class PlayerService implements IPlayerService {
  async getIpAddressData(ipAddress: string): Promise<IGetIpAddressDataResult> {
    try {
      const res = (await got
        .get('https://proxycheck.io/v2/' + ipAddress + '?vpn=1&asn=1')
        .json()) as ProxyCheckResponse;

      if (res.status === 'error') {
        return { provider: 'unknown', isocode: 'unknown', proxy: false };
      }

      return {
        provider: res[ipAddress].provider || 'unknown',
        isocode: res[ipAddress].isocode,
        proxy: res[ipAddress].proxy === 'yes',
      };
    } catch (err) {
      console.error(err);
      return { provider: 'unknown', isocode: 'unknown', proxy: false };
    }
  }

  async checkPlayerIpAddress({ proxy, provider, isocode }: IGetIpAddressDataResult): Promise<string> {
    if (!config.allowProxy && proxy) {
      return 'Proxy detected';
    }

    if (config.disallowProviders.length > 0 && config.disallowProviders.includes(provider)) {
      return 'Disallowed provider';
    }

    if (config.allowedCountries.length > 0 && isocode !== 'unknown') {
      if (!config.allowedCountries.includes(isocode)) {
        return 'Country not allowed';
      }
    }

    return '';
  }
}

export default new PlayerService();
