import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'sendconfesssetup';
export const data = new SlashCommandBuilder()
  .setName('sendconfesssetup')
  .setDescription('Gửi hướng dẫn + nút gửi confession vào Forum channel đã set.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
export const execute = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guild.id;
    // Lấy thông tin Forum channel từ database
    const config = await prisma.config.findUnique({
      where: { guildId }
    });
    if (!config || !config.forumChannelId) {
      return interaction.reply({
        content: '❌ Bạn cần cấu hình Forum Channel trước bằng lệnh /setchannels.',
        ephemeral: true,
      });
    };
    //console.log(config.forumChannelId);
    const forumChannel = await interaction.guild.channels.fetch(config.forumChannelId);
    //console.log(forumChannel);
    if (!forumChannel || forumChannel.type !== 15) {
      return interaction.reply({
        content: '❌ Không tìm thấy Forum channel hợp lệ trong server.',
        ephemeral: true,
      });
    };
    // Tạo 2 nút: Gửi ẩn danh / Gửi hiện tên
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confess_anon')
        .setLabel('📩 Gửi ẩn danh')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('confess_named')
        .setLabel('🧑‍💼 Gửi hiện tên')
        .setStyle(ButtonStyle.Secondary)
    );
    await forumChannel.threads.create({
      name: 'Gửi Confession',
      message: {
        content: '📢 **Gửi Confession tại đây!**\nBài viết của bạn sẽ có thông báo qua tin nhắn riêng nếu được duyệt\nChọn 1 trong 2 cách bên dưới để gửi:',
        components: [row]
      }
    });
    await interaction.reply({
      content: '✅ Đã gửi hướng dẫn vào Forum Channel.',
      ephemeral: true,
    });
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};
