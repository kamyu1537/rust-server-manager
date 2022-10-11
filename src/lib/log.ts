import fs from 'fs';

export function appendLog(log: string) {
  const fileName = 'log-' + new Date().toISOString().slice(0, 10) + '.log';
  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }

  fs.appendFileSync('./log/' + fileName, log + '\n', {});
}
