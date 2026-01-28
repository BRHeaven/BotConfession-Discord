import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'reply_button';
export const customIds = [/^reply_\d+$/];  // hoặc ['reply'] nếu bạn không truyền id
export const execute = async (interaction) => {
  try {
    const modal = new ModalBuilder()
      .setCustomId(`modal_reply`)
      .setTitle('💬 Trả lời ẩn danh')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('reply_content')
            .setLabel('Nội dung trả lời của bạn')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(4000)
        )
      );
    await interaction.showModal(modal);
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};