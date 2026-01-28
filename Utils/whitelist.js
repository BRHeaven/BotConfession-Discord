import dotenv from 'dotenv';
dotenv.config();
export const whitelistGuilds = process.env.WHITELIST_GUILD_IDS.split(',');