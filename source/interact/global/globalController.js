import { asyncErrorHandler } from "../../middlewares/errorHandler.js";
import { embedNotificationDefault } from "../../utilities/embed.js";
import { GLOBAL_ALL_LIST, GLOBAL_ANONYMOUS_REPLY, GLOBAL_CFS_ACCEPT, GLOBAL_CFS_PENDING, GLOBAL_CFS_REFUSE, GLOBAL_LIST, GLOBAL_REPLY } from "../config/nametag.js";
import { allAnonymousReply } from "./services/allAnonymousReply.js";
import { globalReply } from "./services/globalReply.js";
import { listAccept } from "./services/listAccept.js";
import { listALLCFS } from "./services/listAllCFS.js";
import { listAnonymousReplyService } from "./services/listAnonymousReply.js";
import { listPending } from "./services/listPending.js";
import { listRefuse } from "./services/listRefuse.js";

export const globalController = asyncErrorHandler(async (interaction, global, command) => {
    let handle = {
        flag: false,
        title: "Controller Error.",
        description: "No processing path found.",
        color: 0xFF0000
    };
    switch (global) {
        case GLOBAL_LIST:
            switch (command) {
                case GLOBAL_CFS_ACCEPT:
                    handle = await listAccept(interaction);
                    break;
                case GLOBAL_CFS_REFUSE:
                    handle = await listRefuse(interaction);
                    break;
                case GLOBAL_CFS_PENDING:
                    handle = await listPending(interaction);
                    break;
                case GLOBAL_ANONYMOUS_REPLY:
                    handle = await listAnonymousReplyService(interaction);
                    break;
            };
            break;
        case GLOBAL_ALL_LIST:
            switch (command) {
                case GLOBAL_CFS_ACCEPT:
                    handle = await listALLCFS(interaction, GLOBAL_CFS_ACCEPT);
                    break;
                case GLOBAL_CFS_REFUSE:
                    handle = await listALLCFS(interaction, GLOBAL_CFS_REFUSE);
                    break;
                case GLOBAL_CFS_PENDING:
                    handle = await listALLCFS(interaction, GLOBAL_CFS_PENDING);
                    break;
                case GLOBAL_ANONYMOUS_REPLY:
                    handle = await allAnonymousReply(interaction);
                    break;
            };
        default:
            switch (command) {
                case GLOBAL_REPLY:
                    handle = await globalReply(interaction);
                    break;
            };
            break;
    };
    if (handle.flag === true) {
        const components = Array.isArray(handle.buttons)
            ? handle.buttons : (handle.buttons ? [handle.buttons] : []);
        await interaction.editReply({
            content: ``,
            embeds: [handle.embed],
            components,
        });
    } else {
        await interaction.editReply({
            content: ``,
            embeds: [embedNotificationDefault(
                `❌ ${handle.title}`,
                `${handle.description}`,
                handle.color
            )],
        });
    };
}, null);