import { handleInteractionError } from "../Middlewares/errorHandler.js";

export const name = 'reply_modal';
export const customIds = ['modal_reply'];
export const execute = async (interaction) => {
  try {
    const content = interaction.fields.getTextInputValue('reply_content');
    // Lấy thread hiện tại
    const thread = interaction.channel;
    if (!thread || !thread.isThread()) {
      return await interaction.reply({ content: '❌ Không thể gửi trả lời vì bạn không ở trong một confession thread.', ephemeral: true });
    }

    await thread.send({
      content: `💬 **Trả lời ẩn danh:** ${content}`
    });

    //await interaction.reply({ content: '✅ Đã gửi trả lời ẩn danh thành công!', ephemeral: true });
  } catch (error) {
    await handleInteractionError(interaction, error);
    await interaction.reply({ content: '❌ Có lỗi xảy ra khi gửi trả lời.', ephemeral: true });
  };
};
