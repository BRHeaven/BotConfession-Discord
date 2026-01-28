import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const commands = [];
const configPath = path.join(process.cwd(), 'Config');
const commandFiles = fs.readdirSync(configPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(configPath, file);
  const command = await import(`file://${filePath}`);
  if (command.data) {
    commands.push(command.data.toJSON());
  };
};
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
try {
  console.log(`🔃 Đang triển khai lệnh ${commands.length} lệnh cấu hình...`);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),
    { body: commands },
  );
  console.log('✅ Slash Commands (Config) Đã triển khai thành công!');
} catch (error) {
  console.error('❌ Thất bại:', error);
};