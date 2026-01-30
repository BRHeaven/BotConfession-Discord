import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { CONFIG_CHANNEL_TEXT, CONFIG_UNSET, CONFIG_SETTINGS } from "../config/nametag.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const unsetChannelText = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.guild.id;
    const guild = await prisma.config.findFirst({
        where: {
            guild: guildId,
        },
    });
    if (guild.channel === 'null') {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':warning: Chưa có kênh được chọn',
                `Chưa có kênh duyệt Confession. Sử dụng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_TEXT}\` để chọn kênh văn bản duyệt trước khi dùng lênh này`,
                0xFFFF00
            )]
        });
    } else {
        const channel = guild.channel;
        await prisma.config.update({
            where: {
                guild: guildId,
            },
            data: {
                channel: 'null',
                time: getVietnamTime(),
            },
        });
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':white_check_mark: Hủy kênh thành công',
                `Đã hủy kênh <#${channel}> nhận thông báo duyệt Confession thành công. Sử dụng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_TEXT}\` để chọn lại kênh khác.`,
                0x00FF00
            )]
        });
    };
}, null);