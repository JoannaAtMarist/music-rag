// VisualizationPoint.ts

export type VisualizationPoint = {
    id: string;
    songId: string;

    title: string;
    artist: string;
    album: string;
    genre: string[];
    year: number | null;

    x: number;
    y: number;
};