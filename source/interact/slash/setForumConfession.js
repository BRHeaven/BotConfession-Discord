import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { SET_FORUM_NAME, UNSET_FORUM_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = SET_FORUM_NAME;
export const data = new SlashCommandBuilder()
    .setName(SET_FORUM_NAME)
    .setDescription('Chọn kênh diễn đàn nhận thông báo duyệt confession')
    .addChannelOption(option =>
        option.setName('channel_forum')
            .setDescription('Chọn kênh diễn đàn để nhận thông báo duyệt confession')
            .setRequired(true));
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await permissionAdmin(interaction)) {
        return await interaction.editReply({
            embeds : [embedNotificationDefault(
                ':no_entry: Quyền ADMIN',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000
            )]
        });
    };
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
                `Kênh <#${forumChannel.id}> đã được chọn làm kênh đăng Confession trước đó. Vui lòng chọn một kênh khác để thay đổi hoặc huỷ chọn kênh bằng lệnh \`${UNSET_FORUM_NAME}\` để hủy trước khi chọn lại`,
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