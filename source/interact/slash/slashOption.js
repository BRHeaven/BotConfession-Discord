import { SlashCommandBuilder } from "discord.js";
import { CONFIG_EDIT, CONFIG_GET, CONFIG_OPTIONS, CONFIG_PUT, CONFIG_SAVEPOINT, CONFIG_VIEW, CONFIG_WRITE_OPTIONS, LIST_PENDING } from "../config/nametag.js";
import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { setSavePoint } from "./setSavePoint.js";
import { setWriteOptions } from "./setWriteOptions.js";
import { editWriteOptions } from "./editWriteOptions.js";
import { getListPending } from "./getListPending.js";

export const name = CONFIG_OPTIONS;
export const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Tùy chọn cho Bot')
    .addSubcommandGroup(group =>
        group
            .setName(CONFIG_PUT)
            .setDescription('Đặt tùy chọn cho Bot')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_SAVEPOINT)
                    .setDescription('Đặt điểm lưu cho Confession ( Chỉ dành cho Developer )')
                    .addIntegerOption(option => option
                        .setName('savepoint')
                        .setDescription('Điểm lưu cho Confession')
                        .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_WRITE_OPTIONS)
                    .setDescription('Đặt lựa chọn viết Confession  ( Cần quyền ADMIN )')
            )
    )
    .addSubcommandGroup(group =>
        group
            .setName(CONFIG_EDIT)
            .setDescription('Chỉnh sửa tùy chọn cho Bot')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(CONFIG_WRITE_OPTIONS)
                    .setDescription('Chỉnh sửa lựa chọn viết Confession ( Chỉ dành cho Developer )')
                    .addStringOption(option => option
                        .setName('message_id')
                        .setDescription('ID tin nhắn cần chỉnh sửa nội dung')
                        .setRequired(true)
                    )
                    .addStringOption(option => option
                        .setName('channel_id')
                        .setDescription('ID kênh chứa tin nhắn (bỏ trống nếu tin nhắn ở kênh hiện tại)')
                        .setRequired(false)
                    )
                    .addBooleanOption(option => option
                        .setName('input_content')
                        .setDescription('Chọn true để thay đổi nội dung, false bot sẽ tự động chỉnh sửa lại nội dung')
                        .setRequired(false)
                    )
                    .addStringOption(option => option
                        .setName('new_title')
                        .setDescription('Nội dung mới cho tiêu đề (chỉ khi chọn là true)')
                        .setRequired(false)
                        .setMaxLength(150)
                        .setMinLength(10)
                    )
                    .addStringOption(option => option
                        .setName('new_content')
                        .setDescription('Nội dung mới cho tin nhắn (chỉ khi chọn là true)')
                        .setRequired(false)
                        .setMaxLength(2000)
                        .setMinLength(50)
                    )
            )
    )
    .addSubcommandGroup(group =>
                        group
                            .setName(CONFIG_GET)
                            .setDescription('Lấy tùy chọn từ Bot')
                            .addSubcommand(subcommand =>
                                subcommand
                                    .setName(LIST_PENDING)
                                    .setDescription('Lấy danh sách các Confession đang chờ duyệt ( Cần vai trò được chọn hoặc quyền ADMIN )')
                            )
    );
export const execute = asyncErrorHandler(async (interaction) => {
    await interaction.deferReply({ ephemeral: false });
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    switch (group) {
        case CONFIG_PUT:
            switch (subcommand) {
                case CONFIG_SAVEPOINT:
                    return await setSavePoint(interaction);
                case CONFIG_WRITE_OPTIONS:
                    return await setWriteOptions(interaction);
            };
            break;
        case CONFIG_EDIT:
            switch (subcommand) {
                case CONFIG_WRITE_OPTIONS:
                    return await editWriteOptions(interaction);
            };
            break;
        case CONFIG_GET:
            switch (subcommand) {
                case LIST_PENDING:
                    return await getListPending(interaction);
            };
            break;
    };
}, null);