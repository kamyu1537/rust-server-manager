export interface IGetIpAddressDataResult {
  isocode: string;
  proxy: boolean;
}

export interface IPlayerService {
  getIpAddressData: (ipAddress: string) => Promise<IGetIpAddressDataResult>;
}

export type ProxyCheckResponse = {
  [key: string]: {
    asn: string;
    provider: string;
    organisation: string;
    continent: string;
    country: string;
    isocode: string;
    timezone: string;
    latitude: number;
    longitude: number;
    proxy: 'yes' | 'no';
    type: string;
  };
} & { status: 'ok' | 'error' };
