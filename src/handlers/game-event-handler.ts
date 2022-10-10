import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class GameEventHandler implements IMessageHandler {
  type: RconMessageType = 'Generic';
  pattern = /^\[event\] (.*)/g;
  dataKeys = ['prefab'];

  handle(data: Record<string, unknown>): void {
    console.log('game event:', data.prefab);
  }
}

export default GameEventHandler;
