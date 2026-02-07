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
    console.warn('⚠️  Không tìm thấy WHITELIST_GUILD_IDS, chỉ deploy global commands');
};
const guildCommands = [];
const globalCommands = [];
const commandsPath = path.join(process.cwd(), 'source', 'interact', 'slash');
const dmCommandsPath = path.join(process.cwd(), 'source', 'interact', 'global');

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
        guildCommands.push(cmd.toJSON());
    };
};

if (fs.existsSync(dmCommandsPath)) {
    const dmFiles = fs.readdirSync(dmCommandsPath)
        .filter(f => f.endsWith('.js') && f !== 'globalController.js' && f !== 'services.js');
    for (const file of dmFiles) {
        const filePath = path.join(dmCommandsPath, file);
        try {
            const mod = await import(pathToFileURL(filePath).href);
            const cmd = mod.data ?? (mod.default && mod.default.data) ?? null;
            if (cmd && typeof cmd.toJSON === 'function') {
                globalCommands.push(cmd.toJSON());
            };
        } catch (error) {
            console.warn(`⚠️  Bỏ qua file ${file}:`, error.message);
        };
    };
};
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log(`📋 Tổng cộng: ${guildCommands.length} guild commands, ${globalCommands.length} global commands\n`);
        console.log(`Cài đặt ${guildCommands.length} lệnh vào ${guildIds.length} server...`);
        for (const guildId of guildIds) {
            try {
                console.log(`  → Cài đặt vào server ${guildId}...`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands });
                console.log(`  ✓ Cài đặt thành công vào server ${guildId}`);
            } catch (error) {
                console.error(`  ✗ Lỗi cài đặt server ${guildId}:`, error.message);
            };
        };
        console.log('\n🌍 Đang cài đặt lệnh global (cho DM)...');
        try {
            await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
            console.log(`✓ Cài đặt thành công ${globalCommands.length} lệnh global`);
        } catch (error) {
            console.error('✗ Lỗi cài đặt lệnh global:', error.message);
        };
        
        console.log('\nHoàn thành cài đặt lệnh.');
    } catch (error) {
        console.error('Lỗi chung:', error);
    };
})();