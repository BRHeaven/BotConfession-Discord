import dotenv from 'dotenv';
dotenv.config();

console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('WHITELIST_GUILD_IDS:', process.env.WHITELIST_GUILD_IDS);
