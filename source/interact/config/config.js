import dotenv from 'dotenv';

dotenv.config();

export const devID = process.env.MY_DISCORD_ID;
export const whitelistGuilds = process.env.WHITELIST_GUILD_IDS.split(',');
