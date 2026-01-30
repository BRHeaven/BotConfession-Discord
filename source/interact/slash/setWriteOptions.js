import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { CONFIG_CHANNEL_FORUM, CONFIG_EDIT, CONFIG_OPTIONS, CONFIG_SET, CONFIG_SETTINGS, CONFIG_WRITE_OPTIONS, NAME_ANONYMOUS, NAME_IDENTIFY } from "../config/nametag.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { permissionAdmin } from "../config/permission.js";
import prisma from "../../utilities/prisma.js";

export const setWriteOptions = asyncErrorHandler(async (interaction) => {
    if (!await permissionAdmin(interaction)) {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':no_entry: Quyền ADMIN.',
                'Bạn không có quyền sử dụng lệnh này, lệnh chỉ dành cho ADMIN.',
                0xFF0000)],
        });
    };
    const guildId = interaction.guild.id;
    const config = await prisma.config.findFirst({
        where: {
            guild: guildId
        },
    });
    const thread = await interaction.guild.channels.fetch(config.forum);
    if (!config || config.forum === 'null') {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':warning: Chưa chọn kênh diễn đàn',
                `Vui lòng dùng lệnh \`/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_CHANNEL_FORUM}\` trước khi sử dụng lệnh này.`,
                0xFFFF00)],
            ephemeral: false,
        });
    };
    const buttonCFS = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(NAME_ANONYMOUS)
            .setLabel('Viết ẩn danh')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(NAME_IDENTIFY)
            .setLabel('Viết công khai')
            .setStyle(ButtonStyle.Primary)
    );
    await thread.threads.create({
        name: `:loudspeaker: Gửi Confession`,
        message: {
            embeds: [embedNotificationDefault(
                '✏️ **Viết Confession tại đây**',
                'Bạn có thể chia sẻ suy nghĩ, cảm xúc hoặc câu chuyện của mình một cách tự do\n' +
                '- Chọn một trong hai nút bên dưới để gửi Confession ẩn danh hoặc hiện tên người đăng\n' +
                '- Bài viết của bạn sẽ có thông báo qua tin nhắn riêng nếu được duyệt\n',
                0x00FFFF
            )],
            components: [buttonCFS],
        },
    });
    return await interaction.editReply({
        embeds: [embedNotificationDefault(
            `✅ Đã đăng bài thành công`,
            `Để sữa đổi nội dung bài viết dùng lệnh \`/${CONFIG_OPTIONS} ${CONFIG_EDIT} ${CONFIG_WRITE_OPTIONS}\` có hướng dẫn chi tiết trong lệnh đó. Nếu cần hỗ trợ liên hệ ADMIN.`,
            0x00FF00
        )],
        ephemeral: false,
    });
}, null);