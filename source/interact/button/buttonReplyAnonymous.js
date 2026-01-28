import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_BUTTON_REPLY } from "../config/nametag.js";
import { modalReplyAmonymous } from "../modal/modalReplyAmonymous.js";

export const name = GET_BUTTON_REPLY;
export const execute = asyncErrorHandler(async (interaction) => {
    const modal = await modalReplyAmonymous();
    await interaction.showModal(modal);
}, null);