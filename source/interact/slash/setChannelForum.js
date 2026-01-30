import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { CONFIG_CHANNEL_TEXT, CONFIG_SET, CONFIG_SETTINGS } from "../config/nametag.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const setChannelForum = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.guild.id;
    const forumChannel = interaction.options.getChannel('channel_forum', true);
    const config = await prisma.config.findFirst({
        where: { 
            guild: guildId,
         
        },
    });
    const checkInput = await prisma.config.findFirst({
        where: {
            guild: guildId,
            forum: forumChannel.id,
        },
    });
    if (checkInput) {
        return await interaction.editReply({
            embeds : [embedNotificationDefault(
                ':warning: Kênh đã được chọn',
                `Kênh <#${forumChannel.id}> đã được chọn làm kênh đăng Confession trước đó. Vui lòng chọn một kênh khác để thay đổi hoặc huỷ chọn kênh bằng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_CHANNEL_TEXT}\` để hủy trước khi chọn lại`,
                0xFFFF00
            )]
        });
    };
    if (!config) {
        await prisma.config.create({
            data: {
                guild: guildId,
                channel: 'null',
                forum: forumChannel.id,
                savepoint: 0,
                time: getVietnamTime(),
            },
        });
    } else {
        await prisma.config.update({
            where: {
                guild: guildId,
            },
            data: {
                forum: forumChannel.id,
                time: getVietnamTime(),
            },
        });
    };
    return await interaction.editReply({
        embeds : [embedNotificationDefault(
            ':white_check_mark: Chọn kênh thành công',
            `Đã chọn kênh <#${forumChannel.id}> làm kênh đăng Confession thành công!`,
            0x00FF00
        )]
    });
}, null);