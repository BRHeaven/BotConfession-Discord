import { logError, logWarn } from "./logger.js";
import { DMErrorBot } from "../utilities/sendDM.js";

export const globalErrorHandler = async (error, context = {}, client = null) => {
    const errorDetails = extractErrorDetails(error);
    logError('═══════════════════════════════════════');
    logError(`🔴 LỖI: ${errorDetails.message}`);
    logError(`📁 File: ${errorDetails.file}`);
    logError(`📍 Dòng: ${errorDetails.line}`);
    logError(`⚙️  Function: ${errorDetails.function}`);
    if (context.commandName) {
        logError(`🎯 Command: ${context.commandName}`);
    };
    if (context.userId) {
        logError(`👤 User ID: ${context.userId}`);
    };
    if (context.guildId) {
        logError(`🏠 Guild ID: ${context.guildId}`);
    };
    logError(`📋 Stack trace:\n${errorDetails.stack}`);
    logError('═══════════════════════════════════════');
    const errorMessage = formatErrorMessage(errorDetails, context);
    if (client) {
        try {
            logWarn('🔔 Đang gửi DM thông báo lỗi cho developer...');
            await DMErrorBot(client, errorMessage);
            logWarn('✅ Đã gửi DM thông báo lỗi thành công!');
        } catch (dmError) {
            logError('❌ Không thể gửi DM thông báo lỗi cho developer:');
            logError(dmError.message || String(dmError));
        };
    } else {
        logWarn('⚠️ Client không tồn tại, không thể gửi DM!');
    };
    return errorDetails;
};
export const extractErrorDetails = (error) => {
    const details = {
        message: error.message || 'Không có thông báo lỗi',
        name: error.name || 'Error',
        stack: error.stack || 'Không có stack trace',
        file: 'Unknown',
        line: 'Unknown',
        column: 'Unknown',
        function: 'Unknown'
    };
    if (error.stack) {
        const stackLines = error.stack.split('\n');
        if (stackLines.length > 1) {
            const errorLine = stackLines[1];
            const match = errorLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
            const matchNoParens = errorLine.match(/at\s+(.+?):(\d+):(\d+)/);
            if (match) {
                details.function = match[1].trim();
                details.file = match[2].trim();
                details.line = match[3];
                details.column = match[4];
            } else if (matchNoParens) {
                details.file = matchNoParens[1].trim();
                details.line = matchNoParens[2];
                details.column = matchNoParens[3];
                details.function = 'Anonymous';
            };
            if (details.file.includes('\\')) {
                const parts = details.file.split('\\');
                details.file = parts.slice(-2).join('/');
            } else if (details.file.includes('/')) {
                const parts = details.file.split('/');
                details.file = parts.slice(-2).join('/');
            };
        };
    };
    return details;
};
const formatErrorMessage = (errorDetails, context) => {
    let message = `**🔴 Bot gặp lỗi nghiêm trọng!**\n\n`;
    message += `**Loại lỗi:** ${errorDetails.name}\n`;
    message += `**Thông báo:** ${errorDetails.message}\n`;
    message += `**File:** \`${errorDetails.file}\`\n`;
    message += `**Dòng:** \`${errorDetails.line}\`\n`;
    message += `**Cột:** \`${errorDetails.column}\`\n`;
    message += `**Function:** \`${errorDetails.function}\`\n\n`;
    if (context.commandName) {
        message += `**Command:** ${context.commandName}\n`;
    };
    if (context.userId) {
        message += `**User ID:** ${context.userId}\n`;
    };
    if (context.guildId) {
        message += `**Guild ID:** ${context.guildId}\n`;
    };
    const stackTrace = errorDetails.stack || 'Không có stack trace';
    message += `\n**Stack Trace:**\n\`\`\`\n${stackTrace.substring(0, 1500)}\n\`\`\``;
    return message;
};
export const asyncErrorHandler = (functions, client = null) => {
    return async (...args) => {
        try {
            return await functions(...args);
        } catch (error) {
            const context = {
                commandName: args[0]?.commandName || args[0]?.customId,
                userId: args[0]?.user?.id || args[0]?.author?.id,
                guildId: args[0]?.guildId || args[0]?.guild?.id
            };
            await globalErrorHandler(error, context, client);
            const interaction = args[0];
            try {
                const errorMessage = '❌ Đã có lỗi xảy ra khi bot cố tương tác với bạn, tôi đã thông báo lỗi này với developer để sửa chữa. Rất xin lỗi vì bất tiện này, thử lại sau nhé.';
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: errorMessage, embeds: [], components: [] });
                } else if (interaction.reply) {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                }
            } catch (replyError) {
                logWarn('❌ Không thể gửi error message cho user');
            };
            throw error;
        };
    };
};
export const setupProcessErrorHandlers = (client) => {
    process.on('uncaughtException', async (error) => {
        await globalErrorHandler(error, { source: 'uncaughtException' }, client);
    });

    process.on('unhandledRejection', async (reason, promise) => {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        await globalErrorHandler(error, { source: 'unhandledRejection' }, client);
    });
    logWarn('✅ Đã setup process error handlers');
};
export const handlerErrorMiddlewares = async (interaction, error) => {
    const client = interaction.client;

    const context = {
        commandName: interaction.commandName || interaction.customId,
        userId: interaction.user?.id,
        guildId: interaction.guildId || interaction.guild?.id
    };

    // Xử lý lỗi
    await globalErrorHandler(error, context, client);

    // Trả lời user
    try {
        const errorReply = {
            content: '❌ Đã xảy ra lỗi! Developer đã được thông báo.',
            ephemeral: true
        };

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(errorReply);
        } else {
            await interaction.reply(errorReply);
        }
    } catch (replyError) {
        logWarn('Không thể gửi error message cho user');
    }

    // KHÔNG throw lại error để tránh bị xử lý 2 lần
};
