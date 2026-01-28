import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { GET_ANONYMOUS_NAME, SET_CHANNEL_NAME } from "../interact/config/nametag.js";
import { getVietnamTime } from "../utilities/timezone.js";
import { embedAPPROVAL } from "../utilities/embed.js";
import prisma from "../utilities/prisma.js";
import { buttonsRejectorApprove } from "../interact/button/buttons.js";

export const handleSubmitCFS = asyncErrorHandler(async (interaction, tag) => {
    const titleCFS = interaction.fields.getTextInputValue('title_cfs');
    const contentCFS = interaction.fields.getTextInputValue('content_cfs');
    const confession = await prisma.cfs_pending.create({
        data: {
            userId: interaction.user.id,
            guild: interaction.guild.id,
            title: titleCFS,
            content: contentCFS,
            anonymous: tag === GET_ANONYMOUS_NAME ? true : false,
            time: getVietnamTime(),
        },
    });
    const config = await prisma.config.findFirst({
        where: {
            guild: interaction.guild.id,
        },
    });
    if (!config || config.channel === 'null') {
        return await interaction.editReply({
            embeds: [embedNotificationDefault(
                ':warning: Chưa có kênh duyệt confession',
                `Chưa có kênh kiểm duyệt confession. Nên không thể gửi bài viết của bạn. Liên hệ ADMIN để yêu cầu họ thiết lập bằng lệnh \`/${SET_CHANNEL_NAME}\``,
                0xFFFF00,
            )],
            ephemeral: true,
        });
    };
    const channel = await interaction.client.channels.fetch(config.channel);
    const buttons = await buttonsRejectorApprove(confession);
    await channel.send({
        content: `📢 **Confession chờ kiểm duyệt**`,
        embeds: [embedAPPROVAL(
            titleCFS,
            contentCFS,
            config.savepoint + 1,
            tag,
            interaction.user.id,
            0x00B0FF,
        )],
        components: [buttons],
    });
    return;
}, null);