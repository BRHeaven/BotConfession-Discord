import { SlashCommandBuilder } from "discord.js";
import { GLOBAL, GLOBAL_ALL_LIST, GLOBAL_ANONYMOUS_REPLY, GLOBAL_CFS_ACCEPT, GLOBAL_CFS_PENDING, GLOBAL_CFS_REFUSE, GLOBAL_LIST, GLOBAL_REPLY } from "../config/nametag.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { devID } from "../config/config.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { globalController } from "./globalController.js";

export const name = GLOBAL;
export const data = new SlashCommandBuilder()
    .setName(GLOBAL)
    .setDescription('Commands for Developer only')
    .setDMPermission(true)
    .addSubcommandGroup(group =>
        group
            .setName(GLOBAL_LIST)
            .setDescription('List related commands')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_ANONYMOUS_REPLY)
                    .setDescription('Get list anonymous replies')
                    .addStringOption(option =>
                        option
                            .setName('guild_id')
                            .setDescription('ID of the guild')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option
                            .setName('channel_id')
                            .setDescription('ID of the channel')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_PENDING)
                    .setDescription('Get list pending confessions')
                    .addStringOption(option =>
                        option
                            .setName('guild_id')
                            .setDescription('ID of the guild')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_ACCEPT)
                    .setDescription('Get list accepted confessions')
                    .addStringOption(option =>
                        option
                            .setName('guild_id')
                            .setDescription('ID of the guild')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_REFUSE)
                    .setDescription('Get list refused confessions')
                    .addStringOption(option =>
                        option
                            .setName('guild_id')
                            .setDescription('ID of the guild')
                            .setRequired(true)
                    )
            )
    )
    .addSubcommandGroup(group =>
        group
            .setName(GLOBAL_ALL_LIST)
            .setDescription('Get all lists of a guild')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_ANONYMOUS_REPLY)
                    .setDescription('Get list anonymous replies')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_PENDING)
                    .setDescription('Get list pending confessions')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_ACCEPT)
                    .setDescription('Get list accepted confessions')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(GLOBAL_CFS_REFUSE)
                    .setDescription('Get list refused confessions')
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName(GLOBAL_REPLY)
            .setDescription('Reply')
            .addStringOption(option =>
                option
                    .setName('guild_id')
                    .setDescription('ID of the guild')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('channel_id')
                    .setDescription('ID of the channel')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('reply')
                    .setDescription('Content of the reply')
                    .setRequired(true)
            )
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (interaction.guild) {
        return await interaction.editReply({
            content: ``,
            embeds: [embedNotificationDefault(
                `**❌ TỪ CHỐI SỬ DỤNG LỆNH**`,
                `Lệnh này chỉ có thể sử dụng trong DM với bot.`,
                0xFF0000
            )],
        });
    };
    if (!devID.includes(interaction.user.id)) {
        return await interaction.editReply({
            content: ``,
            embeds: [embedNotificationDefault(
                `**❌ TỪ CHỐI SỬ DỤNG LỆNH**`,
                `Tất cả tương tác qua DM với bot của bạn đều bị từ chối. Lệnh chỉ dành cho nhà phát triển sử dụng.`,
                0xFF0000
            )],
        });
    };
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    await globalController(interaction, group, subcommand);
}, null);