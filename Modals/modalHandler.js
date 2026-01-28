import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const name = 'confess_modal';
export const customIds = ['modal_confess_anon', 'modal_confess_named'];
export const execute = async (interaction) => {
  try {
    const isAnonymous = interaction.customId === 'modal_confess_anon';
    const userId = interaction.user.id;
    const content = interaction.fields.getTextInputValue('confess_content');
    const createdAt = dayjs().add(7, 'hour').toDate();
    const confession = await prisma.confession_PENDING.create({
      data: {
        content,
        userId,
        isAnonymous: isAnonymous,
        createdAt
      }
    });
    await interaction.reply({
      content: `✅ Confession số ${confession.id} đã gửi! Chờ admin duyệt nhé.`,
      ephemeral: true,
    });
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
};

