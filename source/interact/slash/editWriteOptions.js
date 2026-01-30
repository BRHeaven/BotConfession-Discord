import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { NAME_ANONYMOUS, NAME_IDENTIFY } from "../config/nametag.js";
import { devID } from "../config/config.js";

export const editWriteOptions = asyncErrorHandler(async (interaction) => {
    if (!devID.includes(interaction.user.id)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền DEVELOPER',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho DEVELOPER.',
                0xFF0000)]
        });
    };
    const inputContent = interaction.options.getBoolean('input_content') || false;
    const newTitle = interaction.options.getString('new_title') || null;
    const newContent = interaction.options.getString('new_content') || null;
    const channelId = interaction.options.getString('channel_id') || interaction.channelId;
    const messageId = interaction.options.getString('message_id');
    const channel = channelId ? await interaction.client.channels.fetch(channelId) : interaction.channel;
    if (!channel) {
        return interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Kênh không hợp lệ',
                'Kênh bạn cung cấp không tồn tại hoặc bot không có quyền truy cập.',
                0xFF0000
            )]
        });
    };
    const message = await channel.messages.fetch(messageId);
    if (message.author.id !== interaction.client.user.id) {
        return interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Tin nhắn không hợp lệ',
                'Tin nhắn bạn cung cấp không phải tin nhắn của bot.',
                0xFF0000
            )]
        });
    };
    const buttonPostCFS = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(NAME_ANONYMOUS)
            .setLabel('Gửi ẩn danh')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(NAME_IDENTIFY)
            .setLabel('Gửi công khai')
            .setStyle(ButtonStyle.Primary),
    );
    if (inputContent) {
        await message.edit({
            embeds: [embedNotificationDefault(
                `✏️ **${newTitle}**`,
                `${newContent}`,
                0x0055ff
            )],
            components: [buttonPostCFS]
        });
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                '✅ Chỉnh sửa thành công',
                'Tin nhắn đã được chỉnh sửa thành công',
                0x00FF00
            )]
        });
    } else {
        await message.edit({
            content: ``,
            embeds: [embedNotificationDefault(
                '✏️ **Viết Confession tại đây**',
                'Bạn có thể chia sẻ suy nghĩ, cảm xúc hoặc câu chuyện của mình một cách tự do\n' +
                '- Chọn một trong hai nút bên dưới để gửi Confession ẩn danh hoặc hiện tên người đăng\n' +
                '- Bài viết của bạn sẽ có thông báo qua tin nhắn riêng nếu được duyệt\n'
                , 0x0055ff
            )],
            components: [buttonPostCFS]
        });
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                '✅ Chỉnh sửa thành công',
                'Tin nhắn đã được chỉnh sửa thành công',
                0x00FF00
            )]
        });
    };
}, null);