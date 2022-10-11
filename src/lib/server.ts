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
  await webrcon.commandAsync('server.hostname ' + hostname);
  await webrcon.commandAsync('server.description ' + description);
  await webrcon.commandAsync('server.url ' + config.serverUrl);
  await webrcon.commandAsync('server.headerimage ' + config.serverHeaderImage);
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
