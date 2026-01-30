import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { HANDLE_MODAL_REPLY_ANONYMOUS } from "../interact/config/nametag.js";
import { handleReplyAnonymous } from "./handleReplyAnonymous.js";
import { embedNotificationDefault } from "../utilities/embed.js";

export const name = HANDLE_MODAL_REPLY_ANONYMOUS;
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const replyContent = interaction.fields.getTextInputValue("reply_cfs");
    await handleReplyAnonymous(interaction, replyContent);
    return await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':white_check_mark: Gửi thành công',
            'Đã gửi trả lời ẩn danh!',
            0x00FF00,
        )],
        ephemeral: true,
    });
}, null);