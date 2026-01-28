import prisma from "../utilities/prisma.js";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { STATUS_CONFIRM } from "../interact/config/nametag.js";
import { getVietnamTime } from "../utilities/timezone.js";

export const handleDeleteCFS = asyncErrorHandler(async ( confession, flagAnonymous) => {
    await prisma.cfs_refuse.create({
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
}, null);