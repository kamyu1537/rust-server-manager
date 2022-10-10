import type { ClientRequestArgs } from 'http';
import type { ClientOptions } from 'ws';
import WebRcon from '.';

export type RconMessageType = 'Generic' | 'Log' | 'Error' | 'Warning' | 'Chat';

export interface IRconMessage {
  Type: RconMessageType;
  Identifier: number;
  Message: string;
  Stacktrace: string | null;
}

export type RconCommandCallback = (
  message: IRconMessage
) => void | Promise<void>;
export type RconCallbacks = Record<number, RconCommandCallback>;

export type WebsocketOptions = ClientOptions | ClientRequestArgs;

export interface IMessageHandler<T = unknown> {
  type: RconMessageType;
  pattern?: RegExp | string;
  dataKeys?: string[];

  handle(
    data: T,
    webrcon: WebRcon,
    message: IRconMessage
  ): void | Promise<void>;
}
