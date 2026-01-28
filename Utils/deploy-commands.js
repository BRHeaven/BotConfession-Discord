import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
config();
const commands = [];
const commandFolders = ['../Commands', '../Config'];
for (const folder of commandFolders) {
  const files = fs.readdirSync(folder).filter(file => file.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(folder, file);
    const command = await import(`file://${path.resolve(filePath)}`);
    if (command.data) {
      commands.push(command.data.toJSON());
    };
  };
};
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log('🚀 Đang deploy các slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('✅ Deploy slash commands thành công!');
  } catch (error) {
    console.error('❌ Deploy thất bại:', error);
  }
})();
