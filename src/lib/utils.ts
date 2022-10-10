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
