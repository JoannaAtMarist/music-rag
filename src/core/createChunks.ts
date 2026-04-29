// createChunks.ts
// reads library.json
// turns each song into a text description

import fs from "fs";
import path from "path";
import type { Song } from "../types/Song.js";
import type { SongChunk } from "../types/SongChunk.js";

function main(): void {
    const libraryPath = path.join(process.cwd(), "data", "library.json");
    const chunksPath = path.join(process.cwd(), "data", "chunks.json");

    if (!fs.existsSync(libraryPath)) {
        console.error(`Could not find library file at: ${libraryPath}`);
        process.exit(1);
    }

    const rawLibrary = fs.readFileSync(libraryPath, "utf-8");
    const songs = JSON.parse(rawLibrary) as Song[];

    const chunks: SongChunk[] = songs.map((song) => {
        return {
            id: `chunk-${song.id}`,
            songId: song.id,
            text: buildSongText(song),
            metadata: song,
        };
    });

    fs.writeFileSync(chunksPath, JSON.stringify(chunks, null, 2), "utf-8");

    console.log(`Created ${chunks.length} chunks.`);
    console.log(`Saved chunks to: ${chunksPath}`);
}

function buildSongText(song: Song): string {
    const genreText = song.genre.length > 0 ? song.genre.join(", ") : "Unknown Genre";

    const parts = [
        `Song title: ${song.title}`,
        `Artist: ${song.artist}`,
        `Album: ${song.album}`,
        `Album artist: ${song.albumArtist}`,
        `Composer: ${song.composer}`,
        `Genre: ${genreText}`,
        `Year: ${song.year ?? "Unknown Year"}`,
    ];

    if (song.grouping && song.grouping !== "None") {
        parts.push(`Grouping: ${song.grouping}`);
    }

    // if (song.comment) {
    //     parts.push(`Comment: ${song.comment}`);
    // }

    return parts.join("\n");
}

main();