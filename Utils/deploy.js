import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandFolders = [
    path.join(__dirname, '../Commands'),
    path.join(__dirname, '../Config')
];

for (const folder of commandFolders) {
    if (!fs.existsSync(folder)) continue;
    const files = fs.readdirSync(folder).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const filePath = path.join(folder, file);
        const command = await import(`file://${filePath}`);
        if (command.data) commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('🚀 Deploying slash commands...');
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
    );
    console.log('✅ Deploy successful!');
} catch (error) {
    console.error('❌ Deploy failed:', error);
}

