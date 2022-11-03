import { appendLog } from '../lib/log';
import { getDistance } from '../lib/utils';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  victim: string;
  displayName: string;
  steamId: string;
  position: string;
}

class KillPveHandler implements IMessageHandler<IData> {
  type: RconMessageType = 'Generic';
  pattern = /(.*) was killed by (.*)\[(7656[0-9]{13})\] at (\([0-9.,\- ]+\))/g;
  dataKeys = ['victim', 'displayName', 'steamId', 'position'];

  async handle(data: IData, webrcon: WebRcon): Promise<void> {
    if (/(.*)\[(7656[0-9]{13})\]/g.test(data.victim)) return; // 이건 PVP 로그

    const killerPositionResult = await webrcon.commandAsync('server.printpos ' + data.steamId);
    const killerPosition = killerPositionResult.Message;
    const distance = getDistance(data.position, killerPosition);

    const log = `${data.victim} was killed by ${data.displayName}[${data.steamId}]${killerPosition} at ${data.position} (distance: ${distance})`;
    appendLog(log, 'kill-pve');
  }
}

export default KillPveHandler;
