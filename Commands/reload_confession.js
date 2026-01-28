// Commands/Slash/reloadConfession.js
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import prisma from '../Utils/prisma.js';
export const name = 'reload_confession';
export const data = new SlashCommandBuilder()
    .setName('reload_confession')
    .setDescription('Đăng lại một confession đã được duyệt lên forum.')
    .addIntegerOption(option =>
        option.setName('id')
            .setDescription('ID của confession đã duyệt')
            .setRequired(true)
    );
export const execute = async (interaction) => {
    const id = interaction.options.getInteger('id');
    try {
        await interaction.deferReply({ ephemeral: true });
        // 1. Lấy confession từ DB
        const confession = await prisma.confession_APPROVED.findUnique({
            where: { id }
        });
        if (!confession) {
            return interaction.reply({ content: '❌ Không tìm thấy confession với ID đó.', ephemeral: true });
        }
        // 2. Lấy config của guild
        const config = await prisma.config.findUnique( {
            where: { guildId: interaction.guildId }
        });
        console.log(config + ` Test : 1805`);
        if (!config || !config.forumChannelId) {
            return interaction.reply({ content: '❌ Chưa cấu hình forum channel cho server này.', ephemeral: true });
        }
        const forumChannel = await interaction.client.channels.fetch(config.forumChannelId);
        if (!forumChannel || !forumChannel.threads) {
            return interaction.reply({ content: '❌ Không tìm được forum channel.', ephemeral: true });
        }
        // 3. Tạo nội dung đầy đủ
        let fullContent = confession.content;
        if (!confession.isAnonymous) {
            const user = await interaction.client.users.fetch(confession.userId).catch(() => null);
            if (user) {
                const displayName = user.globalName || user.username;
                fullContent = `*(Người viết: ${displayName})*\n\n${confession.content}`;
            }
        }
        // 4. Tạo embed và post lại
        const count = await prisma.confession_APPROVED.count();
        const displayIndex = count;
        const embed = new EmbedBuilder()
            .setTitle(`Confession #${displayIndex}`)
            .setDescription(fullContent.slice(0, 4096))
            .setColor('#4287f5')
            .setFooter({ text: `Approved by ${confession.approvedBy}` })
            .setTimestamp(new Date(confession.approvedAt));
        const thread = await forumChannel.threads.create({
            name: `Confession #${confession.id}`,
            message: {
                embeds: [embed]
            }
        });
        // 5. Gửi hướng dẫn reply
        await thread.send({
            content: '📢 Bạn có thể trả lời ẩn danh bằng cách dùng lệnh `/reply` hoặc bấm nút "Reply".',
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`reply_${confession.id}`)
                        .setLabel('Reply')
                        .setStyle(ButtonStyle.Primary)
                )
            ]
        });
        await interaction.reply({ content: `✅ Đã đăng lại Confession #${confession.id}`, ephemeral: true });
    } catch (error) {
        console.error('[ERROR] Reload confession:', error);
        await interaction.reply({ content: '❌ Có lỗi xảy ra khi đăng lại.', ephemeral: true });
    };
};