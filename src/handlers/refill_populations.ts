import { config } from '../lib/config';
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
      console.info('Refill Populations: not a cargo plane, skipping');
      return;
    }

    await webrcon.commandAsync('spawn.fill_populations');
  }
}

export default RefillPopulations;
