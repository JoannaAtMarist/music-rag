// Song.ts
// The shape of one song

export type Song = {
    id: string;
    filePath: string;
    fileName: string;

    title: string;
    artist: string;
    album: string;

    albumArtist: string;
    composer: string;

    genre: string[];

    year: number | null;
    trackNumber: number | null;
    discNumber: number | null;

    durationSeconds: number | null;

    grouping: string;
    //comment: string;

    hasArtwork: boolean;
    artworkPath: string | null;
};