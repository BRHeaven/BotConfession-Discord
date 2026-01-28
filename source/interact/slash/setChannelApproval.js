import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { SET_CHANNEL_NAME, UNSET_CHANNEL_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = SET_CHANNEL_NAME;
export const data = new SlashCommandBuilder()
    .setName(SET_CHANNEL_NAME)
    .setDescription('Chọn kênh để nhận thông báo khi có confession mới cần duyệt')
    .addChannelOption(option =>
        option.setName('channel_text')
            .setDescription('Chọn kênh để nhận thông báo')
            .setRequired(true));
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await permissionAdmin(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền ADMIN',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000)]
        });
    };
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
                `Kênh <#${channel.id}> đã được chọn để nhận thông báo duyệt Confession. Vui lòng dùng chọn một kênh khác để thay đổi hoặc huỷ chọn kênh bằng lệnh \`${UNSET_CHANNEL_NAME}\` để hủy trước khi chọn lại`,
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
