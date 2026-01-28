import { whitelistGuilds } from "../interact/config/config.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { DMNotificationJoinAndLeave } from "../utilities/sendDM.js";

export const checkGuilds = asyncErrorHandler(async (guild, client, type) => {
    if (type === 'join') {
        let flag = false;
        await DMNotificationJoinAndLeave(client, `Đã thêm bot vào server: **${guild.name}** (ID: ${guild.id})`, 0x00FF00);
        for (const server of whitelistGuilds) {
            if (server.includes(guild.id)) { flag = true; break; };
        };
        if (!flag) {
            await DMNotificationJoinAndLeave(client, `Đã rời khỏi server: **${guild.name}** (ID: ${guild.id}) sau khi được mời`, 0xFF0000);
            await guild.leave();
        };
    };
    if (type === 'ready') {
        let flag = false;
        client.guilds.cache.forEach(async (guild) => {
            for (const server of whitelistGuilds) {
                if (guild.id.includes(server)) { flag = true; };
            };
            if (flag === false) {
                await DMNotificationJoinAndLeave(client, `Đã rời khỏi server: **${guild.name}** (ID: ${guild.id})`, 0xFF0000);
                await guild.leave();
            };
        });
    };
}, null);