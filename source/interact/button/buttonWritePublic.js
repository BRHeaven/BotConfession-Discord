import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { HANDLE_MODAL_IDENTIFY, NAME_IDENTIFY } from "../config/nametag.js";
import { modalWriteCFS } from "../modal/modalWriteCFS.js";

export const name = NAME_IDENTIFY;
export const execute = asyncErrorHandler(async (interaction) => {
    const modal = await modalWriteCFS(HANDLE_MODAL_IDENTIFY);
    await interaction.showModal(modal);
}, null);