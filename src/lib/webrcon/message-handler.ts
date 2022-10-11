import WebRcon from './index';
import { IMessageHandler, IRconMessage } from './types';

class MessageHandler {
  private readonly handlers: Set<IMessageHandler> = new Set();

  public add(handler: IMessageHandler) {
    this.handlers.add(handler);
  }

  public clear() {
    this.handlers.clear();
  }

  public remove(handler: IMessageHandler) {
    this.handlers.delete(handler);
  }

  public async handle(webrcon: WebRcon, message: IRconMessage): Promise<boolean> {
    let result = false;

    for await (const handler of this.handlers) {
      if (handler.type !== message.Type) continue;
      let data: Record<string, unknown> = {};

      if (handler.pattern) {
        if (typeof handler.pattern === 'string') {
          const index = message.Message.indexOf(handler.pattern);
          if (index === -1) continue;
        } else {
          const match = handler.pattern.exec(message.Message) || [];
          if (match.length < 1) continue;

          const dataKeys = handler.dataKeys || [];
          for (let i = 0; i < dataKeys.length; i++) {
            data[dataKeys[i]] = match[i + 1];
          }
        }

        new Promise(() => handler.handle(data, webrcon, message)).then().catch(console.error);

        result = true;
      } else {
        if (message.Type === 'Chat' || message.Type === 'Report') {
          data = JSON.parse(message.Message);
        }

        handler.handle(data, webrcon, message);
        result = true;
      }
    }

    return result;
  }
}

export default MessageHandler;
