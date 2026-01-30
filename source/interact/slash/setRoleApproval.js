import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { getVietnamTime } from "../../utilities/timezone.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const setRole = asyncErrorHandler(async (interaction) => {
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