import DiscordClient from '../lib/discord';
import { appendLog } from '../lib/log';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IGameEventData {
  prefab: string;
}

class GameEventHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /^\[event\] (.*)/g;
  dataKeys = ['prefab'];

  handle(data: IGameEventData): void {
    const log = `Game event started: ${data.prefab}`;
    appendLog(log, 'game-event');
    DiscordClient.getInstance()?.sendGameEventMessage(data.prefab);
  }
}

export default GameEventHandler;
