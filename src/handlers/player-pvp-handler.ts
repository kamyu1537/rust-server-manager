// kamyu[76561199039484755] was killed by 434922[434922] at (129.6, 20.3, 24.9)

import { appendLog } from '../lib/log';
import { getDistance } from '../lib/utils';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IData {
  victimName: string;
  victimId: string;
  killerName: string;
  killerId: string;
  position: string;
}

class KillPvpHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /(.*)\[(7656[0-9]{13})\] was killed by (.*)\[(7656[0-9]{13})\] at (\([0-9.,\- ]+\))/g;
  dataKeys = ['victimName', 'victimId', 'killerName', 'killerId', 'position'];

  async handle(data: IData, webrcon: WebRcon): Promise<void> {
    const killerPositionResult = await webrcon.commandAsync('server.printpos ' + data.killerId);
    const killerPosition = killerPositionResult.Message;
    const distance = getDistance(data.position, killerPosition);

    const log = `${data.victimName}[${data.victimId}]${data.position} was killed by ${data.killerName}[${data.killerId}]${killerPosition} (distance: ${distance})`;
    appendLog(log, 'kill-pvp');

    setTimeout(async () => {
      const combatLogResult = await webrcon.commandAsync('server.combatlog ' + data.victimId);
      appendLog(
        `combat log (${data.killerName}[${data.killerId}]) -> (${data.victimName}[${data.victimId}]) =======\n` +
          combatLogResult.Message.split('\n').slice(1).join('\n'),
        'combat'
      );
    }, 10000);
  }
}

export default KillPvpHandler;
