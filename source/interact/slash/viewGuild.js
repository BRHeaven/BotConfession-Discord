import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { hasPermission } from "../config/permission.js";
import { embedConfigGuild, embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";
import { getVietnamTime } from "../../utilities/timezone.js";

export const viewGuild = asyncErrorHandler(async (interaction) => {
    const config = await prisma.config.findFirst({
        where: {
            guild: interaction.guild.id
        },
    });
    if (!config) {
        await prisma.config.create({
            data: {
                guild: interaction.guild.id,
                channel: 'null',
                forum: 'null',
                savepoint: 0,
                time: getVietnamTime(),
            },
        });
    };
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