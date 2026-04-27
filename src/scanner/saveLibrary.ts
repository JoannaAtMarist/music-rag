// saveLibrary.ts
// saves all scanned songs into data/library.json

import fs from "fs";
import path from "path";
import { Song } from "../types/Song.js";

export function saveLibrary(songs: Song[]): void {
  const dataFolder = path.join(process.cwd(), "data");
  const outputPath = path.join(dataFolder, "library.json");

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  const json = JSON.stringify(songs, null, 2);

  fs.writeFileSync(outputPath, json, "utf-8");

  console.log(`Saved ${songs.length} songs to ${outputPath}`);
}