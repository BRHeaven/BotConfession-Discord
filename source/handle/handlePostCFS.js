import prisma from "../utilities/prisma.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { GET_ANONYMOUS_NAME, GET_IDENTIFY_NAME, GET_REPLY_ANONYMOUS, STATUS_CONFIRM } from "../interact/config/nametag.js";
import { devID } from "../interact/config/config.js";
import { getVietnamTime } from "../utilities/timezone.js";
import { embedNotificationDefault, embedNotificationUser, embedPostCFS } from "../utilities/embed.js";
import { buttonReplyAmonymous } from "../interact/button/buttons.js";

export const handlePostCFS = asyncErrorHandler(async (interaction, confession, flagAnonymous) => {
    await prisma.cfs_accept.create({
        data: {
            userId: flagAnonymous ? 'Ẩn Danh' : confession.userId,
            guild: confession.guild,
            title: confession.title,
            content: confession.content,
            anonymous: confession.anonymous,
            time: getVietnamTime(),
            status: STATUS_CONFIRM,
        },
    });
    const config = await prisma.config.update({
        where: {
            guild: interaction.guild.id,
        },
        data: {
            savepoint: {
                increment: 1,
            },
        },
    });
    await interaction.client.users.fetch(confession.userId).then(async (user) => {
        await user.send({
            embeds: [embedNotificationUser(interaction, devID, config.savepoint)],
        });
    });
    const forum = await interaction.guild.channels.fetch(config.forum);
    const thread = await forum.threads.create({
        name: `Confession #${config.savepoint} - ${confession.title}`,
        message: {
            embeds: [embedPostCFS(
                confession.title,
                confession.content,
                confession.anonymous === true ? GET_ANONYMOUS_NAME : GET_IDENTIFY_NAME,
                confession.userId,
                0x005dff
            )],
        },
    });
    await thread.send({
        content: `📢 Bạn có thể trả lời ẩn danh trong bài viết này`,
        embeds: [embedNotificationDefault(
            `Chọn 1 trong 2 cách để trả lời`,
            `1. Nhấn nút \`Trả lời ẩn danh\` có thể dùng emoji nhưng hơi khó\n2. Gửi tin nhắn bằng lệnh \`/${GET_REPLY_ANONYMOUS}\` để trả lời ẩn danh dễ dàng hơn`,
            0xffb27e
        )],
        components: [await buttonReplyAmonymous(confession.id)],
    });
}, null);