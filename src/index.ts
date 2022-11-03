import { RCON_HOST, RCON_PASS } from './lib/config';
import { checkServerMonuments, executeAutoCommands, removeEntities, setServerInfo } from './lib/server';
import WebRcon from './lib/webrcon';

import ChatHandler from './handlers/chat-handler';
import GameEventHandler from './handlers/game-event-handler';
import NewPlayerJoinedHandler from './handlers/new-player-joined-handler';
import PlayerCmdKickHandler from './handlers/player-cmd-kick-handler';
import PlayerDiedHandler from './handlers/player-died-handler';
import PlayerDisconnectHandler from './handlers/player-disconnect-handler';
import PlayerEacKickHandler from './handlers/player-eac-kick-handler';
import PlayerJoinedHandler from './handlers/player-joined-handler';
import PlayerKickHandler from './handlers/player-kick-handler';
import PlayerPveHandler from './handlers/player-pve-handler';
import PlayerPveVictimHandler from './handlers/player-pve-victim-handler';
import PlayerPvpHandler from './handlers/player-pvp-handler';
import PlayerSpawnHandler from './handlers/player-spawn-handler';
import RefillPopulations from './handlers/refill_populations';
import ReportHandler from './handlers/report-handler';
import SaveHandler from './handlers/save-handler';
import SpawnRedKeyCard from './handlers/spawn-keycard-red';
import DiscordClient from './lib/discord';

const webrcon = new WebRcon(RCON_HOST, RCON_PASS);
DiscordClient.getInstance(webrcon);

// events
webrcon.on('connected', checkServerMonuments);
webrcon.on('connected', executeAutoCommands);
webrcon.on('connected', setServerInfo);
webrcon.on('connected', removeEntities);

// Register handlers
webrcon.messageHandler.add(new SaveHandler());
webrcon.messageHandler.add(new GameEventHandler());
webrcon.messageHandler.add(new ChatHandler());
webrcon.messageHandler.add(new ReportHandler());
webrcon.messageHandler.add(new NewPlayerJoinedHandler());
webrcon.messageHandler.add(new PlayerJoinedHandler());
webrcon.messageHandler.add(new PlayerDisconnectHandler());
webrcon.messageHandler.add(new PlayerCmdKickHandler());
webrcon.messageHandler.add(new PlayerKickHandler());
webrcon.messageHandler.add(new PlayerEacKickHandler());
webrcon.messageHandler.add(new PlayerSpawnHandler());
webrcon.messageHandler.add(new PlayerPveHandler());
webrcon.messageHandler.add(new PlayerPveVictimHandler());
webrcon.messageHandler.add(new PlayerPvpHandler());
webrcon.messageHandler.add(new PlayerDiedHandler());
webrcon.messageHandler.add(new SpawnRedKeyCard());
webrcon.messageHandler.add(new RefillPopulations());
