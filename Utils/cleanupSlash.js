import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const CLIENT_ID = 'YOUR_CLIENT_ID';
const GUILD_ID = 'YOUR_GUILD_ID'; // Lấy guildId test bị trùng

(async () => {
  try {
    console.log('🚮 Đang xoá toàn bộ slash command trong guild test...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [] }
    );
    console.log('✅ Đã xoá hết slash command trong guild test');
  } catch (error) {
    console.error(error);
  }
})();