import { SlashCommandBuilder } from 'discord.js';
import prisma from '../Utils/prisma.js';
import { handleInteractionError } from '../Middlewares/errorHandler.js';
export const name = 'unsetchannels';
export const data = new SlashCommandBuilder()
  .setName('unsetchannels')
  .setDescription('Xóa 1 trong 2 kênh đã set trước đó')
  .addStringOption(option =>
    option.setName('target')
      .setDescription('Chọn kênh muốn xóa (approval hoặc forum)')
      .addChoices(
        { name: 'text', value: 'text' },
        { name: 'forum', value: 'forum' },
      )
      .setRequired(true));
export const execute = async (interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.member.permissions.has('Administrator') && interaction.user.id !== interaction.guild.ownerId) {
      return await interaction.reply({ content: '❌ Bạn cần quyền ADMINISTRATOR hoặc là OWNER server để dùng lệnh này.', ephemeral: true });
    };
    const target = interaction.options.getString('target');
    const existingConfig = await prisma.config.findUnique({
      where: { guildId: interaction.guild.id },
    });
    if (!existingConfig) {
      return await interaction.reply({ content: '❌ Chưa có dữ liệu nào được set trước đó.', ephemeral: true });
    };
    const IdChannel = await prisma.config.findMany();
    //console.log(IdChannel);
    if (target === 'text') {
      await prisma.config.update({
        where: { guildId: interaction.guild.id },
        data: { approvalChannelId: 'null' },
      });
      return await interaction.reply({ content: `✅ Đã unset kênh duyệt (ID: ${IdChannel[0].approvalChannelId})`, ephemeral: true });
    };
    if (target === 'forum') {
      await prisma.config.update({
        where: { guildId: interaction.guild.id },
        data: { forumChannelId: 'null' },
      });
      return await interaction.reply({ content: `✅ Đã unset kênh forum (ID: ${IdChannel[0].forumChannelId})`, ephemeral: true });
    };
  } catch (error) {
    await handleInteractionError(interaction, error);
  };
};