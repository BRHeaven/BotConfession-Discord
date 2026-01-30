import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const unsetRole = asyncErrorHandler(async (interaction) => {
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