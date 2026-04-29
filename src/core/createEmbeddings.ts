// createEmbeddings.ts

import fs from "fs";
import path from "path";
import "dotenv/config";
import OpenAI from "openai";
import type { SongChunk } from "../types/SongChunk.js";
import type { EmbeddedSongChunk } from "../types/EmbeddedSongChunk.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main(): Promise<void> {
    const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

    const chunksPath = path.join(process.cwd(), "data", "chunks.json");
    const embeddingsPath = path.join(process.cwd(), "data", "embeddings.json");

    if (!fs.existsSync(chunksPath)) {
        console.error(`Could not find chunks file at: ${chunksPath}`);
        process.exit(1);
    }

    const rawChunks = fs.readFileSync(chunksPath, "utf-8");
    const chunks = JSON.parse(rawChunks) as SongChunk[];

    const embeddedChunks: EmbeddedSongChunk[] = [];

    for (const chunk of chunks) {
        console.log(`Embedding: ${chunk.metadata.title} - ${chunk.metadata.artist}`);

        const response = await client.embeddings.create({
            model,
            input: chunk.text,
        });

        const embedding = response.data[0]?.embedding;

        if (!embedding) {
            console.warn(`No embedding returned for chunk: ${chunk.id}`);
            continue;
        }

        embeddedChunks.push({
            ...chunk,
            embedding,
        });
    }

    fs.writeFileSync(
        embeddingsPath,
        JSON.stringify(embeddedChunks, null, 2),
        "utf-8"
    );

    console.log(`Created ${embeddedChunks.length} embeddings.`);
    console.log(`Saved embeddings to: ${embeddingsPath}`);
}

main().catch((error) => {
    console.error("Embedding creation failed.");
    console.error(error);
    process.exit(1);
});