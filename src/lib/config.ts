import 'dotenv/config';
import fs from 'fs';

export const SERVER_KEY = process.env.SERVER_KEY || 'server_1';
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

export const RCON_HOST = process.env.RCON_HOST || '127.0.0.1:28016';
export const RCON_PASS = process.env.RCON_PASS || 'password';

interface IConfigData {
  killEntities: string[];
  allowedCountries: string[];
  allowProxy: boolean;

  serverName: string;
  serverUrl: string;
  serverHeaderImage: string;
  serverDescription: string;

  autoCommands: string[];

  playerCountChannelId: string;
  playerCountChannelNameFormat: string;
  gameEventChannelId: string;
}

export let config: IConfigData = {
  killEntities: [],
  allowedCountries: [],
  allowProxy: true,

  serverName: 'My Server',
  serverUrl: 'https://myserver.com',
  serverHeaderImage: 'https://myserver.com/header.png',
  serverDescription: '',

  autoCommands: [],

  playerCountChannelId: '',
  playerCountChannelNameFormat: 'Player: {count}',
  gameEventChannelId: '',
};

if (fs.existsSync('./config.json')) {
  const read = fs.readFileSync('./config.json', 'utf8');
  config = Object.assign(config, JSON.parse(read));
}

fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

if (fs.existsSync('./description.txt')) {
  config.serverDescription = fs.readFileSync('./description.txt', 'utf8');
}
