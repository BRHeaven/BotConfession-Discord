import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedAllListAmonymousReply } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";
import { buttonsAnonymousPrevNext } from "../../button/buttons.js";

export const allAnonymousReply = asyncErrorHandler(async (interaction) => {
    const list = await prisma.anonymous_reply.findMany({});
    if (list === null || list.length === 0) {
        return {
            flag: true,
            title: "List Anonymous",
            description: `No one is using the bot on any channel right now.`,
            color: 0xffb27e,
        };
    };
    if (list.length > 5) {
        const anonymous = 5;
        const totalPages = Math.ceil(list.length / anonymous);
        let array = [];
        const listAll = await prisma.anonymous_reply.findMany({
            take: anonymous,
            skip: 0,
        });
        for (const object of listAll) {
            let guild = { id: object.guild, name: '' }
            let channel = { id: object.thread, name: '' };
            try {
                guild.name = (await interaction.client.guilds.fetch(object.guild)).name;
                channel.name = (await interaction.client.guilds.fetch(object.guild)).channels.cache.get(object.thread).name;
            } catch (error) {
                guild.name = 'Unknown Guild';
                channel.name = 'Unknown Channel';
            };
            const user = {
                guild: guild,
                channel: channel,
                list: object.listUserID,
                quantity: list.length,
            };
            array.push(user);
        };
        return {
            flag: true,
            embed: embedAllListAmonymousReply(array, list.length,0xffb27e),
            buttons: buttonsAnonymousPrevNext(1, totalPages, 'anonymous'),
        };
    } else {
        let array = [];
        for (const object of list) {
            let guild = { id: object.guild, name: '' }
            let channel = { id: object.thread, name: '' };
            try {
                guild.name = (await interaction.client.guilds.fetch(object.guild)).name;
                channel.name = (await interaction.client.guilds.fetch(object.guild)).channels.cache.get(object.thread).name;
            } catch (error) {
                guild.name = 'Unknown Guild';
                channel.name = 'Unknown Channel';
            };
            const user = {
                guild: guild,
                channel: channel,
                list: object.listUserID,
            };
            array.push(user);
        };
        return {
            flag: true,
            embed: embedAllListAmonymousReply(array, list.length, 0xffb27e),
            buttons: null,
        };
    };
}, null);