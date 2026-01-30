import { SlashCommandBuilder } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { CONFIG_CHANNEL_FORUM, CONFIG_CHANNEL_TEXT, CONFIG_ROLE, CONFIG_SET, CONFIG_SETTINGS, CONFIG_UNSET } from "../config/nametag.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { permissionAdmin } from "../config/permission.js";
import { setRole } from "./setRoleApproval.js";
import { setChannelText } from "./setChannelText.js";
import { setChannelForum } from "./setChannelForum.js";
import { unsetRole } from "./unsetRoleApproval.js";
import { unsetChannelText } from "./unsetChannelText.js";
import { unsetChannelForum } from "./unsetChannelForum.js";

export const name = CONFIG_SETTINGS;
export const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Cài đặt bot cho server của bạn')
    .addSubcommandGroup(group =>
        group
            .setName(CONFIG_SET)
            .setDescription('Chọn cài đặt cho bot')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_ROLE)
                    .setDescription('Chọn vai trò được tương tác với Confession ( Cần quyền ADMIN )')
                    .addRoleOption(option => option
                        .setName(`role`)
                        .setDescription('Vai trò được tương tác với Confession')
                        .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_CHANNEL_TEXT)
                    .setDescription('Chọn kênh quản lý Confession ( Cần quyền ADMIN )')
                    .addChannelOption(option => option
                        .setName(`channel_text`)
                        .setDescription('Kênh quản lý Confession')
                        .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_CHANNEL_FORUM)
                    .setDescription('Chọn kênh viết và đăng Confession ( Cần quyền ADMIN )')
                    .addChannelOption(option => option
                        .setName(`channel_forum`)
                        .setDescription('Kênh viết và đăng Confession')
                        .setRequired(true)
                    )
            )
    )
    .addSubcommandGroup(group =>
        group
            .setName(CONFIG_UNSET)
            .setDescription('Hủy cài đặt cho bot')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_ROLE)
                    .setDescription('Hủy vai trò được tương tác với Confession ( Cần quyền ADMIN )')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_CHANNEL_TEXT)
                    .setDescription('Hủy kênh quản lý Confession ( Cần quyền ADMIN )')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_CHANNEL_FORUM)
                    .setDescription('Hủy kênh viết và đăng Confession ( Cần quyền ADMIN )')
            )
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await permissionAdmin(interaction)) {
        return interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền ADMIN',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000
            )]
        });
    };
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    switch (group) {
        case CONFIG_SET:
            switch (subcommand) {
                case CONFIG_ROLE: 
                    return await setRole(interaction);
                case CONFIG_CHANNEL_TEXT: 
                    return await setChannelText(interaction);
                case CONFIG_CHANNEL_FORUM: 
                    return await setChannelForum(interaction);
            };
            break;
        case CONFIG_UNSET:
            switch (subcommand) {
                case CONFIG_ROLE: 
                    return await unsetRole(interaction);
                case CONFIG_CHANNEL_TEXT: 
                    return await unsetChannelText(interaction);
                case CONFIG_CHANNEL_FORUM: 
                    return await unsetChannelForum(interaction);
            }
            break;
    };
}, null);