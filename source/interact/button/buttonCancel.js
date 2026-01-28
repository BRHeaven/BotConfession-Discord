import prisma, { getSavePoint } from "../../utilities/prisma.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { hasPermission } from "../config/permission.js";
import { GET_ANONYMOUS_NAME, GET_BUTTON_APPROVE, GET_BUTTON_CANCEL, GET_BUTTON_REJECT, GET_IDENTIFY_NAME, STATUS_PENDING } from "../config/nametag.js";
import { embedAPPROVAL } from "../../utilities/embed.js";

export const name = GET_BUTTON_CANCEL;
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
    const cfsID = parseInt(interaction.customId.replace(GET_BUTTON_CANCEL, ''));
    const confession = await prisma.cfs_pending.findFirst({
        where: {
            id: cfsID,
        },
    });
    await prisma.cfs_pending.update({
        where: {
            id: confession.id,
        },
        data: {
            status: STATUS_PENDING
        },
    });
    const savePoint = await getSavePoint(confession.guild);
    const embedCFS = embedAPPROVAL(
        confession.title,
        confession.content,
        savePoint + 1,
        confession.anonymous === true ? GET_ANONYMOUS_NAME : GET_IDENTIFY_NAME,
        confession.userId,
        0x00B0FF
    );
    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`${GET_BUTTON_REJECT}${confession.id}`)
            .setLabel('❌ Từ chối')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`${GET_BUTTON_APPROVE}${confession.id}`)
            .setLabel('✔️ Duyệt')
            .setStyle(ButtonStyle.Success)
    );
    await interaction.editReply({
        content: `📢 Confession chờ kiểm duyệt`,
        embeds: [embedCFS],
        components: [buttons]
    });
}, null);