import { Client, GatewayIntentBits } from 'discord.js';
import { config, DISCORD_BOT_TOKEN, SERVER_KEY } from './config';
import WebRcon from './webrcon';

class DiscordClient {
  private client: Client;
  private static discordClient: DiscordClient | undefined;

  static getInstance(webrcon?: WebRcon) {
    if (!DISCORD_BOT_TOKEN) return undefined;
    if (this.discordClient == null && webrcon != null) {
      this.discordClient = new DiscordClient(webrcon);
    }
    return this.discordClient;
  }

  constructor(private readonly webrcon: WebRcon) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.on('ready', () => {
      console.info('discord bot ready!');
    });

    this.client.login(DISCORD_BOT_TOKEN);
  }

  async updatePlayerCount() {
    if (!this.webrcon.isConnected) return;
    if (!this.client.isReady()) return;
    if (!config.playerCountChannelId) return;
    if (!config.playerCountChannelNameFormat) return;

    const channel = await this.client.channels.fetch(config.playerCountChannelId);
    if (channel && channel.isVoiceBased()) {
      const serverInfo = await this.webrcon.getServerInfo();
      channel.setName(config.playerCountChannelNameFormat.replace('{count}', serverInfo.Players.toString()));
    }
  }

  async sendGameEventMessage(prefab: string) {
    if (!this.client.isReady()) return;
    if (!config.gameEventChannelId) return;

    const channel = await this.client.channels.fetch(config.gameEventChannelId);
    if (channel && channel.isTextBased()) {
      channel.send(`[**${SERVER_KEY.toUpperCase()}** GAME EVENT] ${prefab}`);
    }
  }
}

export default DiscordClient;
