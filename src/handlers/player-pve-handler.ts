import { appendLog } from '../lib/log';
import { getDistance } from '../lib/utils';
import WebRcon from '../lib/webrcon';
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

  async handle(data: IData, webrcon: WebRcon): Promise<void> {
    if (/(.*)\[(7656[0-9]{13})\]/g.test(data.killer)) return; // 이건 PVP 로그

    const killerPositionResult = await webrcon.commandAsync('server.printpos ' + data.steamId);
    const killerPosition = killerPositionResult.Message;
    const distance = getDistance(data.position, killerPosition);

    const log = `${data.displayName}[${data.steamId}]${killerPosition} was killed by ${data.killer} at ${data.position} (distance: ${distance})`;
    appendLog(log, 'kill-pve');
  }
}

export default KillPveHandler;
