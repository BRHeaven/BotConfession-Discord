import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_ANONYMOUS_NAME, GET_LIST_PENDING, STATUS_ACCEPT, STATUS_PENDING, STATUS_REFUSE } from "../config/nametag.js";
import { hasPermission } from "../config/permission.js";
import { SlashCommandBuilder } from "discord.js";
import { embedAPPROVAL, embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";
import { buttonsRejectorApprove } from "../button/buttons.js";

export const name = GET_LIST_PENDING;
export const data = new SlashCommandBuilder()
    .setName(GET_LIST_PENDING)
    .setDescription('Gửi lại sách Confession chờ duyệt');
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await hasPermission(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Không đủ quyền',
                'Bạn chưa được chọn để duyệt bài. Liên hệ ADMIN để được cấp quyền.',
                0xFF0000
            )],
        });
    };
    const config = await prisma.config.findFirst({
        where: {
            guild: interaction.guild.id
        },
    });
    const list = await prisma.cfs_pending.findMany({
        where: {
            guild: config.guild
        },
    });
    if (list.length === 0) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                '📭 Danh sách trống',
                'Hiện tại không có bài viết nào đang chờ duyệt.',
                0x00ff00
            )],
        });
    };
    const channel = await interaction.client.channels.fetch(config.channel);
    for (const confession of list) {
        if ([STATUS_ACCEPT, STATUS_REFUSE].includes(confession.status)) {
            await prisma.cfs_pending.update({
                where: {
                    id: confession.id,
                },
                data: {
                    status: STATUS_PENDING,
                },
            });
        };
    };
    for (const confession of list) {
        const buttons = await buttonsRejectorApprove(confession);
        await channel.send({
            content: `📢 **Confession chờ kiểm duyệt**`,
            embeds: [embedAPPROVAL(
                confession.title,
                confession.content,
                config.savepoint + 1,
                confession.anonymous === GET_ANONYMOUS_NAME ? true : false,
                interaction.user.id,
                0x00B0FF,
            )],
            components: [buttons],
        });
    };
    return await interaction.editReply({
        embeds: [embedNotificationDefault(
            '✅ Hoàn tất gửi lại',
            'Đã gửi lại toàn bộ bài viết chờ duyệt vào kênh duyệt confession.',
            0x00ff00
        )],
    });
}, null);