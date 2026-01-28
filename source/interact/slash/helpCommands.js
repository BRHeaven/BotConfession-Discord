import { SlashCommandBuilder } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { HELP_COMMAND } from "../config/nametag.js";
import { embedHelp } from "../../utilities/embed.js";

export const name = HELP_COMMAND;
export const data = new SlashCommandBuilder()
    .setName(HELP_COMMAND)
    .setDescription('Xem các lệnh của Bot');
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    return await interaction.editReply({
        embeds: [embedHelp(0x00ffff)],
    });
}, null);