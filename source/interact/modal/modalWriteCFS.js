import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { HANDLE_MODAL_ANONYMOUS } from "../config/nametag.js";

export const modalWriteCFS = asyncErrorHandler(async (customId) => {
    const title = customId === HANDLE_MODAL_ANONYMOUS ? "Viết Confession Ẩn Danh" : "Viết Confession Hiện Tên";
    const titleCFS = new TextInputBuilder()
        .setCustomId("title_cfs")
        .setLabel("Tiêu đề Confession")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(150)
        .setRequired(true);
    const contentCFS = new TextInputBuilder()
        .setCustomId("content_cfs")
        .setLabel("Nội dung Confession")
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(4000)
        .setRequired(true);
    const modal = new ModalBuilder()
        .setCustomId(customId)
        .setTitle(title)
        .addComponents(
            new ActionRowBuilder().addComponents(titleCFS),
            new ActionRowBuilder().addComponents(contentCFS)
        );
    return modal;
}, null);