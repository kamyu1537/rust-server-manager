import type { ClientRequestArgs } from 'http';
import type { ClientOptions } from 'ws';
import WebRcon from '.';

export type RconMessageType = 'Generic' | 'Error' | 'Warning' | 'Chat' | 'Report';

export enum EReportType {
  General,
  Bug,
  Cheat,
  Abuse,
  Idea,
  OffensiveContent,
}

export interface IRconMessage {
  Type: RconMessageType;
  Identifier: number;
  Message: string;
  Stacktrace: string | null;
}

export type RconCommandCallback = (message: IRconMessage) => void | Promise<void>;
export type RconCallbacks = Record<number, RconCommandCallback>;

export type WebsocketOptions = ClientOptions | ClientRequestArgs;

export interface IMessageHandler<T = unknown> {
  type: RconMessageType;
  pattern?: RegExp | string;
  dataKeys?: string[];

  handle(data: T, webrcon: WebRcon, message: IRconMessage): void | Promise<void>;
}

export interface IChatMessage {
  Channel: number;
  Message: string;
  UserId: string;
  Username: string;
  Color: string;
  Time: number;
}

export interface IReportMessage {
  PlayerId: string;
  PlayerName: string;
  Subject: string;
  Message: string;
  Type: EReportType;
}

export type WebRconEvents = Record<string, [EventHandler[], EventHandler[]]>;
export type EventHandler = (webrcon: WebRcon) => void | Promise<void>;

export interface IDisposable {
  dispose(): void;
}
