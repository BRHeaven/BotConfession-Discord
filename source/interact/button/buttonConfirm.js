import prisma from "../../utilities/prisma.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_ANONYMOUS_NAME, GET_BUTTON_CONFIRM, GET_IDENTIFY_NAME, STATUS_ACCEPT, STATUS_CONFIRM, STATUS_PENDING, STATUS_REFUSE } from "../config/nametag.js";
import { hasPermission } from "../config/permission.js";
import { embedAPPROVAL, embedNotificationDefault } from "../../utilities/embed.js";
import { handlePostCFS } from "../../handle/handlePostCFS.js";
import { handleDeleteCFS } from "../../handle/handleDeteleCFS.js";

export const name = GET_BUTTON_CONFIRM;
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferUpdate();
    if (!await hasPermission(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Không đủ quyền',
                'Bạn chưa được chọn để duyệt bài. Liên hệ ADMIN để được cấp quyền.',
                0xFF0000
            )],
        });
    };
    const cfsID = parseInt(interaction.customId.replace(GET_BUTTON_CONFIRM, ''));
    const confession = await prisma.cfs_pending.findFirst({
        where: {
            id: cfsID,
        },
    });
    const config = await prisma.config.findFirst({
        where: {
            guild: interaction.guild.id,
        },
    });
    const flagAnonymous = confession.anonymous;
    let flag = false;
    switch (confession.status) {
        case STATUS_ACCEPT:
            await handlePostCFS(interaction, confession, flagAnonymous);
            await interaction.message.edit({
                content: `✅ **${interaction.user.tag} đã DUYỆT Confession #${config.savepoint}**`,
                embeds: [embedAPPROVAL(
                    confession.title,
                    confession.content,
                    config.savepoint + 1,
                    confession.anonymous === true ? GET_ANONYMOUS_NAME : GET_IDENTIFY_NAME,
                    confession.userId,
                    0x00FF00
                )],
                components: [],
            });
            flag = true;
            break;
        case STATUS_REFUSE:
            await handleDeleteCFS( confession, flagAnonymous);
            await interaction.message.edit({
                content: `❌ **${interaction.user.tag} đã TỪ CHỐI Confession #${config.savepoint}**`,
                embeds: [embedAPPROVAL(
                    confession.title,
                    confession.content,
                    config.savepoint + 1,
                    confession.anonymous === true ? GET_ANONYMOUS_NAME : GET_IDENTIFY_NAME,
                    confession.userId,
                    0xFF0000
                )],
                components: [],
            });
            flag = true;
            break;
        case STATUS_PENDING:
            break;
        case STATUS_CONFIRM:
            break;
        default:
            break;
    };
    if (flag) {
        await prisma.cfs_pending.delete({
            where: {
                id: confession.id,
            },
        });
    };

}, null);