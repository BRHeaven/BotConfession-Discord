import { Events } from 'discord.js';
import { logInfo, logWarn, logError } from '../middlewares/logger.js';

export const name = Events.InteractionCreate;
export const once = false;
export const execute = async (interaction) => {
    const client = interaction.client;

    if (interaction.isChatInputCommand()) {
        const command = client.slash.get(interaction.commandName);
        if (!command) {
            logWarn(`❌ Không tìm thấy slash command: ${interaction.commandName}`);
            return await interaction.reply({
                content: '⚠️ Lệnh này không tồn tại hoặc chưa được đăng ký!',
                ephemeral: true
            });
        };
        logInfo(`🔹 Slash Command: ${interaction.commandName} | Guild: ${interaction.guild?.name || 'DM'}`);
        await command.execute(interaction, client);
    };
    if (interaction.isButton()) {
        let button = null;
        for (const [key, handler] of client.buttons) {
            if (interaction.customId.startsWith(key)) {
                button = handler;
                break;
            }
        };
        if (!button) {
            logWarn(`❌ Không tìm thấy button handler: ${interaction.customId}`);
            return await interaction.reply({
                content: '⚠️ Button này không được hỗ trợ!',
                ephemeral: true
            });
        };
        logInfo(`🔘 Button: ${interaction.customId} | Guild: ${interaction.guild?.name || 'DM'}`);
        await button.execute(interaction, client);
    };
    if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);

        if (!modal) {
            logWarn(`❌ Không tìm thấy modal handler: ${interaction.customId}`);
            return await interaction.reply({
                content: '⚠️ Modal này không được hỗ trợ!',
                ephemeral: true
            });
        };
        logInfo(`📝 Modal: ${interaction.customId} | Guild: ${interaction.guild?.name || 'DM'}`);

        await modal.execute(interaction, client);
    };
    if (interaction.isAutocomplete()) {
        const command = client.slash.get(interaction.commandName);

        if (!command || !command.autocomplete) {
            logWarn(`❌ Không tìm thấy autocomplete handler cho: ${interaction.commandName}`);
            return;
        }

        logInfo(`🔍 Autocomplete: ${interaction.commandName} | User: ${interaction.user.tag}`);

        await command.autocomplete(interaction, client);
    };
    if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() ||
        interaction.isRoleSelectMenu() || interaction.isChannelSelectMenu() ||
        interaction.isMentionableSelectMenu()) {

        const selectMenu = client.selectMenus?.get(interaction.customId);

        if (!selectMenu) {
            logWarn(`❌ Không tìm thấy select menu handler: ${interaction.customId}`);
            return await interaction.reply({
                content: '⚠️ Menu này không được hỗ trợ!',
                ephemeral: true
            });
        };
        logInfo(`📋 Select Menu: ${interaction.customId} | Guild: ${interaction.guild?.name || 'DM'}`);
        await selectMenu.execute(interaction, client);
    };
};
