import DiscordClient from '../lib/discord';
import { getParenthesisText } from '../lib/utils';
import type { IMessageHandler, RconMessageType } from '../lib/webrcon/types';

interface IChatMessage {
  Channel: number;
  Message: string;
  UserId: string;
  Username: string;
  Color: string;
  Time: number;
}

class PlayerKickHandler implements IMessageHandler<IChatMessage> {
  type: RconMessageType = 'Chat';

  handle(data: IChatMessage): void {
    if (data.Channel !== 2 || data.UserId !== '0' || data.Username !== 'SERVER') return;

    if (!/Kicking (.*)/g.test(data.Message)) return;

    const content = data.Message.replace('Kicking ', '');
    const result = getParenthesisText(content);

    const displayName = result.slice(0, -1).join('');
    const reason = result[result.length - 1].slice(1, -1);

    console.log('player kicked:', { displayName, reason });

    DiscordClient.getInstance()?.updatePlayerCount();
  }
}

export default PlayerKickHandler;
