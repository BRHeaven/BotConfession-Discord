import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { UNSET_ROLE_NAME } from "../config/nametag.js";
import { permissionAdmin } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import prisma from "../../utilities/prisma.js";
import { embedNotificationDefault } from "../../utilities/embed.js";

export const name = UNSET_ROLE_NAME;
export const data = new SlashCommandBuilder()
    .setName(UNSET_ROLE_NAME)
    .setDescription('Hủy role cấp quyền duyệt confession')
    .addRoleOption(option =>
        option.setName('role')
            .setDescription('Chọn role để hủy quyền duyệt confession')
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
    if (!testInput) return await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':warning: Role không tồn tại',
            `Role <@${role.id}> chưa được cấp quyền`,
            0xFFFF00
        )]
    });
    await prisma.role.deleteMany({
        where: {
            guild: interaction.guild.id,
            roleId: role.id,
        },
    });
    await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':white_check_mark: Hủy role thành công',
            `Đã hủy role ${role.name} khỏi danh sách`,
            0x00FF00
        )]
    });
}, null);