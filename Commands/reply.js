import { SlashCommandBuilder } from 'discord.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'reply';
export const data = new SlashCommandBuilder()
  .setName('reply')
  .setDescription('Trả lời ẩn danh ngay trong confession này')
  .addStringOption(option =>
    option.setName('nội_dung')
      .setDescription('Nội dung bạn muốn gửi ẩn danh')
      .setRequired(true)
  );
export const execute = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const replyContent = interaction.options.getString('nội_dung');
    // Kiểm tra xem đang trong thread không
    if (!interaction.channel.isThread()) {
      return await interaction.reply({
        content: '❌ Bạn chỉ có thể dùng lệnh /reply trong một Confession thread.',
        ephemeral: true
      });
    };
    // Gửi reply ẩn danh trong thread hiện tại
    await interaction.channel.send(`:speech_balloon: **Trả lời ẩn danh:**  ${replyContent}`);
    // Phản hồi ephemeral để xác nhận với người dùng
    await interaction.reply({
      content: '✅ Đã gửi phản hồi ẩn danh!',
      ephemeral: true
    });
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
};