import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { embedHelp } from "../../utilities/embed.js";

export const viewCommands = asyncErrorHandler(async (interaction) => {
    return await interaction.editReply({
        embeds: [embedHelp(0x00ffff)],
    });
}, null);