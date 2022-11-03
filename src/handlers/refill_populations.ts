import { config } from '../lib/config';
import { appendLog } from '../lib/log';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IGameEventData {
  prefab: string;
}

class RefillPopulations implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /^\[event\] (.*)/g;
  dataKeys = ['prefab'];

  async handle(data: IGameEventData, webrcon: WebRcon): Promise<void> {
    if (!config.refillPopulations) return;

    if (data.prefab !== 'assets/prefabs/npc/cargo plane/cargo_plane.prefab') {
      console.info('REFILL_POPULATIONS: not a cargo plane, skipping');
      return;
    }

    await webrcon.commandAsync('spawn.fill_populations');
    appendLog('cargo plane spawned, refilling populations', 'refill-populations');
  }
}

export default RefillPopulations;
