import prisma, { getSavePoint } from "../utilities/prisma.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { GET_ANONYMOUS_NAME, GET_BUTTON_APPROVE, GET_BUTTON_CANCEL, GET_BUTTON_CONFIRM, GET_BUTTON_REJECT, GET_IDENTIFY_NAME } from "../interact/config/nametag.js";
import { embedAPPROVAL } from "../utilities/embed.js";

 export const handleConfirm = asyncErrorHandler(async ( confessionID, status) => {
    const confession = await prisma.cfs_pending.findFirst({
        where: {
            id: confessionID,
        },
    });
    const numberCFS = await getSavePoint(confession.guild);
    const embedCFS = embedAPPROVAL(
        confession.title,
        confession.content,
        numberCFS + 1,
        confession.anonymous === true ? GET_ANONYMOUS_NAME : GET_IDENTIFY_NAME,
        confession.userId,
        0xffff00
    );
    const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`${GET_BUTTON_REJECT}${confession.id}`)
                .setLabel('❌ Từ chối')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`${GET_BUTTON_APPROVE}${confession.id}`)
                .setLabel('✔️ Duyệt')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`${GET_BUTTON_CANCEL}${confession.id}`)
                .setLabel('✖️ Hủy') 
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`${GET_BUTTON_CONFIRM}${confession.id}`)
                .setLabel('✅ Xác nhận')
                .setStyle(ButtonStyle.Success)
    );
    await prisma.cfs_pending.update({
        where: {
            id: confession.id,
        },
        data: {
            status: status,
        },
    });
    return {embedCFS, buttons};
 }, null);