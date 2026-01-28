import { devID } from "../interact/config/config.js";
import { embedNotificationDefault, embedNotificationError } from "./embed.js";

export const DMErrorBot = async (client, message) => {
    try {
        const user = await client.users.fetch(devID);
        await user.send({
            embeds : [embedNotificationError(`:warning: Bot gặp lỗi`, message, 0xFF0000)]
        });
    } catch (error) {
      console.error('Thông báo cho dev thất bại: ', error);
    };
};
export const DMNotificationJoinAndLeave = async (client, message, color) => {
    try {
        const user = await client.users.fetch(devID);
        await user.send({
            embeds : [embedNotificationDefault(`:loudspeaker: Thông báo`, message, color)]
        });
    } catch (error) {
        if (error.code === 50007) {
            console.warn(`⚠️ Không thể gửi DM cho ${error.requestBody ? 'dev' : 'user'}: User đã tắt DM hoặc chặn bot`);
        } else {
            console.error(`Thông báo cho dev thất bại: (DMNotificationJoinAndLeave/sendDM) `, error);
        }
    }
};