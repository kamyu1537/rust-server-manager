import fs from 'fs';
import { config } from './config';
import { IServerInfo } from './server.types';
import { getServerVariable, replaceInfoText } from './utils';
import WebRcon from './webrcon';

export const executeAutoCommands = async (webrcon: WebRcon) => {
  await webrcon.commandAsync('server.printReportsToConsole true');
  for (const command of config.autoCommands) {
    await webrcon.commandAsync(command);
  }
};

export const setServerInfo = async (webrcon: WebRcon) => {
  const serverInfoJson = await webrcon.commandAsync('serverinfo');
  const serverInfo = JSON.parse(serverInfoJson.Message) as IServerInfo;
  const worldSize = await getServerVariable('server.worldsize', webrcon);
  const maxTeamSize = await getServerVariable('relationshipmanager.maxteamsize', webrcon);

  const data = { info: serverInfo, worldSize, maxTeamSize };

  const hostname = replaceInfoText(config.serverName, data);
  const description = replaceInfoText(config.serverDescription, data);
  await webrcon.commandAsync('server.hostname "' + hostname + '"');
  await webrcon.commandAsync('server.description "' + description + '"');
  await webrcon.commandAsync('server.url "' + config.serverUrl + '"');
  await webrcon.commandAsync('server.headerimage "' + config.serverHeaderImage + '"');
};

export const removeEntities = async (webrcon: WebRcon) => {
  let save = false;

  for (const entityName of config.killEntities) {
    const msg = await webrcon.commandAsync(`entity.find_entity ${entityName}`);
    const [, ...entities] = msg.Message.split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    console.info(`found entities (${entityName}):`, entities.length);
    if (entities.length > 0) {
      for (const entity of entities) {
        const [, entityId] = /sv\s+(\d+)\s+.*/g.exec(entity) || [];
        if (entityId) {
          await webrcon.commandAsync(`entid kill ${entityId}`);
          console.info('killed entity:', entityId);
          save = true;
        }
      }
    }
  }

  if (save) {
    await webrcon.commandAsync('server.save');
    console.info('save command sent');
  }
};

export const checkServerMonuments = async (webrcon: WebRcon) => {
  if (config.necessaryMonuments.length === 0) return;

  const resp = await webrcon.commandAsync('world.monuments');
  const message = resp.Message;
  const found = config.necessaryMonuments.findIndex((monument) => message.includes(monument));

  if (found === -1) {
    console.info('monuments not found');

    if (fs.existsSync('./server.cfg')) {
      const seed = await getServerVariable('server.seed', webrcon);
      const newSeed = Math.floor(Math.random() * 2147484648) + 1;

      const cfg = fs.readFileSync('./server.cfg', 'utf8');
      if (cfg.includes('server.seed')) {
        const newCfg = cfg.replace(`server.seed "${seed}"`, `server.seed "${newSeed}"`);
        fs.writeFileSync('./server.cfg', newCfg);
        console.info('server.cfg updated');
      } else {
        fs.appendFileSync('./server.cfg', `server.seed "${newSeed}"`);
      }

      console.info('server restart request');
      await webrcon.commandAsync('restart 0');
    }
  }
};
