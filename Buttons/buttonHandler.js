import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'confess_button';
export const customIds = ['confess_anon', 'confess_named'];
export const execute = async (interaction) => {
  try {
    const isAnonymous = interaction.customId === 'confess_anon';
    const modal = new ModalBuilder()
      .setCustomId(`modal_confess_${isAnonymous ? 'anon' : 'named'}`)
      .setTitle('📨 Gửi Confession')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('confess_content')
            .setLabel('Nhập nội dung confession')
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(4000)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal);
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};
