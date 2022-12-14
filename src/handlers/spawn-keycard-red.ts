import { config } from '../lib/config';
import { appendLog } from '../lib/log';
import WebRcon from '../lib/webrcon';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IGameEventData {
  prefab: string;
}

class SpawnRedKeyCard implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /^\[event\] (.*)/g;
  dataKeys = ['prefab'];

  async handle(data: IGameEventData, webrcon: WebRcon): Promise<void> {
    if (!config.spawnRedKeycard) return;

    if (data.prefab !== 'assets/prefabs/npc/cargo plane/cargo_plane.prefab') {
      console.info('RED_KEY_CARD: not a cargo plane, skipping');
      return;
    }

    const redKeyResp = await webrcon.commandAsync('entity.find_entity keycard_red_pickup.entity');
    const [, ...redKeys] = redKeyResp.Message.split('\n').filter(Boolean);
    if (redKeys.length > 0) {
      console.info('RED_KEY_CARD: red keycard already spawned');
      return;
    }

    const blueKeyResp = await webrcon.commandAsync('entity.find_entity keycard_blue_pickup.entity');
    const [, ...blueKeys] = blueKeyResp.Message.split('\n').filter(Boolean);

    if (blueKeys.length < 1) {
      console.info('RED_KEY_CARD: no blue keycard found');
      return;
    }

    const entityPositions = blueKeys.map((line) =>
      /sv\s+\d+\s+\d+\s+\d+\s+(?:.*)\s+(\([0-9.,\- ]+\))\s+(?:\([0-9.,\- ]+\))\s+(?:\([0-9.,\- ]+\))\s+(?:\([0-9.,\- ]+\))\s+(?:.*)/g
        .exec(line)?.[1]
        .replace(/ /g, '')
    );

    const random = Math.floor(Math.random() * entityPositions.length);
    const randomPosition = entityPositions[random];

    await webrcon.commandAsync(`entity.spawn keycard_red_pickup.entity ${randomPosition}`);

    const log = `spawned red keycard at ${randomPosition}`;
    appendLog(log, 'red-keycard-spawned');
  }
}

export default SpawnRedKeyCard;
