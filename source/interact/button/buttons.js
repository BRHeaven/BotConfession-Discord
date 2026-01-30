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