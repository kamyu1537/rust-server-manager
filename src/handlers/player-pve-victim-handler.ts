import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  displayName: string;
  steamId: string;
  attacker: string;
  position: string;
}

class KillPveVictimHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] was killed by (.*) at (\([0-9.,\- ]+\))/g;
  dataKeys = ['displayName', 'steamId', 'attacker', 'position'];

  async handle(data: IData): Promise<void> {
    if (/(.*)\[(7656[0-9]{13})\]/g.test(data.attacker)) return; // 이건 PVP 로그

    const log = `${data.attacker} was killed by ${data.displayName}[${data.steamId}] at ${data.position}`;
    appendLog(log, 'kill-pve');
  }
}

export default KillPveVictimHandler;
