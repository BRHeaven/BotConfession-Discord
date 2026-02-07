import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedListAmonymousReply } from "../../../utilities/embed.js";
import prisma from "../../../utilities/prisma.js";

export const listAnonymousReplyService = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.options.getString('guild_id');
    const channelId = interaction.options.getString('channel_id');
    if (guildId === null || channelId === null) {
        return { 
            flag: false, 
            title: "Does not exist.", 
            description: "Cannot find the server or channel. Please check the IDs.",
            color: 0xFF0000
        };
    };
    let guild = { id : guildId, name: '' },
        channel ={ id : channelId, name: '' };
    try {
        guild.name = (await interaction.client.guilds.fetch(guildId)).name;
        channel.name = (await interaction.client.guilds.fetch(guildId)).channels.cache.get(channelId).name;
    } catch (error) {
        return { 
            flag: false, 
            title: "Does not exist.", 
            description: "Cannot find the server or channel. Please check the IDs...",
            color: 0xFF0000
        };
    };
    const list = await prisma.anonymous_reply.findFirst({
        where: {
            guild: guildId,
            thread: channelId,
        },
    });
    
    if (list === null || list.length === 0) {
        return { 
            flag: true, 
            title: "List Anonymous", 
            description: `No one is using the bot on this channel right now.`,
            color: 0xffb27e
        };
    } else {
        let listAnonymous = {
            length:0,
            userID: ``,
        };
        for (const item of list.listUserID) {
            listAnonymous.length += 1;
            listAnonymous.userID += `${listAnonymous.length}.<@${item}> (${item})\n`;
        };
        return { 
            flag: true, 
            embed : embedListAmonymousReply(guild, channel, listAnonymous, 0xffb27e),
            buttons: null,
        };
    };
}, null);