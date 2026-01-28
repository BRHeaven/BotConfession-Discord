import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { checkGuilds } from './source/handle/checkGuildWhite.js';
import { loadCommands, loadEvent } from './source/events/loadEvent.js';
import { setupProcessErrorHandlers } from './source/middlewares/errorHandler.js';

dotenv.config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.slash = new Collection();

client.on('guildCreate', async (guild) => {
    await checkGuilds(guild, client, 'join');
});
client.on(Events.ClientReady, async (guild) => {
    await checkGuilds(guild, client, 'ready');
});

await loadCommands( { client, folders: ['source/interact/button'], targetMap: client.buttons});
await loadCommands( { client, folders: ['source/interact/modal'], targetMap: client.modals});
await loadCommands( { client, folders: ['source/interact/slash'], targetMap: client.slash});
await loadCommands({ client, folders: ['source/handle'], targetMap: client.modals});
await loadEvent(client);

client.login(process.env.DISCORD_TOKEN);
client.once(Events.ClientReady, async () => { 
    console.log(`ID Bot: ${client.user.id} - Name Bot : ${client.user.tag}`);
    setupProcessErrorHandlers(client);
});