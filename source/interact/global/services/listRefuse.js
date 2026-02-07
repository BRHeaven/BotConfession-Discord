import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedListCFS } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";
import { truncate } from "../../../utilities/truncate.js";
import { buttonsDetail, buttonsPagination } from "../../button/buttons.js";

export const listRefuse = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.options.getString('guild_id');
    let guild = { id: guildId, name: '' };
    try {
        guild.name = (await interaction.client.guilds.fetch(guildId)).name;
    } catch (error) {
        return {
            flag: false,
            title: "Does not exist.",
            description: "Cannot find the server. Please check the IDs...",
            color: 0xFF0000
        };
    };
    const list = await prisma.cfs_refuse.findMany({
        where: {
            guild: guildId,
        },
    });
    if (list === null || list.length === 0) {
        return {
            flag: true,
            title: "List Refused Confessions",
            description: `No refused confessions in the server right now.`,
            color: 0xffb27e
        };
    } else {
        let array = [];
        if (list.length > 5) {
            const confessions = 5;
            const totalPages = Math.ceil(list.length / confessions);
            const listRefuse = await prisma.cfs_refuse.findMany({
                where: {
                    guild: guildId,
                },
                take: confessions,
                skip: 0,
            });
            for (const confession of listRefuse) {
                const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
                array.push({
                    user: confession.anonymous ? `||${confession.userId}||` : `<@${confession.userId}>`,
                    title: truncate(confession.title, 20),
                    status: confession.status,
                    time: `<t:${timestamp}:F>`,
                });
            };
            return {
                flag: true,
                embed: embedListCFS(guild, array, `REFUSED`, list.length, 0xffb27e),
                buttons: [
                    buttonsPagination(1, totalPages, `refuse_${guildId}`),
                    buttonsDetail(list, `refuse`, guildId)
                ],
            };
        } else {
            for (const confession of list) {
                const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
                array.push({
                    user: confession.anonymous ? `||${confession.userId}||` : `<@${confession.userId}>`,
                    title: truncate(confession.title, 20),
                    status: confession.status,
                    time: `<t:${timestamp}:F>`,
                });
            };
            return {
                flag: true,
                embed: embedListCFS(guild, array, `REFUSED`, list.length, 0xffb27e),
                buttons: null,
            };
        };
    };
}, null);