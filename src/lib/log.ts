import fs from 'fs';

export function appendLog(log: string, name = 'log') {
  const date = new Date().toISOString();
  const suffix = '-' + date.slice(0, 10) + '.log';

  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }

  const fileName = name + suffix;
  const appendLine = `[${date}] (${name}) ${log}`;
  console.info(appendLine);

  fs.appendFileSync('./log/' + fileName, appendLine + '\n', {});

  // 모든 로그가 log- 파일에 모입니다.
  if (name !== 'log' && name !== 'console') {
    fs.appendFileSync('./log/log' + suffix, appendLine + '\n', {});
  }
}
