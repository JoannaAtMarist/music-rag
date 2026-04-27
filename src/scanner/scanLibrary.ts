// scanLibrary.ts
// ties everything together

import { findAudioFiles } from "../utilities/fileWalker.js";
import { extractMetadata } from "./extractMetadata.js";
import { saveLibrary } from "./saveLibrary.js";
import { Song } from "../types/Song.js";

async function main(): Promise<void> {
    const musicFolder = process.argv[2];

    if (!musicFolder) {
        console.error("Please provide a music folder path.");
        console.error("Example: npm run scan -- /Users/joanna/Music");
        process.exit(1);
    }

    console.log(`Scanning folder: ${musicFolder}`);

    const audioFiles = findAudioFiles(musicFolder);

    console.log(`Found ${audioFiles.length} audio files.`);

    const songs: Song[] = [];

    for (const filePath of audioFiles) {
        try {
            console.log(`Reading: ${filePath}`);

            const song = await extractMetadata(filePath);
            songs.push(song);
        } catch (error) {
            console.error(`Could not read metadata for: ${filePath}`);
            console.error(error);
        }
    }

    saveLibrary(songs);
}

main();