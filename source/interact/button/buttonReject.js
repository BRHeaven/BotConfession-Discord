import { handleConfirm } from "../../handle/handleConfirm.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { GET_BUTTON_REJECT, STATUS_REFUSE } from "../config/nametag.js";
import { hasPermission } from "../config/permission.js";

export const name = GET_BUTTON_REJECT;
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
    const cfsID = parseInt(interaction.customId.replace(GET_BUTTON_REJECT, ''));
    const handle = await handleConfirm(cfsID, STATUS_REFUSE);
    await interaction.editReply({
        content:`⏳ **${interaction.user.tag} đã chọn TỪ CHỐI** - Xác nhận lại`,
        embeds: [handle.embedCFS],
        components: [handle.buttons],
    });
}, null);