import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { CONFIG_CHANNEL_FORUM, CONFIG_SETTINGS, CONFIG_UNSET } from "../config/nametag.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const unsetChannelForum = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.guild.id;
    const guild = await prisma.config.findFirst({
        where: {
            guild: guildId,
        },
    });
    if (guild.forum === 'null') {
        return await interaction.editReply({
            embeds : [embedNotificationDefault(
                ':warning: Chưa có kênh được chọn',
                `Chưa có kênh diễn đàn nào được chọn để đăng Confession. Sử dụng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_FORUM}\` để chọn kênh diễn đàn trước khi dùng lênh này`,
                0xFFFF00
            )]
        });
    } else {
        const forum = guild.forum;
        await prisma.config.update({
            where: { 
                guild: guildId
            },
            data: {
                forum: 'null',
                time: getVietnamTime(),
            },
        });
        return await interaction.editReply({
            embeds : [embedNotificationDefault(
                ':white_check_mark: Hủy kênh thành công',
                `Đã hủy kênh <#${forum}> đăng Confession thành công. Sử dụng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_FORUM}\` để chọn lại kênh khác.`,
                0x00FF00
            )]
        });
    };
}, null);