import { GET_BUTTON_APPROVE, GET_BUTTON_REJECT, GET_BUTTON_REPLY } from '../config/nametag.js';
import { ButtonStyle, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { asyncErrorHandler } from '../../middlewares/errorHandler.js';

export const buttonsRejectorApprove = asyncErrorHandler(async (confession) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`${GET_BUTTON_REJECT}${confession.id}`)
            .setLabel('Từ chối')
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`${GET_BUTTON_APPROVE}${confession.id}`)
            .setLabel('Phê duyệt')
            .setStyle(ButtonStyle.Success)
    );
}, null);
export const buttonReplyAmonymous = asyncErrorHandler(async (confessionID) => {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`${GET_BUTTON_REPLY}${confessionID}`)
            .setLabel('Trả lời ẩn danh')
            .setStyle(ButtonStyle.Primary)
    );
}, null);