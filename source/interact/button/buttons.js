import { HANDLE_BUTTON_APPROVE, HANDLE_BUTTON_REJECT, HANDLE_BUTTON_REPLY } from '../config/nametag.js';
import { ButtonStyle, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { asyncErrorHandler } from '../../middlewares/errorHandler.js';

export const buttonsRejectorApprove = asyncErrorHandler(async (confession) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`${HANDLE_BUTTON_REJECT}${confession.id}`)
            .setLabel('Từ chối')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`${HANDLE_BUTTON_APPROVE}${confession.id}`)
            .setLabel('Phê duyệt')
            .setStyle(ButtonStyle.Success)
    );
}, null);
export const buttonReplyAmonymous = asyncErrorHandler(async (confessionID) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`${HANDLE_BUTTON_REPLY}${confessionID}`)
            .setLabel('Trả lời ẩn danh')
            .setStyle(ButtonStyle.Primary)
    );
}, null);

export const buttonsPagination = (currentPage, totalPages, customIdPrefix = 'page') => {
    const prev = new ButtonBuilder()
        .setCustomId(`${customIdPrefix}_prev_${currentPage - 1}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage <= 1);
    const next = new ButtonBuilder()
        .setCustomId(`${customIdPrefix}_next_${currentPage + 1}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage >= totalPages);
    const pageInfo = new ButtonBuilder()
        .setCustomId('page_info')
        .setLabel(`${currentPage} / ${totalPages}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
    const row = new ActionRowBuilder().addComponents(prev, pageInfo, next);
    return row;
};
export const buttonsDetail = (confessionID, prefix, guildId) => {
    const buttons = [];
    const limit = Math.min(confessionID.length, 5);
    for (let i = 0; i < limit; i++) {
        buttons.push(
            new ButtonBuilder()
                .setCustomId(`detail_${prefix}_${guildId}_${confessionID[i].id}`)
                .setLabel(`Detail #${i + 1}`)
                .setStyle(ButtonStyle.Secondary)
        );
    };
    return new ActionRowBuilder().addComponents(...buttons);
};

export const buttonsAnonymousPrevNext = (currentPage, totalPages, prefix) => {
    const prev = new ButtonBuilder()
        .setCustomId(`${prefix}_prev_${currentPage - 1}`)
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage <= 1);
    const next = new ButtonBuilder()
        .setCustomId(`${prefix}_next_${currentPage + 1}`)
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage >= totalPages);
    const pageInfo = new ButtonBuilder()
        .setCustomId('page_info')
        .setLabel(`${currentPage} / ${totalPages}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);
    const row = new ActionRowBuilder().addComponents(prev, pageInfo, next);
    return row;
};