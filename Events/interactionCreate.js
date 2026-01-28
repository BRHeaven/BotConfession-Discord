import { handleInteractionError } from '../Middlewares/errorHandler.js';

export const name = "interactionCreate";
export const execute = async (interaction, client) => {
  try {
    // Slash Command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
    } else if (interaction.isButton()) {
      //console.log('[DEBUG] Button Name', interaction.customId);
      // Tìm handler có customIds khớp
      const button = [...client.buttons.values()].find(btn => {
        if (Array.isArray(btn.customIds)) {
          return btn.customIds.some(pattern =>
            typeof pattern === 'string'
              ? pattern === interaction.customId
              : pattern instanceof RegExp && pattern.test(interaction.customId)
          );
        }
        return false;
      });

      if (!button) return;
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await handleInteractionError(interaction, error);
      }
      //console.warn('[⚠️] Không tìm thấy handler cho button:', interaction.customId);
    } else if (interaction.isModalSubmit()) {
      //console.log('[DEBUG] Create ID:', interaction.customId);
      const modal = [...client.modals.values()].find(m =>
        m.customIds?.includes(interaction.customId)
      );
      if (!modal) {
        console.warn('[⚠️] Không tìm thấy modal:', interaction.customId);
        return;
      };
      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(`[❌] Lỗi khi xử lý modal: ${error.message}`);
        if (!interaction.replied) {
          await interaction.reply({ content: '❌ Lỗi xử lý modal.', ephemeral: true });
        };
      };
    };
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};
