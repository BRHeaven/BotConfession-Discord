import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { CONFIG_CHANNEL_TEXT, CONFIG_SET, CONFIG_SETTINGS } from "../config/nametag.js";
import prisma from "../../utilities/prisma.js";

export const setChannelText = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.guild.id;
    const channel = interaction.options.getChannel('channel_text', true);
    const config = await prisma.config.findFirst({
        where: {
            guild: guildId
        },
    });
    const checkInput = await prisma.config.findFirst({
        where: {
            guild: guildId,
            channel: channel.id,
        },
    });
    if (checkInput) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':warning: Kênh đã được chọn',
                `Kênh <#${channel.id}> đã được chọn để nhận thông báo duyệt Confession. Vui lòng dùng chọn một kênh khác để thay đổi hoặc huỷ chọn kênh bằng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_CHANNEL_TEXT}\` để hủy trước khi chọn lại`,
                0xFFFF00)],
            ephemeral: true,
        });
    };
    if (!config) {
        await prisma.config.create({
            data: {
                guild: guildId,
                channel: channel.id,
                forum: 'null',
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
                channel: channel.id,
                time: getVietnamTime(),
            },
        });
    };
    await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':white_check_mark: Chọn kênh thành công',
            `Đã chọn kênh <#${channel.id}> để nhận thông báo duyệt Confession thành công!`,
            0x00FF00
        )]
    });
}, null);
