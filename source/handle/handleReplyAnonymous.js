import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import prisma from "../utilities/prisma.js";

export const handleReplyAnonymous = asyncErrorHandler(async (interaction, message) => {
    const thread = interaction.channel;
    let anonymousNumber = -1;
    const box = await prisma.anonymous_reply.findFirst({
        where: {
            thread: thread.id,
        },
    });
    if (!box) {
        await prisma.anonymous_reply.create({
            data: {
                guild: interaction.guild.id,
                thread: thread.id,
                listUserID: [interaction.user.id],
            },
        });
        anonymousNumber = 1;
    } else {
        const arrayList = box.listUserID;
        if (arrayList.includes(interaction.user.id)) {
            for (let i = 0; i < arrayList.length; i++) {
                if (arrayList[i] === interaction.user.id) {
                    anonymousNumber = i + 1;
                };
            };
        } else {
            const newArrayList = [...arrayList, interaction.user.id];
            await prisma.anonymous_reply.update({
                where: {
                    id: box.id,
                },
                data: {
                    listUserID: newArrayList,
                },
            });
            anonymousNumber = newArrayList.length;
        };
    };
    await thread.send({
        content: `**Anonymous #${anonymousNumber} : ** ${message}`,
    });
}, null);