import WebRcon from '../lib/webrcon';
import type {
  IMessageHandler,
  IRconMessage,
  RconMessageType,
} from '../lib/webrcon/types';

interface IChatMessage {
  Channel: number;
  Message: string;
  UserId: string;
  Username: string;
  Color: string;
  Time: number;
}

class ChatHandler implements IMessageHandler {
  type: RconMessageType = 'Chat';

  handle(_data: unknown, _webrcon: WebRcon, message: IRconMessage): void {
    const chat = JSON.parse(message.Message) as IChatMessage;
    const isGlobal = chat.Channel === 0;

    if (isGlobal) {
      console.log(`[global] ${chat.Username}[${chat.UserId}]: ${chat.Message}`);
    } else {
      console.log(
        `[team ${chat.Channel}] ${chat.Username}[${chat.UserId}]: ${chat.Message}`
      );
    }
  }
}

export default ChatHandler;
