import fs from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { asyncErrorHandler } from "../middlewares/errorHandler.js";

export const loadCommands = asyncErrorHandler(async ({ client, folders, targetMap }) => {
    for (const folder of folders) {
        const folderPath = path.join(process.cwd(), folder);
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const handler = await import(pathToFileURL(filePath).href);
            const exported = handler.default ?? handler;
            if (exported.name) {
                targetMap.set(exported.name, exported);
            };
        };
    };
});
export const loadEvent = asyncErrorHandler(async (client) => {
    const eventsPath = path.join(process.cwd(), 'source/events');
    const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const eventModule = await import(pathToFileURL(filePath).href);
        const event = eventModule.default ?? eventModule;
        if (event.name && typeof event.execute === 'function') {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            };
        };
    };
});