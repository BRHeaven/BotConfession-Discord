import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedListCFS, embedListALLCFS } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";
import { buttonsDetail, buttonsPagination } from "../../button/buttons.js";

export const name = /^(pending|accept|refuse)_(\d+|all)_(next|prev)_\d+$/;
export const execute = asyncErrorHandler(async (interaction) => {
    const [prefix, guildId, action, pageStr] = interaction.customId.split('_');
    const page = parseInt(pageStr, 10);
    const confessions = 5;
    let nameList = '';
    let model;

    switch (prefix) {
        case 'pending':
            nameList = 'PENDING';
            model = prisma.cfs_pending;
            break;
        case 'accept':
            nameList = 'ACCEPTED';
            model = prisma.cfs_accept;
            break;
        case 'refuse':
            nameList = 'REFUSED';
            model = prisma.cfs_refuse;
            break;
    };

    const where = guildId === 'all' ? {} : { guild: guildId };
    const totalCount = await model.count({ where });
    const totalPages = Math.ceil(totalCount / confessions);
    const list = await model.findMany({
        where,
        take: confessions,
        skip: (page - 1) * confessions,
    });
    let array = [];
    if (guildId === 'all') {
        for (const confession of list) {
            const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
            const guild = await interaction.client.guilds.fetch(confession.guild);
            array.push({
                guild: { id: confession.guild, name: guild?.name ?? 'Unknown Guild' },
                user: confession.anonymous ? `||<@${confession.userId}>||` : `<@${confession.userId}>`,
                title: confession.title,
                status: confession.status,
                time: `<t:${timestamp}:F>`,
            });
        };

        await interaction.update({
            embeds: [embedListALLCFS(array, nameList, totalCount, 0xffb27e)],
            components: [
                buttonsPagination(page, totalPages, `${prefix}_all`),
                buttonsDetail(list, prefix, 'list')
            ],
        });
        return;
    }

    for (const confession of list) {
        const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
        array.push({
            user: confession.anonymous ? `||<@${confession.userId}>||` : `<@${confession.userId}>`,
            title: confession.title,
            status: confession.status,
            time: `<t:${timestamp}:F>`,
        });
    };
    const guild = await interaction.client.guilds.fetch(guildId);
    await interaction.update({
        embeds: [embedListCFS(guild, array, nameList, totalCount, 0xffb27e)],
        components: [
            buttonsPagination(page, totalPages, `${prefix}_${guildId}`),
            buttonsDetail(list, prefix, guildId)
        ],
    });
}, null);