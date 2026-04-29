// extractMetadata.ts
// reads the tags from one music file

import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";
import type { Song } from "../types/Song.js";
import { safeFileName } from "../utilities/pathHelpers.js";

export async function extractMetadata(filePath: string): Promise<Song> {
  const metadata = await parseFile(filePath);

  const fileName = path.basename(filePath);

  const title = metadata.common.title ?? "Unknown Title";
  const artist = metadata.common.artist ?? "Unknown Artist";
  const album = metadata.common.album ?? "Unknown Album";

  const albumArtist = metadata.common.albumartist ?? "Unknown Album Artist";
  const composer = metadata.common.composer?.[0] ?? "Unknown Composer";

  const genre = metadata.common.genre ?? [];

  const year = metadata.common.year ?? null;
  const trackNumber = metadata.common.track.no ?? null;
  const discNumber = metadata.common.disk.no ?? null;
  const durationSeconds = metadata.format.duration ?? null;

  const grouping = metadata.common.grouping?.[0] ?? "None";
  const comment = metadata.common.comment?.[0] ?? "";

  const picture = metadata.common.picture?.[0] ?? null;
  const hasArtwork = Boolean(picture);

  const id = createSongId(filePath);

  const artworkPath = picture
    ? saveArtwork(picture.data, picture.format, artist, album)
    : null;

  return {
    id,
    filePath,
    fileName,

    title,
    artist,
    album,

    albumArtist,
    composer,

    genre,

    year,
    trackNumber,
    discNumber,

    durationSeconds,

    grouping,
    // comment,

    hasArtwork,
    artworkPath,
  };
}

function createSongId(filePath: string): string {
  return Buffer.from(filePath).toString("base64url");
}

function saveArtwork(
  imageData: Uint8Array,
  imageFormat: string,
  artist: string,
  album: string
): string {
  const artworkFolder = path.join(process.cwd(), "data", "artwork");

  if (!fs.existsSync(artworkFolder)) {
    fs.mkdirSync(artworkFolder, { recursive: true });
  }

  const extension = getArtworkExtension(imageFormat);

  const fileName = safeFileName(`${artist} - ${album}.${extension}`);
  const fullArtworkPath = path.join(artworkFolder, fileName);

  if (!fs.existsSync(fullArtworkPath)) {
    fs.writeFileSync(fullArtworkPath, imageData);
  }

  return path.join("data", "artwork", fileName);
}

function getArtworkExtension(imageFormat: string): string {
  if (imageFormat.includes("png")) {
    return "png";
  }

  if (imageFormat.includes("webp")) {
    return "webp";
  }

  return "jpg";
}