export type Question = {
    question: string;
    effect: Record<string, number>;
};

export type Value = {
    name: string;
    alias: string;
    icons: [string, string];
    labels: [string, string];
    colors: [string, string];
    tiers: string[];
};

export type Ideology = {
    name: string;
    stats: Record<string, number>;
    score: number;
};

export type CanvasParams = {
    bg: string;
    fg: string;
    version: string;
}

declare global {
    interface Window {
        VERSION: string;
    }
}