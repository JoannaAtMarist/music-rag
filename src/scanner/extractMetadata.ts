// extractMetadata.ts
// reads the tags from one music file

import path from "path";
import { parseFile } from "music-metadata";
import { Song } from "../types/Song.js";

export async function extractMetadata(filePath: string): Promise<Song> {
  const metadata = await parseFile(filePath);

  const fileName = path.basename(filePath);

  const title = metadata.common.title ?? "Unknown Title";
  const artist = metadata.common.artist ?? "Unknown Artist";
  const album = metadata.common.album ?? "Unknown Album";
  const genre = metadata.common.genre ?? [];

  const year = metadata.common.year ?? null;
  const trackNumber = metadata.common.track.no ?? null;
  const durationSeconds = metadata.format.duration ?? null;

  const hasArtwork = Boolean(metadata.common.picture?.length);

  const id = createSongId(filePath);

  return {
    id,
    filePath,
    fileName,
    title,
    artist,
    album,
    genre,
    year,
    trackNumber,
    durationSeconds,
    hasArtwork,
    artworkPath: null,
  };
}

function createSongId(filePath: string): string {
  return Buffer.from(filePath).toString("base64url");
}