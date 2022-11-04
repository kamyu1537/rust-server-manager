import fs from 'fs';
import { DateTime } from 'luxon';

export function appendLog(log: string, name = 'log') {
  const date = DateTime.local({ zone: process.env.TZ });
  const prefix = date.toFormat('yyyy-MM-dd') + '_';

  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }

  const fileName = prefix + name + '.log';
  const appendLine = `[${date.toString()}] (${name}) ${log}`;
  console.info(appendLine);

  fs.appendFileSync('./log/' + fileName, appendLine + '\n', {});

  // console 로그를 제외한 모든 로그가 all 파일에 모입니다.
  if (name !== 'log' && name !== 'console') {
    fs.appendFileSync('./log/' + prefix + '_all.log', appendLine + '\n', {});
  }
}
