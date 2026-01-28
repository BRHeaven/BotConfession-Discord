import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { SET_SAVEPOINT_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";
import { devID } from "../config/config.js";

export const name = SET_SAVEPOINT_NAME;
export const data = new SlashCommandBuilder()
    .setName(SET_SAVEPOINT_NAME)
    .setDescription('Cài đặt điểm lưu trữ Confession hiện tại.')
    .addIntegerOption(option =>
        option.setName('số')
            .setDescription('Số điểm lưu trữ mới.')
            .setRequired(true)
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!devID.includes(interaction.user.id)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền DEVALOPER',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho DEVALOPER.',
                0xFF0000)]
        });
    };
    const newSavePoint = interaction.options.getInteger('số');
    const guildId = interaction.guild.id;
    const config = await prisma.config.findFirst({
        where: {
            guild: guildId
        },
    });
    if (!config) {
        await prisma.config.create({
            data: {
                guild: guildId,
                channel: 'null',
                forum: 'null',
                savepoint: newSavePoint,
                time: getVietnamTime(),
            },
        });
    } else {
        await prisma.config.update({
            where: {
                guild: guildId,
            },
            data: {
                savepoint: newSavePoint,
                time: getVietnamTime(),
            },
        });
    };
    return await interaction.editReply({
        embeds: [embedNotificationDefault(
            '✅ Cài đặt điểm lưu trữ thành công',
            `Điểm lưu trữ mới là: ${newSavePoint}`,
            0x00FF00
        )],
    });
}, null);