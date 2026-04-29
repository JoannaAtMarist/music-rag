// createVisualizationData.ts

import fs from "fs";
import path from "path";
import { PCA } from "ml-pca";
import type { EmbeddedSongChunk } from "../types/EmbeddedSongChunk.js";
import type { VisualizationPoint } from "../types/VisualizationPoint.js";

function main(): void {
    const embeddingsPath = path.join(process.cwd(), "data", "embeddings.json");
    const outputPath = path.join(process.cwd(), "data", "visualization.json");

    if (!fs.existsSync(embeddingsPath)) {
        console.error(`Could not find embeddings file at: ${embeddingsPath}`);
        process.exit(1);
    }

    const embeddedSongs = readJsonFile<EmbeddedSongChunk[]>(embeddingsPath);

    if (embeddedSongs.length < 2) {
        console.error("Need at least 2 embedded songs to create a visualization.");
        process.exit(1);
    }

    console.log(`Loaded ${embeddedSongs.length} embedded songs.`);

    const embeddingMatrix = embeddedSongs.map((item) => item.embedding);

    const pca = new PCA(embeddingMatrix);
    const reduced = pca.predict(embeddingMatrix, { nComponents: 2 });

    const rows = reduced.to2DArray();

    const points: VisualizationPoint[] = embeddedSongs.map((item, index) => {
        const song = item.metadata;
        const row = rows[index];

        return {
            id: item.id,
            songId: item.songId,

            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            year: song.year,

            x: row[0],
            y: row[1],
        };
    });

    fs.writeFileSync(outputPath, JSON.stringify(points, null, 2), "utf-8");

    console.log(`Created ${points.length} visualization points.`);
    console.log(`Saved visualization data to: ${outputPath}`);
}

function readJsonFile<T>(filePath: string): T {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

main();