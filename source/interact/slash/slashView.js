import { SlashCommandBuilder } from "discord.js";
import { COMMAND_INSTRUCTIONS, CONFIG_GUILD, CONFIG_VIEW } from "../config/nametag.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { viewGuild } from "./viewGuild.js";
import { viewCommands } from "./viewCommands.js";

export const name = CONFIG_VIEW;
export const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Xem cấu hình của Bot trong server hiện tại')
    .addSubcommand(subcommand =>
        subcommand
            .setName(CONFIG_GUILD)
            .setDescription('Xem cấu hình server hiện tại')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName(COMMAND_INSTRUCTIONS)
            .setDescription('Xem hướng dẫn sử dụng các lệnh của Bot')
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case CONFIG_GUILD:
            return await viewGuild(interaction);
        case COMMAND_INSTRUCTIONS:
            return await viewCommands(interaction);
    };
}, null);