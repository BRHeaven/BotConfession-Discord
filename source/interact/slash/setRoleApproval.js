import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { SET_ROLE_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = SET_ROLE_NAME;
export const data = new SlashCommandBuilder()
    .setName(SET_ROLE_NAME)
    .setDescription('Chọn role để cấp quyền duyệt confession')
    .addRoleOption(option =>
        option.setName('role')
            .setDescription('Chọn role để cấp quyền duyệt confession')
            .setRequired(true));
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await permissionAdmin(interaction)) {
        return interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền ADMIN',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000
            )]
        });
    };
    const role = interaction.options.getRole('role');
    const testInput = await prisma.role.findFirst({
        where: {
            guild: interaction.guild.id,
            roleId: role.id,
        },
    });
    if (testInput) return await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':warning: Role đã tồn tại',
            `Role <@${role.id}> đã được cấp quyền duyệt từ trước`,
            0xFFFF00
        )]
    });
    await prisma.role.create({
        data: {
            guild: interaction.guild.id,
            roleId: role.id,
            time: getVietnamTime(),
        },
    });
    await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':white_check_mark: Thêm role thành công',
            `Đã thêm role ${role.name} vào danh sách`,
            0x00FF00
        )]});
}, null);