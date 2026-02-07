import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedListALLCFS } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";
import { truncate } from "../../../utilities/truncate.js";
import { buttonsDetail, buttonsPagination } from "../../button/buttons.js";

export const listALLCFS = asyncErrorHandler(async (interaction, tag) => {
    let model = null;
    switch (tag) {
        case 'accept':
            model = prisma.cfs_accept;
            break;
        case 'refuse':
            model = prisma.cfs_refuse;
            break;
        case 'pending':
            model = prisma.cfs_pending;
            break;
    };
    if (!model) {
        return {
            flag: false,
            title: "Invalid Tag",
            description: "Tag không hợp lệ.",
            color: 0xFF0000
        };
    }
    const list = await model.findMany();
    if (list === null || list.length === 0) {
        return {
            flag: true,
            title: "List Pending Confessions",
            description: `No list confessions in the global.`,
            color: 0xffb27e
        };
    } else {
        if (list.length > 5) {
            const confessions = 5;
            const totalPages = Math.ceil(list.length / confessions);
            let array = [];
            const listAll = await model.findMany({
                take: confessions,
                skip: 0,
            });
            for (const confession of listAll) {
                const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
                const guildId = await interaction.client.guilds.fetch(confession.guild);
                const guildName = guildId ? guildId.name : 'Unknown Guild';
                array.push({
                    guild: { id: confession.guild, name: guildName },
                    user: confession.anonymous ? `||<@${confession.userId}>||` : `<@${confession.userId}>`,
                    title: truncate(confession.title, 20),
                    status: confession.status,
                    time: `<t:${timestamp}:F>`,
                });
            };
            return {
                flag: true,
                embed: embedListALLCFS(array, tag, list.length, 0xffb27e),
                buttons: [
                    buttonsPagination(1, totalPages, `${tag}_all`),
                    buttonsDetail(list, tag, `list`)
                ],
            };
        } else {
            let array = [];
            for (const confession of list) {
                const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
                const guildId = await interaction.client.guilds.fetch(confession.guild);
                const guildName = guildId ? guildId.name : 'Unknown Guild';
                array.push({
                    guild: { id: confession.guild, name: guildName },
                    user: confession.anonymous ? `||<@${confession.userId}>||` : `<@${confession.userId}>`,
                    title: truncate(confession.title, 20),
                    status: confession.status,
                    time: `<t:${timestamp}:F>`,
                });
            };
            return {
                flag: true,
                embed: embedListALLCFS(array, tag, list.length, 0xffb27e),
                buttons: buttonsDetail(list, tag, `list`),
            };
        };
    };
}, null);