import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_MODAL_REPLY_ANONYMOUS_NAME } from "../config/nametag.js";

export const modalReplyAmonymous = asyncErrorHandler(async () => {
    const replyCFS = new TextInputBuilder()
        .setCustomId("reply_cfs")
        .setLabel("Nội dung trả lời ẩn danh")
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(2000)
        .setRequired(true);
    const modal = new ModalBuilder()
        .setCustomId(`${GET_MODAL_REPLY_ANONYMOUS_NAME}`)
        .setTitle("Trả lời Confession ẩn danh")
        .addComponents(
            new ActionRowBuilder().addComponents(replyCFS)
        );
    return modal;
}, null);