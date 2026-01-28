import { SlashCommandBuilder, ChannelType } from 'discord.js';
import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'setchannels';
export const data = new SlashCommandBuilder()
    .setName('setchannels')
    .setDescription('Chọn kênh duyệt và forum để đăng confession')
    .addChannelOption(option =>
        option.setName('approval_channel')
            .setDescription('Kênh text để duyệt confession')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
    .addChannelOption(option =>
        option.setName('forum_channel')
            .setDescription('Kênh forum để đăng confession đã duyệt')
            .addChannelTypes(ChannelType.GuildForum)
            .setRequired(true));
export const execute = async (interaction) => {
    try {
        // Check quyền Admin hoặc Owner
        if (!interaction.member.permissions.has('Administrator') && interaction.user.id !== interaction.guild.ownerId) {
            return await interaction.reply({ content: '❌ Bạn cần quyền ADMINISTRATOR hoặc là OWNER server để dùng lệnh này.', ephemeral: true });
        };
        const guildId = interaction.guildId;
        let config = await prisma.config.findUnique({
            where: { guildId },
        });
        if (!interaction.inGuild()) {
            return interaction.reply({ content: '❌ Lệnh này chỉ dùng trong server', flags: 64 });
        }
        await interaction.deferReply({ ephemeral: true });
        if (!config) {
            const approvalChannel = interaction.options.getChannel('approval_channel');
            const forumChannel = interaction.options.getChannel('forum_channel');
            if (!approvalChannel || !forumChannel) {
                return interaction.editReply('❌ Bạn phải chọn đủ 2 kênh.');
            }
            await prisma.config.create({
                data: {
                    guildId,
                    approvalChannelId: approvalChannel.id,
                    forumChannelId: forumChannel.id,
                },
            });
            return await interaction.editReply(
                '✅ Đã tạo cấu hình server và set kênh thành công'
            );
        }
        if (!config.approvalChannelId || !config.forumChannelId) {
            const approvalChannel = interaction.options.getChannel('text_channel', true);
            const forumChannel = interaction.options.getChannel('forum_channel', true);
            await prisma.config.update({
                where: { guildId },
                data: {
                    approvalChannelId: approvalChannel.id,
                    forumChannelId: forumChannel.id,
                },
            });
            return await interaction.editReply(
                '✅ Đã hoàn tất cấu hình kênh cho server'
            );
        }
        return await interaction.editReply(
            '❌ Server đã có đầy đủ kênh duyệt và forum. Dùng /unsetchannel để thay đổi.'
        );

    } catch (error) {
        await handleInteractionError(interaction, error);
    }
};
