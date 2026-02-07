import { asyncErrorHandler } from "../../../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../../../utilities/embed.js";

export const globalReply = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.options.getString('guild_id');
    const channelId = interaction.options.getString('channel_id');
    const replyContent = interaction.options.getString('reply');
    if (guildId === null || channelId === null) {
        return {
            flag: false,
            title: "Invalid Input.",
            description: "Guild ID, Channel ID, and Reply content are required.",
            color: 0xFF0000
        };
    };
    const targetGuild = await interaction.client.guilds.fetch(guildId);
    const targetChannel = await targetGuild.channels.fetch(channelId);
    if (!targetChannel || !targetChannel.isTextBased()) {
        return {
            flag: false,
            title: "Invalid Channel.",
            description: "Channel không phải text channel hoặc không tồn tại.",
            color: 0xFF0000
        };
    }
    let guild = { id: guildId, name: '' },
        channel = { id: channelId, name: '' };
    try {
        guild.name = (await interaction.client.guilds.fetch(guildId)).name;
        channel.name = (await interaction.client.guilds.fetch(guildId)).channels.cache.get(channelId).name;
    } catch (error) {
        return {
            flag: false,
            title: "Does not exist.",
            description: "Cannot find the server or channel. Please check the IDs.",
            color: 0xFF0000
        };
    };
    await targetChannel.send({ content: replyContent });
    return {
        flag: true,
        embed: embedNotificationDefault(
            "Reply Sent.",
            `Your reply has been sent to **${channel.name}** in **${guild.name}**.`,
            0x00FF00
        ),
        buttons: null,
    };
}, null);