import { PermissionsBitField } from 'discord.js';

export const hasPermission = (interaction) => {
    const member = interaction.member;
    const checkRole = [
        '1386732293888020490', // support discord
        '1384785530754961438', // verifier
        '1382793391125041312', // 95% - server TEST BOT
    ];
    const isAdmin = member.permissions.has(
        PermissionsBitField.Flags.Administrator
    );
    const hasRole = member.roles.cache.some(role => checkRole.includes(role.id));
    return isAdmin || hasRole;
};