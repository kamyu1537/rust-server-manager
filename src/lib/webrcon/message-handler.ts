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

  public handle(webrcon: WebRcon, message: IRconMessage): boolean {
    let result = false;

    this.handlers.forEach((handler) => {
      if (handler.type !== message.Type) return;
      const data: Record<string, unknown> = {};

      if (handler.pattern) {
        if (typeof handler.pattern === 'string') {
          const index = message.Message.indexOf(handler.pattern);
          if (index === -1) return;
        } else {
          const match = handler.pattern.exec(message.Message) || [];
          if (match.length < 1) return;

          const dataKeys = handler.dataKeys || [];
          for (let i = 0; i < dataKeys.length; i++) {
            data[dataKeys[i]] = match[i + 1];
          }
        }

        handler.handle(data, webrcon, message);
        result = true;
      } else {
        // 없을 경우 전체 이벤트를 받는다.
        handler.handle(data, webrcon, message);
        result = true;
      }
    });

    return result;
  }
}

export default MessageHandler;
