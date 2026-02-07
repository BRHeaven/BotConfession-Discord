import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedAllListAmonymousReply } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";
import { buttonsAnonymousPrevNext } from "../../button/buttons.js";

export const name = /^anonymous_(next|prev)_\d+$/;
export const execute = asyncErrorHandler(async (interaction) => {
    const [prefix, _action, pageStr] = interaction.customId.split('_');
    const page = parseInt(pageStr, 10);
    const user = 5;
    const totalCount = await prisma.anonymous_reply.count({});
    const totalPages = Math.ceil(totalCount / user);
    const list = await prisma.anonymous_reply.findMany({
        take: user,
        skip: (page - 1) * user,
    });
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
    await interaction.update({
        flag : true,
        embeds: [embedAllListAmonymousReply(array, totalCount, 0xffb27e)],
        components: [buttonsAnonymousPrevNext(page, totalPages, prefix)],
    });
}, null);