import { EmbedBuilder } from "@discordjs/builders";
import { COMMAND_INSTRUCTIONS, CONFIG_CHANNEL_FORUM, CONFIG_CHANNEL_TEXT, CONFIG_EDIT, CONFIG_GUILD, CONFIG_OPTIONS, CONFIG_PUT, CONFIG_ROLE, CONFIG_SAVEPOINT, CONFIG_SET, CONFIG_SETTINGS, CONFIG_UNSET, CONFIG_VIEW, CONFIG_WRITE_OPTIONS, MESSAGE_ANONYMOUS, NAME_ANONYMOUS } from "../interact/config/nametag.js";
import { devID } from "../interact/config/config.js";

export const embedNotificationError = (title, description, color) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
};
export const embedNotificationDefault = (title, description, color) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
};
export const embedAPPROVAL = (title, content, currentCFS, tag, object, color) => {
    return new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(`${content}`)
        .setFields(
            { name: `Loại confession`, value: tag === NAME_ANONYMOUS ? 'Ẩn danh' : 'Công khai', inline: true },
            { name: `Người gửi`, value: tag === NAME_ANONYMOUS ? 'Ẩn danh' : `<@${object}>`, inline: true },
        )
        .setFooter({ text: `Confession số: ${currentCFS}` })
        .setColor(color);
};
export const embedPostCFS = (title, content, tag, object, color) => {
    return new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(`${content}`)
        .setFields(
            { name: `Loại confession`, value: tag === NAME_ANONYMOUS ? 'Ẩn danh' : 'Công khai', inline: true },
            { name: `Người gửi`, value: tag === NAME_ANONYMOUS ? 'Ẩn danh' : `<@${object}>`, inline: true },
        )
        .setColor(color);
};
export const embedNotificationUser = (interaction, id, savepoint) => {
    return new EmbedBuilder()
        .setTitle(`✅ Confession #${savepoint} đã được duyệt`)
        .setDescription(`Confession của bạn đã được <@${interaction.user.id}> duyệt và đăng lên Confession của server \`${interaction.guild.name}\`.`)
        .setFields({
            name: `Lưu ý`,
            value: `- Confession đăng lên sẽ không được xoá hoặc chỉnh sửa.\n- Nếu bạn đăng ||Ẩn Danh|| thì không ai biết bạn là ai. Kể cả Admin, người duyệt bài của bạn và người phát triển Bot này.\n- Mọi thắc mắc bạn có thể liên hệ Admin hoặc người duyệt bài của bạn. Trường hợp bạn đăng ||Ẩn Danh|| mà không muốn lộ danh tính có thể nhắn cho <@${id}> để được giải đáp.`
        })
        .setColor(0xffb27e);
};
export const embedConfigGuild = (config, roles) => {
    const roleList = roles.map(role => `<@&${role.roleId}>`).join('\n') || 'Chưa có vai trò nào được thiết lập';
    return new EmbedBuilder()
        .setTitle(`⚙️ Cấu hình server (${config.guild})`)
        .setDescription(` `)
        .addFields(
            { name: 'Kênh duyệt confession', value: `<#${config.channel}>`, inline: true },
            { name: 'Kênh diễn đàn confession', value: `<#${config.forum}>`, inline: true },
            { name: 'Vai trò được phép duyệt confession', value: roleList, inline: false },
            { name: 'Điểm lưu', value: `${config.savepoint}`, inline: false },
        )
        .setColor(0x00B0FF);
};
export const embedHelp = (color) => {
    return new EmbedBuilder()
        .setTitle('📖 Hướng dẫn sử dụng Bot Confession')
        .setDescription('Các lệnh và chức năng của Bot Confession')
        .addFields(
            { name: `:bust_in_silhouette: ADMIN`, value: 'Lệnh chỉ dành cho ADMIN của server' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_ROLE}`, value: 'Chọn vai trò được phép duyệt confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_CHANNEL_FORUM}`, value: 'Chọn kênh diễn đàn ( channel-forum ) đăng confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_CHANNEL_TEXT}`, value: 'Chọn kênh văn bản ( channel-text ) duyệt confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_ROLE}`, value: 'Bỏ chọn vai trò được phép duyệt confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_FORUM}`, value: 'Bỏ chọn kênh diễn đàn ( channel-forum ) đăng confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_UNSET} ${CONFIG_CHANNEL_TEXT}`, value: 'Bỏ chọn kênh văn bản ( channel-text ) duyệt confession' },
            { name: `/${CONFIG_SETTINGS} ${CONFIG_SET} ${CONFIG_WRITE_OPTIONS}`, value: 'Gửi một kênh chủ đề ( channel-thread ) để lựa chọn viết confession, nó sẽ lấy kênh diễn đàn ( channel-forum ) đã được thiết lập để đăng lên' },
        )
        .addFields(
            { name: `:technologist: Nhà phát triển`, value: 'Lệnh chỉ dành cho nhà phát triển Bot Confession' },
            { name: `/${CONFIG_OPTIONS} ${CONFIG_EDIT} ${CONFIG_WRITE_OPTIONS}`, value: 'Chỉnh sửa tin nhắn lựa chọn viết confession' },
            { name: `/${CONFIG_OPTIONS} ${CONFIG_PUT} ${CONFIG_SAVEPOINT}`, value: 'Đặt điểm lưu confession hiện tại' },
        )
        .addFields(
            { name: `:shield: Vai trò được cấp phép`, value: 'Lệnh dành cho vai trò được cấp phép và ADMIN' },
            { name: `/${CONFIG_VIEW} ${CONFIG_GUILD}`, value: 'Xem thông tin cấu hình của server hiện tại' },
            { name: `/${CONFIG_VIEW} ${COMMAND_INSTRUCTIONS}`, value: 'Gửi lại toàn bộ bài viết đang chờ duyệt' },
        )
        .addFields(
            { name: `:busts_in_silhouette: Mọi người`, value: 'Lệnh dành cho mọi người dùng trong server' },
            { name: `/${CONFIG_VIEW} ${CONFIG_GUILD}`, value: 'Xem thông tin cấu hình của server hiện tại' },
            { name: `/${CONFIG_VIEW} ${COMMAND_INSTRUCTIONS}`, value: 'Gửi lại toàn bộ bài viết đang chờ duyệt' },
            { name: `/${MESSAGE_ANONYMOUS}`, value: 'Gửi tin nhắn ẩn danh' },
        )
        .setColor(color);
};
export const embedNotificationAmonymous = (color) => {
    return new EmbedBuilder()
        .setTitle('📢 Lưu ý khi gửi tin nhắn ẩn danh')
        .setDescription(`Đây là một lệnh có thể sử dụng ngoài mục đích trả lời các Confession nên có vài việc bạn cần lưu ý`)
        .addFields(
            { name: `Lưu ý`, value: `- Lệnh \`/${MESSAGE_ANONYMOUS}\` sẽ lưu lại ID của bạn qua mỗi kênh riêng biệt bạn đã sử dụng sau đó chuyển thành tin nhắn với cái tên là \`Anonymous #(Số bất kỳ bot gán cho bạn)\` .\n- ADMIN sẽ hoặc bất kỳ ai cũng sẽ không biết bạn là ai nếu bạn cẩn thận không để lộ \`you is typing...\`.\n- Nhưng với một số trường bạn sử dụng nó với mục đích công kích, xúc phạm, phân biệt vùng miền, gửi mã độc,... \`ADMIN hoặc MOD có thể yêu cầu bên tôi cung cấp thông tin. Tuỳ mức độ ADMIN và MOD cho là nghiêm trọng sẽ xử lý, nặng nhất bị multi-server ban vĩnh viễn không thể vô lại được vì BOT ban rất khác với ADMIN hay MOD tự ban (không thể gỡ)\`\n- Lệnh này không liên quan gì đến bên Confession cả nên bạn yên tâm là bài viết của bạn sẽ hoàn toàn riêng biệt về thông tin. Người phát triển Bot cũng sẽ không biết được bạn là ai nếu bạn đăng Confession ||Ẩn Danh||\n- Nếu còn thắc mắc bạn có để gửi tin nhắn riêng cho <@${devID}> để được giải đáp` }
        )
        .setColor(color);
};
export const embedListAmonymousReply = (guild, channel, list, color) => {
    return new EmbedBuilder()
        .setTitle(`📋 **LIST ANONYMOUS**`)
        .setDescription(`**Guild:** ${guild.name} (**ID:** ${guild.id})\n**Channel:** ${channel.name} (**ID:** ${channel.id})`)
        .addFields(
            { name: `Total: ${list.length}`, value: `${list.userID}` }
        )
        .setColor(color);
};
export const embedListCFS = (guild, list, nameList, totalCFS, color) => {
    let render = '';
    let index = 1;
    for (const item of list) {
        render += `**Detail:** #${index}\n**Name:** ${item.user}\n **TITLE:** ${item.title}\n **STATUS:** ${item.status}\n **TIME:** ${item.time}\n\n`;
        index++;
    };
    return new EmbedBuilder()
        .setTitle(`📋 **LIST ${nameList} CONFESSIONS**`)
        .setDescription(`**Guild:** ${guild.name} (**ID:** ${guild.id})`)
        .addFields(
            { name: `Total: ${totalCFS}`, value: render }
        )
        .setColor(color);
};
export const embedDetailCFS = (nameGuild, idGuild, confession, color) => {
    const timestamp = Math.floor(new Date(confession.time).getTime() / 1000);
    return new EmbedBuilder()
        .setTitle(`📋 **${confession.title}**`)
        .setDescription(confession.content)
        .addFields(
            { name: `Guild:`, value: `${nameGuild} (ID: ${idGuild})`, inline: true },
            { name: `User:`, value: `<@${confession.userId}> (ID: ${confession.userId})`, inline: true },
            { name: ``, value: ``, inline: false },
            { name: `Status:`, value: `${confession.status}`, inline: true },
            { name: `Time:`, value: `<t:${timestamp}:F>`, inline: true },
        )
        .setColor(color
        )
};
export const embedListALLCFS = (list, tag, quantity, color) => {
    let render = '';
    let index = 1;
    for (const item of list) {
        render += `**Detail:** #${index}\n**Guild:** ${item.guild.name} (ID: ${item.guild.id})\n**Name:** ${item.user}\n **TITLE:** ${item.title}\n **TIME:** ${item.time}\n\n`;
        index++;
    };
    return new EmbedBuilder()
        .setTitle(`📋 **LIST ALL ${tag} CONFESSIONS**`)
        .setDescription(`Total: ${quantity}`)
        .addFields(
            { name: `**List**`, value: render }
        )
        .setColor(color);
};
export const embedAllListAmonymousReply = (array, quantity, color) => {
    let render = '';
    let listUser = '';
    for (const item of array) {
        for (const object of item.list) {
            listUser += `<@${object}>, `;
        };
        render += `**Guild:** ${item.guild.name} (ID: ${item.guild.id})\n**Channel:** ${item.channel.name} (ID: ${item.channel.id})\n**List Users:** ${listUser}\n\n`;
        listUser = '';
    };
    return new EmbedBuilder()
        .setTitle(`📋 **LIST ANONYMOUS REPLY**`)
        .setDescription(`Total: ${quantity}`)
        .addFields(
            { name: `List`, value: `${render}` }
        )
        .setColor(color);
};