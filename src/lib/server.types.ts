export interface IServerInfo {
  Hostname: string;
  MaxPlayers: number;
  Players: number;
  Queued: number;
  Joining: number;
  EntityCount: number;
  GameTime: string;
  Uptime: number;
  Map: string;
  Framerate: number;
  Memory: number;
  Collections: number;
  NetworkIn: number;
  NetworkOut: number;
  Restarting: boolean;
  SaveCreatedTime: string;
  Version: number;
  Protocol: string;
}

export interface IReplaceInfoTextOptions {
  info: IServerInfo;
  worldSize: string;
  maxTeamSize: string;
}
