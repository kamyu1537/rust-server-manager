import WebSocket from 'ws';
import MessageHandler from './message-handler';
import type {
  IRconMessage,
  RconCallbacks,
  RconCommandCallback,
  WebsocketOptions,
} from './types';

class WebRcon {
  private ws: WebSocket | null = null;
  private lastIdentifier = 0;
  private callbacks: RconCallbacks = {};
  public readonly messageHandler = new MessageHandler();

  constructor(
    private readonly host: string,
    private readonly pass: string,
    private readonly options: WebsocketOptions = {}
  ) {
    this.ws = this.createWebSocket(options);
  }

  public get readyState() {
    if (this.ws == null) return false;
    return this.ws.readyState || WebSocket.CLOSED;
  }

  public get isConnected() {
    if (this.ws == null) return false;
    return this.ws.readyState === WebSocket.OPEN;
  }

  private createWebSocket(options: WebsocketOptions = {}) {
    const defaultOptions: WebsocketOptions = {
      sessionTimeout: 10000,
      handshakeTimeout: 30000,
    };

    const ws = new WebSocket(
      `ws://${this.host}/${this.pass}`,
      Object.assign(defaultOptions, options)
    );

    ws.on('close', this.onClose.bind(this));
    ws.on('error', this.onError.bind(this));
    ws.on('open', this.onOpen.bind(this));

    return ws;
  }

  private getIdentifier() {
    this.lastIdentifier++;
    if (this.lastIdentifier > 1000000) this.lastIdentifier = 1;
    return 1000 + this.lastIdentifier;
  }

  private send(message: string, identifier = -1) {
    return new Promise<void>((resolve, reject) => {
      if (this.ws == null) {
        reject(new Error('socket is not connected'));
        return;
      }

      this.ws.send(
        JSON.stringify({
          Identifier: identifier,
          Message: message,
          Name: 'WebRcon',
        }),
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  public command(cmd: string, callback: RconCommandCallback) {
    const identifier = this.getIdentifier();
    this.callbacks[identifier] = callback;
    this.send(cmd, identifier);
  }

  private onOpen() {
    this.ws?.on('message', this.onMessage.bind(this));
    this.command('serverinfo', () => console.info('connected'));
  }

  private onError(err: Error) {
    console.error('socket encountered error:', err.message, ' closing socket');
    this.ws?.close();
  }

  private onClose(code: number, reason: Buffer) {
    console.error(
      'socket is closed. reconnect will be attempted in 10 seconds.',
      { code, reason: reason.toString() }
    );

    if (this.ws != null) {
      this.ws.removeAllListeners();
      this.ws = null;
    }

    setTimeout(() => {
      this.ws = this.createWebSocket(this.options);
    }, 10000);
  }

  private onMessage(raw: Buffer) {
    const data = JSON.parse(raw.toString('utf8')) as IRconMessage;

    if (data.Identifier > 1000) {
      const callback = this.callbacks[data.Identifier];
      if (callback != null) {
        callback(data);
        delete this.callbacks[data.Identifier];
      }
    } else {
      if (!this.messageHandler.handle(this, data)) {
        if (data.Type === 'Generic') {
          if (process.env.NODE_ENV !== 'production') {
            console.info('debug |', data.Message);
          }
        }
      }
    }
  }
}

export default WebRcon;
