import fs from "fs";
import path from "path";
import "dotenv/config";
import OpenAI from "openai";
import type { EmbeddedSongChunk } from "../types/EmbeddedSongChunk.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main(): Promise<void> {
    const query = process.argv.slice(2).join(" ");

    if (!query) {
        console.error('Please provide a search query.');
        console.error('Example: npm run search -- "mellow 70s rock"');
        process.exit(1);
    }

    const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";
    const embeddingsPath = path.join(process.cwd(), "data", "embeddings.json");

    if (!fs.existsSync(embeddingsPath)) {
        console.error(`Could not find embeddings file at: ${embeddingsPath}`);
        process.exit(1);
    }

    const embeddedSongs = readJsonFile<EmbeddedSongChunk[]>(embeddingsPath);

    console.log(`Searching ${embeddedSongs.length} songs...`);
    console.log(`Query: ${query}`);
    console.log("");

    const queryEmbedding = await createQueryEmbedding(query, model);

    const results = embeddedSongs
        .map((song) => {
            return {
                song,
                score: cosineSimilarity(queryEmbedding, song.embedding),
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    console.log("Top matches:");

    results.forEach((result, index) => {
        const song = result.song.metadata;

        console.log(
            `${index + 1}. ${song.title} - ${song.artist} (${song.album}, ${song.year ?? "Unknown Year"})`
        );

        console.log(`   Genre: ${song.genre.join(", ") || "Unknown Genre"}`);
        console.log(`   Score: ${result.score.toFixed(4)}`);
        console.log("");
    });
}

async function createQueryEmbedding(
    query: string,
    model: string
): Promise<number[]> {
    const response = await client.embeddings.create({
        model,
        input: query,
    });

    const embedding = response.data[0]?.embedding;

    if (!embedding) {
        throw new Error("No embedding returned for search query.");
    }

    return embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error("Embedding vectors must have the same length.");
    }

    let dotProduct = 0;
    let lengthA = 0;
    let lengthB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        lengthA += a[i] * a[i];
        lengthB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
}

function readJsonFile<T>(filePath: string): T {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
}

main().catch((error) => {
    console.error("Search failed.");
    console.error(error);
    process.exit(1);
});