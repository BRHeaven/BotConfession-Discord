import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedDetailCFS } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";

export const name = /^detail_(pending|accept|refuse)_(\d+|list)_\d+$/;
export const execute = asyncErrorHandler(async (interaction) => {
    const [_, prefix, guildId, confesstionId] = interaction.customId.split('_');
    let confession;
    switch (prefix) {
        case 'pending':
            confession = await prisma.cfs_pending.findFirst({
                where: { id: parseInt(confesstionId) }
            });
            break;
        case 'accept':
            confession = await prisma.cfs_accept.findFirst({
                where: { id: parseInt(confesstionId) }
            });
            break;
        case 'refuse':
            confession = await prisma.cfs_refuse.findFirst({
                where: { id: parseInt(confesstionId) }
            });
            break;
    };
    const resolvedGuildId = guildId === 'list' ? confession.guild : guildId;
    const nameGuild = (await interaction.client.guilds.fetch(resolvedGuildId)).name;
    await interaction.reply({
        embeds: [embedDetailCFS(
            nameGuild,
            resolvedGuildId,
            confession,
            0xffb27e,
        )]
    });
}, null);