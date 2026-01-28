import { numberACfs } from '../Utils/fixApproveCfs.js';
import prisma from '../Utils/prisma.js';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
export const sendAllPendingConfessions = async (client, onlyNew = false) => {
  try {
    const configs = await prisma.config.findMany();
    if (!configs) return;

    for (const config of configs) {
      const approvalChannel = await client.channels.fetch(config.approvalChannelId).catch(() => null);
      if (!approvalChannel) continue;
      const whereCondition = onlyNew ? { isSent: false } : {};
      const pendingList = await prisma.confession_PENDING.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'asc' },
      });

      for (const confession of pendingList) {
        const embed = new EmbedBuilder()
          .setTitle('📝 Confession chờ duyệt')
          .addFields([
            { name: ':person_bald: Người gửi', value: confession.isAnonymous ? 'Anonymous 👤' : `<@${confession.userId}>` },
            { name: ':pushpin: ID Confession', value: `${confession.id}` },
          ])
          .setDescription(`${confession.content}`)
          .setColor('Yellow')
          .setTimestamp(new Date(confession.createdAt));

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`approve_${confession.id}`).setLabel('✅ Duyệt').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_${confession.id}`).setLabel('❌ Từ chối').setStyle(ButtonStyle.Danger)
        );

        await approvalChannel.send({ embeds: [embed], components: [row] });

        // Chỉ update isSent nếu là gửi tự động (onlyNew = true)
        if (onlyNew) {
          await prisma.confession_PENDING.update({
            where: { id: confession.id },
            data: { isSent: true },
          });
        }
      }
    }
  } catch (error) {
    console.error('[ERROR] Gửi confession:', error);
  }
};
export async function postApprovedConfessionToForum(client, guildId, approvedConfession) {
  try {
    const config = await prisma.config.findUnique({ where: { guildId } });
    if (!config?.forumChannelId) return;
    const forumChannel = await client.channels.fetch(config.forumChannelId);
    if (!forumChannel || !forumChannel.threads) return;
    // Tạo nội dung đầy đủ
    let fullContent = approvedConfession.content;
    if (!approvedConfession.isAnonymous) {
      const user = await client.users.fetch(approvedConfession.userId).catch(() => null);
      if (user) {
        const displayName = user.globalName || user.username;
        fullContent = `*(Người viết: ${displayName})*\n\n${approvedConfession.content}`;
      }
    }
    // Lấy số confession để đánh số
    const count = await prisma.confession_APPROVED.count();
    const displayIndex = numberACfs + count;
    // Tạo embed
    const embed = new EmbedBuilder()
      .setTitle(`Confession #${displayIndex}`)
      .setDescription(fullContent)
      .setColor('#4287f5');
    // Tạo thread
    const thread = await forumChannel.threads.create({
      name: `Confession #${displayIndex}`,
      message: {
        embeds: [embed], // ✅ Không để trong content
      },
    });
    // Gửi hướng dẫn reply
    await thread.send({
      content: '📢 Bạn có thể trả lời ẩn danh bằng cách dùng lệnh `/reply` hoặc bấm nút "Reply".',
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`reply_${approvedConfession.id}`)
            .setLabel('Reply')
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });
  } catch (error) {
    console.error('[ERROR] Đăng confession lên Forum:', error);
  }
}
