import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
import { EmbedBuilder } from 'discord.js';
import { hasPermission } from '../Services/roleCfs.js';
export const name = 'rejectCfs';
export const customIds = [/^reject_\d+$/];
export const execute = async (interaction) => {
  try {
    if (!hasPermission(interaction)) {
      return interaction.reply({ content: '❌Bạn không phải onwer, admin hay role được phép', ephemeral: true });
    };
    const confessionId = parseInt(interaction.customId.split('_')[1]);
    const confession = await prisma.confession_PENDING.findUnique({ where: { id: confessionId } });
    if (!confession) return interaction.reply({ content: '❌ Không tìm thấy confession.', ephemeral: true });
    await prisma.confession_REJECTED.create({
      data: {
        content: confession.content,
        userId: confession.isAnonymous ? `${confession.id}` : confession.userId,
        isAnonymous: confession.isAnonymous,
        rejectedBy: interaction.user.id,
        rejectedAt: new Date(),
      }
    });
    await prisma.confession_PENDING.delete({ where: { id: confessionId } });
    // Phản hồi lại admin
    const embeds = new EmbedBuilder().setDescription(`<@${interaction.user.id}> từ chối confession số ${confession.id}`).setColor(`#FF0000`);
    await interaction.update({ embeds: [embeds], components: [] });
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};
