// EmbeddedSongChunk.ts

import type { SongChunk } from "./SongChunk.js";

export type EmbeddedSongChunk = SongChunk & {
    embedding: number[];
};