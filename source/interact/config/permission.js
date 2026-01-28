import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import prisma from "../../utilities/prisma.js";

export const permissionAdmin = asyncErrorHandler(async (interaction) => {
    return interaction.member.permissions.has("Administrator");
}, null);
export const hasRole = asyncErrorHandler(async (interaction) => {
    const guildId = interaction.guild.id;
    const roles = await prisma.role.findMany({
        where: {
            guild: guildId,
        },
    });
    if (roles.length === 0) return false;
    for (const role of roles) {
        if (interaction.member.roles.cache.has(role.roleId)) {
            return true;
        };
    };
    return false;
}, null);
export const hasPermission = asyncErrorHandler(async (interaction) => {
    if (await permissionAdmin(interaction)) return true;
    return await hasRole(interaction);
}, null);