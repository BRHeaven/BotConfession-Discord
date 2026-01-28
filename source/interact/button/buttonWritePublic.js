import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_IDENTIFY_NAME, GET_MODAL_IDENTIFY_NAME } from "../config/nametag.js";
import { modalWriteCFS } from "../modal/modalWriteCFS.js";

export const name = GET_IDENTIFY_NAME;
export const execute = asyncErrorHandler(async (interaction) => {
    const modal = await modalWriteCFS(GET_MODAL_IDENTIFY_NAME);
    await interaction.showModal(modal);
}, null);