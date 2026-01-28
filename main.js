import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { whitelistGuilds } from './Utils/whitelist.js';
dotenv.config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
});
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
// Server Whitelist
client.on('guildCreate', async (guild) => {
  if (!whitelistGuilds.includes(guild.id)) {
    console.log(`❌ Bot bị invite vào server ngoài whitelist: ${guild.name} (${guild.id}), sẽ tự out...`);
    await guild.leave();
  } else {
    console.log(`✅ Bot đã vào server trong whitelist: ${guild.name} (${guild.id})`);
  }
});
// Load Commands
const commandFolders = ['Commands', 'Config'];
for (const folder of commandFolders) {
  const commandsPath = path.join(process.cwd(), folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    if (command.name) {
      client.commands.set(command.name, command);
    };
  };
};
// Load Buttons
const buttonsPath = path.join(process.cwd(), 'Buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
  const filePath = path.join(buttonsPath, file);
  const button = await import(`file://${filePath}`);
  if (button.name) {
    client.buttons.set(button.name, button);
  };
};
// Load Modals
const modalsPath = path.join(process.cwd(), 'Modals');
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
for (const file of modalFiles) {
  const filePath = path.join(modalsPath, file);
  const modal = await import(`file://${filePath}`);
  if (modal.name) {
    client.modals.set(modal.name, modal);
  };
};

// Load Events
const eventsPath = path.join(process.cwd(), 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(`file://${filePath}`);
  if (event.name && typeof event.execute === 'function') {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    };
  };
};
client.login(process.env.DISCORD_TOKEN);
client.once('ready', async () => {
  console.log(`✅ Bot đã sẵn sàng với ID ${client.user.tag}`);
  const { sendAllPendingConfessions } = await import('./Services/serviceCfs.js');
  //await sendAllPendingConfessions(client); // gửi ngay 1 lần khi bot khởi động

  // Gửi tự động mỗi 15 giây
  setInterval(() => {
    sendAllPendingConfessions(client, true); // onlyNew = true
  }, 15000);

});
