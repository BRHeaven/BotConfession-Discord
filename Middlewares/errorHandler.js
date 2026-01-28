import { logError } from '../Utils/logger.js';

export const handleInteractionError = async (interaction, error) => {
  try {
    logError(`Lỗi khi xử lý tương tác: ${error.message}`);
    console.error(error); // In full stack trace
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Bot gặp lỗi khi xử lý! Đây là phiên bản cũ nên còn nhiều lỗi, tụi mình đang phát triển phiên bản mới hơn mong bạn thông cảm cho. Mọi thông tin hoặc báo cáo lỗi để tụi mình khắc phục trong tương lai, liên hệ <@459723905284833281>",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ Bot gặp lỗi khi xử lý! Đây là phiên bản cũ nên còn nhiều lỗi, tụi mình đang phát triển phiên bản mới hơn mong bạn thông cảm cho. Mọi thông tin hoặc báo cáo lỗi để tụi mình khắc phục trong tương lai, liên hệ <@459723905284833281>",
        ephemeral: true,
      });
    };
  } catch (error) {
    return console.error(interaction, error);
  }
};