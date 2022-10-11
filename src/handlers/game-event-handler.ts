import DiscordClient from '../lib/discord';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IGameEventData {
  prefab: string;
}

class GameEventHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /^\[event\] (.*)/g;
  dataKeys = ['prefab'];

  handle(data: IGameEventData): void {
    console.log('game event:', data.prefab);
    DiscordClient.getInstance()?.sendGameEventMessage(data.prefab);
  }
}

export default GameEventHandler;
