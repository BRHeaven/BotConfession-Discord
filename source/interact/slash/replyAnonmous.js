import { SlashCommandBuilder } from "discord.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { GET_REPLY_ANONYMOUS } from "../config/nametag.js";
import { handleReplyAnonymous } from "../../handle/handleReplyAnonymous.js";
import { embedNotificationAmonymous, embedNotificationDefault } from "../../utilities/embed.js";
import prisma from "../../utilities/prisma.js";

export const name = GET_REPLY_ANONYMOUS;
export const data = new SlashCommandBuilder()
    .setName(GET_REPLY_ANONYMOUS)
    .setDescription('Trả lời ẩn danh cho một confession')
    .addStringOption(option =>
        option.setName('nội_dung_trả_lời')
            .setDescription('Nội dung bạn muốn trả lời ẩn danh')
            .setRequired(true)
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const replyContent = interaction.options.getString('nội_dung_trả_lời');
    await handleReplyAnonymous(interaction, replyContent);
    const user = await prisma.register_anonymous.findFirst({
        where: {
            idUser: interaction.user.id,
        },
    });
    if (!user) {
        const person =await interaction.client.users.fetch(interaction.user.id);
        await prisma.register_anonymous.create({
            data: {
                idUser: interaction.user.id,
                guild: interaction.guild.id,
                flag : false,
            },
        });
        await person.send({
            embeds: [embedNotificationAmonymous(0x0072ff)]
        });
    };
    return await interaction.editReply({
        embeds: [embedNotificationDefault(
            ':white_check_mark: Gửi thành công',
            'Đã gửi trả lời ẩn danh!',
            0x00FF00,
        )],
        ephemeral: true,
    });
}, null);
