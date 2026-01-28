import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_ANONYMOUS_NAME, GET_MODAL_ANONYMOUS_NAME } from "../config/nametag.js";
import { modalWriteCFS } from "../modal/modalWriteCFS.js";

export const name = GET_ANONYMOUS_NAME;
export const execute = asyncErrorHandler(async (interaction) => {
    const modal = await modalWriteCFS(GET_MODAL_ANONYMOUS_NAME);
    await interaction.showModal(modal);
}, null);