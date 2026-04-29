// createEmbeddings.ts

import fs from "fs";
import path from "path";
import "dotenv/config";
import OpenAI from "openai";
import type { SongChunk } from "../types/SongChunk.js";
import type { EmbeddedSongChunk } from "../types/EmbeddedSongChunk.js";

const BATCH_SAVE_SIZE = 25;

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

    const chunks = readJsonFile<SongChunk[]>(chunksPath);
    const embeddedChunks = loadExistingEmbeddings(embeddingsPath);

    const completedIds = new Set(embeddedChunks.map((chunk) => chunk.id));

    console.log(`Total chunks: ${chunks.length}`);
    console.log(`Already embedded: ${completedIds.size}`);

    let newlyEmbeddedCount = 0;

    for (const chunk of chunks) {
        if (completedIds.has(chunk.id)) {
            continue;
        }

        try {
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

            completedIds.add(chunk.id);
            newlyEmbeddedCount++;

            if (newlyEmbeddedCount % BATCH_SAVE_SIZE === 0) {
                saveEmbeddings(embeddingsPath, embeddedChunks);
                console.log(`Progress saved. Total embedded: ${embeddedChunks.length}`);
            }
        } catch (error) {
            console.error(`Failed while embedding chunk: ${chunk.id}`);
            console.error(`${chunk.metadata.title} - ${chunk.metadata.artist}`);
            console.error(error);

            saveEmbeddings(embeddingsPath, embeddedChunks);
            console.log("Saved progress before exiting.");

            process.exit(1);
        }
    }

    saveEmbeddings(embeddingsPath, embeddedChunks);

    console.log(`Embedding complete.`);
    console.log(`New embeddings created: ${newlyEmbeddedCount}`);
    console.log(`Total embeddings saved: ${embeddedChunks.length}`);
}

function readJsonFile<T>(filePath: string): T {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

function loadExistingEmbeddings(filePath: string): EmbeddedSongChunk[] {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    console.log(`Found existing embeddings file: ${filePath}`);

    return readJsonFile<EmbeddedSongChunk[]>(filePath);
}

function saveEmbeddings(
    filePath: string,
    embeddedChunks: EmbeddedSongChunk[]
): void {
    fs.writeFileSync(filePath, JSON.stringify(embeddedChunks, null, 2), "utf-8");
}

main().catch((error) => {
    console.error("Embedding creation failed.");
    console.error(error);
    process.exit(1);
});