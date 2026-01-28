import { EmbedBuilder } from "@discordjs/builders";
import { EDIT_FIRST_MESSAGE, GET_LIST_PENDING, GET_REPLY_ANONYMOUS, POST_FIRST_CHOICE, SET_CHANNEL_NAME, SET_FORUM_NAME, SET_ROLE_NAME, SET_SAVEPOINT_NAME, SHOW_CONFIG_GUILD, UNSET_CHANNEL_NAME, UNSET_FORUM_NAME, UNSET_ROLE_NAME } from "../interact/config/nametag.js";
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
            { name: `Loại confession`, value: tag === GET_ANONYMOUS_NAME ? 'Ẩn danh' : 'Công khai', inline: true },
            { name: `Người gửi`, value: tag === GET_ANONYMOUS_NAME ? 'Ẩn danh' : `<@${object}>`, inline: true },
        )
        .setFooter({ text: `Confession số: ${currentCFS}` })
        .setColor(color);
};
export const embedPostCFS = (title, content, tag, object, color) => {
    return new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(`${content}`)
        .setFields(
            { name: `Loại confession`, value: tag === GET_ANONYMOUS_NAME ? 'Ẩn danh' : 'Công khai', inline: true },
            { name: `Người gửi`, value: tag === GET_ANONYMOUS_NAME ? 'Ẩn danh' : `<@${object}>`, inline: true },
        )
        .setColor(color);
};
export const embedNotificationUser = (interaction, id, savepoint) => {
    return new EmbedBuilder()
        .setTitle(`✅ Confession #${savepoint} đã được duyệt`)
        .setDescription(`Confession của bạn đã được <@${interaction.user.id}> duyệt và đăng lên Confession của server \`${interaction.guild.name}\`.`)
        .setFields({
            name: `Lưu ý`,
            value: `- Confession đăng lên sẽ không được xoá hoặc chỉnh sửa.\n- Nếu bạn đăng ||Ẩn Danh|| thì không ai biết bạn là ai. Kể cả Admin, người duyệt bài của bạn và người phát triển Bot này.\n- Mọi thắc mắc bạn có thể liên hệ Admin hoặc người duyệt bài của bạn. Trường hợp bạn đăng ||Ân Danh|| mà không muốn lộ danh tính có thể nhắn cho <@${id}> để được giải đáp.`
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
            { name: `/${SET_ROLE_NAME}`, value: 'Chọn vai trò được phép duyệt confession' },
            { name: `/${SET_FORUM_NAME}`, value: 'Chọn kênh diễn đàn ( channel-forum ) đăng confession' },
            { name: `/${SET_CHANNEL_NAME}`, value: 'Chọn kênh văn bản ( channel-text ) duyệt confession' },
            { name: `/${UNSET_ROLE_NAME}`, value: 'Bỏ chọn vai trò được phép duyệt confession' },
            { name: `/${UNSET_FORUM_NAME}`, value: 'Bỏ chọn kênh diễn đàn ( channel-forum ) đăng confession' },
            { name: `/${UNSET_CHANNEL_NAME}`, value: 'Bỏ chọn kênh văn bản ( channel-text ) duyệt confession' },
            { name: `/${POST_FIRST_CHOICE}`, value: 'Gửi một kênh chủ đề ( channel-thread ) để lựa chọn viết confession, nó sẽ lấy kênh diễn đàn ( channel-forum ) đã được thiết lập để đăng lên' },
        )
        .addFields(
            { name: `:technologist: Nhà phát triển`, value: 'Lệnh chỉ dành cho nhà phát triển Bot Confession' },
            { name: `/${EDIT_FIRST_MESSAGE}`, value: 'Chỉnh sửa tin nhắn lựa chọn viết confession' },
            { name: `${SET_SAVEPOINT_NAME}`, value: 'Đặt điểm lưu confession hiện tại' },
        )
        .addFields(
            { name: `:shield: Vai trò được cấp phép`, value: 'Lệnh dành cho vai trò được cấp phép và ADMIN' },
            { name: `/${SHOW_CONFIG_GUILD}`, value: 'Xem thông tin cấu hình của server hiện tại' },
            { name: `/${GET_LIST_PENDING}`, value: 'Gửi lại toàn bộ bài viết đang chờ duyệt' },
        )
        .addFields(
            { name: `:busts_in_silhouette: Mọi người`, value: 'Lệnh dành cho mọi người dùng trong server' },
            { name: `/${GET_REPLY_ANONYMOUS}`, value: 'Gửi tin nhắn ẩn danh' },
        )
        .setColor(color);
};

export const embedNotificationAmonymous = (color) => {
    return new EmbedBuilder()
        .setTitle('📢 Lưu ý khi gửi tin nhắn ẩn danh')
        .setDescription(`Đây là một lệnh có thể sử dụng ngoài mục đích trả lời các Confession nên có vài việc bạn cần lưu ý`)
        .addFields(
            { name: `Lưu ý`, value: `- Lệnh \`/${GET_REPLY_ANONYMOUS}\` sẽ lưu lại ID của bạn qua mỗi kênh riêng biệt bạn đã sử dụng sau đó chuyển thành tin nhắn với cái tên là \`Anonymous #(Số bất kỳ bot gán cho bạn)\` .\n- ADMIN sẽ hoặc bất kỳ ai cũng sẽ không biết bạn là ai nếu bạn cẩn thận không để lộ \`you is typing...\`.\n- Nhưng với một số trường bạn sử dụng nó với mục đích công kích, xúc phạm, phân biệt vùng miền, gửi mã độc,... \`ADMIN hoặc MOD có thể yêu cầu bên tôi cung cấp thông tin. Tuỳ mức độ ADMIN và MOD cho là nghiêm trọng sẽ xử lý, nặng nhất bị multi-server ban vĩnh viễn không thể vô lại được vì BOT ban rất khác với ADMIN hay MOD tự ban (không thể gỡ)\`\n- Lệnh này không liên quan gì đến bên Confession cả nên bạn yên tâm là bài viết của bạn sẽ hoàn toàn riêng biệt về thông tin. Người phát triển Bot cũng sẽ không biết được bạn là ai nếu bạn đăng Confession ||Ẩn Danh||\n- Nếu còn thắc mắc bạn có để gửi tin nhắn riêng cho <@${devID}> để được giải đáp` }
        )
        .setColor(color);
};