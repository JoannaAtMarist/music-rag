// fileWalker.ts
// finds music files inside a folder

import fs from "fs";
import path from "path";

const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".flac", ".wav", ".aac"];

export function findAudioFiles(folderPath: string): string[] {
    const results: string[] = [];

    const items = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(folderPath, item.name);

        if (item.isDirectory()) {
            const nestedFiles = findAudioFiles(fullPath);
            results.push(...nestedFiles);
        }

        if (item.isFile()) {
            const extension = path.extname(item.name).toLowerCase();

            if (AUDIO_EXTENSIONS.includes(extension)) {
                results.push(fullPath);
            }
        }
    }

    return results;
}