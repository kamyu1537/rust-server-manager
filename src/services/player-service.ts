// import got, { HTTPError } from 'got';
import axios from 'axios';
import { config } from '../lib/config';
import type { IGetIpAddressDataResult, IPlayerService, ProxyCheckResponse } from './player-service.types';

class PlayerService implements IPlayerService {
  async getIpAddressData(ipAddress: string): Promise<IGetIpAddressDataResult> {
    try {
      const res = (await axios
        .get('https://proxycheck.io/v2/' + ipAddress + '?key=' + config.proxyCheckKey + '&vpn=1&asn=1')
        .then((res) => res.data)) as ProxyCheckResponse;

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

      if (axios.isAxiosError(err)) {
        if (err.response?.data.status === 'error') {
          console.info(err.response.data);
          return { provider: 'unknown', isocode: 'unknown', proxy: false };
        }

        return new Promise((resolve) => {
          setTimeout(async () => {
            resolve(await this.getIpAddressData(ipAddress));
          }, 1000);
        });
      }

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
