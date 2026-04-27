// Song.ts
// The shape of one song

export type Song = {
    id: string;
    filePath: string;
    fileName: string;

    title: string;
    artist: string;
    album: string;
    genre: string[];

    year: number | null;
    trackNumber: number | null;
    durationSeconds: number | null;

    hasArtwork: boolean;
    artworkPath: string |null;
};