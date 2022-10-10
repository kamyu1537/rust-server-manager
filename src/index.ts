import { RCON_HOST, RCON_PASS } from './lib/config';
import WebRcon from './lib/webrcon';

import ChatHandler from './handlers/chat-handler';
import GameEventHandler from './handlers/game-event-handler';
import NewPlayerJoinedHandler from './handlers/new-player-joined-handler';
import PlayerDiedHandler from './handlers/player-died-handler';
import PlayerDisconnectHandler from './handlers/player-disconnect-handler';
import PlayerJoinedHandler from './handlers/player-joined-handler';
import PlayerKickHandler from './handlers/player-kick-handler';
import PlayerPveHandler from './handlers/player-pve-handler';
import PlayerPvpHandler from './handlers/player-pvp-handler';
import PlayerSpawnHandler from './handlers/player-spawn-handler';
import SaveHandler from './handlers/save-handler';

const webrcon = new WebRcon(RCON_HOST, RCON_PASS);

// Register handlers
webrcon.messageHandler.add(new SaveHandler());
webrcon.messageHandler.add(new GameEventHandler());
webrcon.messageHandler.add(new ChatHandler());
webrcon.messageHandler.add(new NewPlayerJoinedHandler());
webrcon.messageHandler.add(new PlayerJoinedHandler());
webrcon.messageHandler.add(new PlayerDisconnectHandler());
webrcon.messageHandler.add(new PlayerKickHandler());
webrcon.messageHandler.add(new PlayerSpawnHandler());
webrcon.messageHandler.add(new PlayerPveHandler());
webrcon.messageHandler.add(new PlayerPvpHandler());
webrcon.messageHandler.add(new PlayerDiedHandler());
