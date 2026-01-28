import { GET_ANONYMOUS_NAME, GET_MODAL_ANONYMOUS_NAME } from "../interact/config/nametag.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../utilities/embed.js";
import { handleSubmitCFS } from "./handleSubmitCFS.js";

export const name = GET_MODAL_ANONYMOUS_NAME;
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    await handleSubmitCFS(interaction, GET_ANONYMOUS_NAME);
    return await interaction.editReply({
        embeds : [embedNotificationDefault(
            ':white_check_mark: Gửi thành công',
            'Đã gửi confession! Vui lòng chờ admin duyệt, bạn sẽ nhận thông báo qua tin nhắn riêng từ bot khi bài viết của bạn được duyệt.',
            0x00FF00,
        )],
        ephemeral: true,
    });
}, null);