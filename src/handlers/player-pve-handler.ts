import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  killer: string;
  position: string;
}

class KillPveHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] was killed by (.*) at (\([0-9.,\- ]+\))/g;
  dataKeys = ['displayName', 'steamId', 'killer', 'position'];

  handle(data: IData): void {
    if (/\d+\[(7656[0-9]{13})\]/g.test(data.killer)) return; // 이건 PVP 로그

    console.info('kill pve: ', data);
  }
}

export default KillPveHandler;

// entity.find_entity door.hinged.security.red
