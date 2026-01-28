import { SlashCommandBuilder } from 'discord.js';
import { sendAllPendingConfessions } from '../Services/serviceCfs.js';
import { hasPermission } from '../Services/roleCfs.js';
export const name = 'send_pending_confessions';
export const data = new SlashCommandBuilder()
  .setName('send_pending_confessions')
  .setDescription('Gửi lại tất cả confession đang chờ duyệt');
export const execute = async (interaction) => {
  // Chỉ cho phép Admin (hoặc bạn có thể kiểm tra bằng role ID)
    if (!hasPermission(interaction)) {
      return interaction.reply({ content: '❌Bạn không phải onwer, admin hay role được phép', ephemeral: true });
    };
  await interaction.deferReply({ ephemeral: true });
  await sendAllPendingConfessions(interaction.client);
  await interaction.editReply('✅ Đã gửi lại toàn bộ confession đang chờ duyệt.');
};