// SongChunk.ts

import type { Song } from "./Song.js";

export type SongChunk = {
    id: string;
    songId: string;
    text: string;
    metadata: Song;
};