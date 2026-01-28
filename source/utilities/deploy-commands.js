import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import dotenv from 'dotenv';
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildIds = process.env.WHITELIST_GUILD_IDS ? process.env.WHITELIST_GUILD_IDS.split(',').map(id => id.trim()) : [];
if (!token || !clientId) {
    console.error('Không tìm thấy DISCORD_TOKEN hoặc CLIENT_ID trong .env');
    process.exit(1);
};
if (guildIds.length === 0) {
    console.error('Không tìm thấy WHITELIST_GUILD_IDS trong .env');
    process.exit(1);
};
const commands = [];
const commandsPath = path.join(process.cwd(), 'source', 'interact', 'slash');
if (!fs.existsSync(commandsPath)) {
    console.error('Không tìm thấy thư mục lệnh slash tại', commandsPath);
    process.exit(1);
};
const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of files) {
    const filePath = path.join(commandsPath, file);
    const mod = await import(pathToFileURL(filePath).href);
    const cmd = mod.data ?? (mod.default && mod.default.data) ?? null;
    if (cmd && typeof cmd.toJSON === 'function') {
        commands.push(cmd.toJSON());
    };
};
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log(`Cài đặt ${commands.length} lệnh vào ${guildIds.length} server...`);
        for (const guildId of guildIds) {
            try {
                console.log(`  → Cài đặt vào server ${guildId}...`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
                console.log(`  ✓ Cài đặt thành công vào server ${guildId}`);
            } catch (error) {
                console.error(`  ✗ Lỗi cài đặt server ${guildId}:`, error.message);
            };
        };
        console.log('Hoàn thành cài đặt lệnh.');
    } catch (error) {
        console.error('Lỗi chung:', error);
    };
})();