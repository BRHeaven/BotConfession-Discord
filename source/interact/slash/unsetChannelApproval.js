import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { SET_CHANNEL_NAME, UNSET_CHANNEL_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = UNSET_CHANNEL_NAME;
export const data = new SlashCommandBuilder()
    .setName(UNSET_CHANNEL_NAME)
    .setDescription('Hủy kênh văn bản nhận thông báo duyệt confession')
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await permissionAdmin(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền ADMIN',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000
            )]
        });
    };
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
                `Chưa có kênh duyệt Confession. Sử dụng lệnh \`${SET_CHANNEL_NAME}\` để chọn kênh văn bản duyệt trước khi dùng lênh này`,
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
                `Đã hủy kênh <#${channel}> nhận thông báo duyệt Confession thành công. Sử dụng lệnh \`${SET_CHANNEL_NAME}\` để chọn lại kênh khác.`,
                0x00FF00
            )]
        });
    };
}, null);