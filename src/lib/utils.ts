import { DateTime } from 'luxon';
import { IReplaceInfoTextOptions } from './server.types';
import type WebRcon from './webrcon';

export const getParenthesisText = (str: string) => {
  const result: string[] = [];
  const queue: number[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      if (result.length < 1) {
        result.push(str.slice(0, i));
      }
      queue.push(i);
    } else if (str[i] === ')') {
      const start = queue.pop();
      if (start !== undefined) {
        if (queue.length < 1) {
          result.push(str.slice(start, i + 1));
        }
      }
    }
  }

  if (queue.length > 0) {
    result.push(str.slice(queue.shift(), str.length));
  }

  return result;
};

export const getServerVariable = async (command: string, webrcon: WebRcon) => {
  return (await webrcon.commandAsync(command)).Message.split(`${command}: `)[1].replace(/"/g, '');
};

export const replaceInfoText = (str: string, data: IReplaceInfoTextOptions) => {
  const dateTime = DateTime.fromJSDate(new Date(data.info.SaveCreatedTime));
  return str
    .replace(/{world_size}/g, data.worldSize)
    .replace(/{max_team_size}/g, data.maxTeamSize)
    .replace(/{last_reset}/g, dateTime.toFormat('yyyy-MM-dd HH:mm:ss'))
    .replace(/{last_reset_only_md}/g, dateTime.toFormat('yyyy-MM-dd'))
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
};

interface Position {
  x: number;
  y: number;
  z: number;
}

export const getEntityPosition = (str: string): Position => {
  const [x, y, z] = str
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map((v) => parseFloat(v.trim()));
  return { x, y, z };
};

export const getDistance = (a: string, b: string): number => {
  const aPos = getEntityPosition(a);
  const bPos = getEntityPosition(b);
  return Math.sqrt(Math.pow(aPos.x - bPos.x, 2) + Math.pow(aPos.y - bPos.y, 2) + Math.pow(aPos.z - bPos.z, 2));
};
