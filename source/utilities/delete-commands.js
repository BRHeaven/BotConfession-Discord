import dotenv from 'dotenv';
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v10';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildIds = process.env.WHITELIST_GUILD_IDS ? process.env.WHITELIST_GUILD_IDS.split(',').map(id => id.trim()) : [];
if (!token || !clientId) {
    console.error('❌ Không tìm thấy DISCORD_TOKEN hoặc CLIENT_ID trong .env');
    process.exit(1);
};
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log('🗑️  Bắt đầu xóa tất cả slash commands...\n');
        if (guildIds.length > 0) {
            console.log(`📋 Xóa commands từ ${guildIds.length} server...`);
            for (const guildId of guildIds) {
                try {
                    console.log(`  → Đang xóa commands từ server ${guildId}...`);
                    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
                    console.log(`  ✓ Đã xóa thành công commands từ server ${guildId}`);
                } catch (error) {
                    console.error(`  ✗ Lỗi khi xóa commands từ server ${guildId}:`, error.message);
                };
            };
        } else {
            console.log('⚠️  Không tìm thấy WHITELIST_GUILD_IDS, bỏ qua xóa guild commands');
        };
        console.log('\n🌍 Xóa global commands...');
        try {
            await rest.put(Routes.applicationCommands(clientId), { body: [] });
            console.log('  ✓ Đã xóa thành công global commands');
        } catch (error) {
            console.error('  ✗ Lỗi khi xóa global commands:', error.message);
        };
        console.log('\n✅ Hoàn thành việc xóa commands!');
        console.log('💡 Bây giờ bạn có thể chạy: npm run deploy-commands');
    } catch (error) {
        console.error('❌ Lỗi chung:', error);
        process.exit(1);
    };
})();
