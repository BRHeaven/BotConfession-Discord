import { handleConfirm } from "../../handle/handleConfirm.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import {  HANDLE_BUTTON_APPROVE, STATUS_ACCEPT } from "../config/nametag.js";
import { hasPermission } from "../config/permission.js";

export const name = HANDLE_BUTTON_APPROVE;
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferUpdate(); 
    if (!await hasPermission(interaction)) {
        return await interaction.editReply({
            embeds : [embedNotificationDefault(
                ':no_entry: Không đủ quyền',
                'Bạn chưa được chọn để duyệt bài. Liên hệ ADMIN để được cấp quyền.',
                0xFF0000
            )],
        });
    };
    const cfsID = parseInt(interaction.customId.replace(HANDLE_BUTTON_APPROVE, ''));
    const handle = await handleConfirm(cfsID, STATUS_ACCEPT);
    await interaction.editReply({
        content:`⏳ **${interaction.user.tag} đã chọn DUYỆT** - Xác nhận lại`,
        embeds: [handle.embedCFS],
        components: [handle.buttons],
    });
}, null);