import { SlashCommandBuilder } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { SHOW_CONFIG_GUILD } from "../config/nametag.js";
import { hasPermission } from "../config/permission.js";
import { embedConfigGuild, embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = SHOW_CONFIG_GUILD;
export const data = new SlashCommandBuilder()
    .setName(SHOW_CONFIG_GUILD)
    .setDescription('Xem thông tin cấu hình của server hiện tại');
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    if (!await hasPermission(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Không đủ quyền',
                'Bạn chưa được chọn để duyệt bài. Liên hệ ADMIN để được cấp quyền.',
                0xFF0000
            )],
        });
    };
    const config = await prisma.config.findFirst({
        where: {
            guild: interaction.guild.id
        },
    });
    const roles = await prisma.role.findMany({
        where: {
            guild: config.guild
        },
    });
    return await interaction.editReply({
        embeds: [embedConfigGuild(
            config,
            roles
        )],
    });
}, null);