import { appendLog } from '../lib/log';
import type { IChatMessage, IMessageHandler, RconMessageType } from '../lib/webrcon/types';

class ChatHandler implements IMessageHandler<IChatMessage> {
  type: RconMessageType = 'Chat';

  handle(data: IChatMessage): void {
    const log = `[${data.Channel}] ${data.Username}[${data.UserId}]: ${data.Message}`;
    appendLog(log, 'chat');
  }
}

export default ChatHandler;
