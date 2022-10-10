import type {
  IChatMessage,
  IMessageHandler,
  RconMessageType,
} from '../lib/webrcon/types';

class ChatHandler implements IMessageHandler<IChatMessage> {
  type: RconMessageType = 'Chat';

  handle(data: IChatMessage): void {
    console.log(
      `[${data.Channel}] ${data.Username}[${data.UserId}]: ${data.Message}`
    );
  }
}

export default ChatHandler;
