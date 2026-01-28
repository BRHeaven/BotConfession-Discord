import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;

export const getSavePoint = async (guildId) => {
    const config = await prisma.config.findFirst({
        where: {
            guild: guildId,
        },
    });
    return config ? config.savepoint : null;
};