import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
import { postApprovedConfessionToForum } from '../Services/serviceCfs.js';
import { EmbedBuilder } from 'discord.js';
import { hasPermission } from '../Services/roleCfs.js';
import { numberACfs } from '../Utils/fixApproveCfs.js';
export const name = 'approveCfs';
export const customIds = [/^approve_\d+$/];
export const execute = async (interaction) => {
  try {
    if (!hasPermission(interaction)) {
      return interaction.reply({ content: '❌Bạn không phải onwer, admin hay role được phép', ephemeral: true });
    };
    const confessionId = parseInt(interaction.customId.split('_')[1]);
    const confession = await prisma.confession_PENDING.findUnique({ where: { id: confessionId } });
    if (!confession) {
      return interaction.reply({ content: '❌ Không tìm thấy confession.', ephemeral: true });
    }
    // Gửi DM trước khi thay đổi userId nếu có thể
    const user = await interaction.client.users.fetch(confession.userId).catch(() => null);
    if (user) {
      const embed = new EmbedBuilder()
        .setTitle('✅ Confession của bạn đã được duyệt!')
        .setDescription(confession.content)
        .setColor('#00b894')
        .setTimestamp();
      await user.send({ embeds: [embed] }).catch(() => null);
    };
    // Tạo bản ghi APPROVED
    const approved = await prisma.confession_APPROVED.create({
      data: {
        content: confession.content,
        userId: confession.isAnonymous ? `${confession.id}` : confession.userId,
        isAnonymous: confession.isAnonymous,
        approvedBy: interaction.user.id,
        approvedAt: new Date(),
      }
    });
    // Xoá bản ghi chờ duyệt
    await prisma.confession_PENDING.delete({ where: { id: confessionId } });
    // Đăng lên forum
    await postApprovedConfessionToForum(interaction.client, interaction.guildId, approved);
    // Phản hồi lại admin
    const embeds = new EmbedBuilder().setDescription(`✅ <@${interaction.user.id}> đã duyệt confession #${numberACfs + approved.id}`).setColor(`#19F400`);
    await interaction.update({ components: [], embeds: [embeds] });
    //console.log('[Debug] Approved:', approved);
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
};