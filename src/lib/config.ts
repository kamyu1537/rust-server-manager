import 'dotenv/config';
import fs from 'fs';

export const RCON_HOST = process.env.RCON_HOST || '127.0.0.1:28016';
export const RCON_PASS = process.env.RCON_PASS || 'password';

interface IConfigData {
  killEntities: string[];
  allowedCountries: string[];
  allowProxy: boolean;

  serverName: string;
  serverHomepage: string;
  serverHeaderImage: string;
  serverDescription: string;
}

export let config: IConfigData = {
  killEntities: [],
  allowedCountries: [],
  allowProxy: true,

  serverName: 'My Server',
  serverHomepage: 'https://myserver.com',
  serverHeaderImage: 'https://myserver.com/header.png',
  serverDescription: 'My Server Description',
};

if (fs.existsSync('./config.json')) {
  const read = fs.readFileSync('./config.json', 'utf8');
  config = Object.assign(config, JSON.parse(read));
}

fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
