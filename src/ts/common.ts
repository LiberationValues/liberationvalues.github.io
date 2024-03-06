import type { Value, CanvasParams, Ideology } from "./types.d.ts"
type Theme = "light" | "dark";

export function currentTheme(): Theme {
    const color = document.documentElement.getAttribute("theme-override");
    if (color) {
        return color as Theme;
    }
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dark ? "dark" : "light";
}

function toggleTheme() {
    const current = currentTheme();
    const newTheme: Theme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("theme-override", newTheme);
    localStorage.setItem("theme-override", newTheme);
}

export function themeChange(id: string, event: (() => void) | null = null) {
    const pref = localStorage.getItem("theme-override") as Theme | null;
    if (pref) {
        document.documentElement.setAttribute("theme-override", pref);
    }

    const darkThemeMatch = window.matchMedia("(prefers-color-scheme: dark)");
    const global: Theme = darkThemeMatch.matches ? "dark" : "light";
    const color = pref ?? global;

    const elm = <HTMLInputElement>document.getElementById(id);
    if (elm) {
        elm.checked = color === "dark";
        elm.addEventListener("change", toggleTheme);

        darkThemeMatch.addEventListener("change", () => {
            const newTheme = currentTheme();
            elm.checked = newTheme === "dark";
        });

        if (event) {
            elm.addEventListener("change", event);
        }
    }
    if (event) {
        darkThemeMatch.addEventListener("change", event);
    }
}

export class Canvas {
    ctx: CanvasRenderingContext2D;
    params: CanvasParams;
    constructor(canvas: HTMLCanvasElement, params: CanvasParams) {
        canvas.width = 800;
        canvas.height = 1000;
        this.ctx = canvas.getContext("2d")!;
        this.params = params;
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, 800, 1000);
    }

    static loadImage(name: string): Promise<HTMLImageElement> {
        const image = new Image();
        image.src = "./assets/values/" + name;
        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", reject);
        });
    }

    drawHeader(match: string, extra: string | null = null): void {
        this.ctx.fillStyle = this.params.fg;
        this.ctx.font = "700 60px Montserrat, sans-serif";
        this.ctx.textAlign = "left";
        this.ctx.fillText("LiberationValues", 20, 90);

        this.ctx.font = "50px Montserrat, sans-serif";
        this.ctx.fillText(match, 20, 140);

        this.ctx.textAlign = "right";
        this.ctx.font = "300 25px Montserrat, sans-serif";
        this.ctx.fillText("liberationvalues.github.io", 780, 40);
        this.ctx.fillText(this.params.version, 780, 70);
        if (extra) {
            this.ctx.fillText(extra, 780, 100);
        }
    }

    async drawAxis(value: Value, score: number, index: number, label: string, drawImages = true): Promise<void> {
        const height = 184 + 120 * index;

        //Draw images
        if (drawImages) {
            const [left, right] = await Promise.all(value.icons.map(Canvas.loadImage));
            this.ctx.drawImage(left, 20, height - 14, 100, 100);
            this.ctx.drawImage(right, 680, height - 14, 100, 100);
        }

        //Draw BG
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(120, height - 4, 560, 80);

        //Draw left bar
        this.ctx.fillStyle = value.colors[0];
        this.ctx.fillRect(120, height, 5.6 * score - 2, 72);
        //Draw tight bar
        this.ctx.fillStyle = value.colors[1];
        const invScore = 100 - score;
        this.ctx.fillRect(682 - 5.6 * invScore, height, 5.6 * invScore - 2, 72);

        //Draw left and right scores
        this.ctx.fillStyle = "#222";
        this.ctx.font = "50px Montserrat, sans-serif";
        const valHeight = height + 53.5;

        if (score > 30) {
            this.ctx.textAlign = "left";
            this.ctx.fillText(score.toFixed(1) + "%", 130, valHeight);
        }

        if (invScore > 30) {
            this.ctx.textAlign = "right";
            this.ctx.fillText(invScore.toFixed(1) + "%", 670, valHeight);
        }

        //Draw label
        const tierLabel = `${value.name} Axis: ${label}`;
        this.ctx.fillStyle = this.params.fg;
        this.ctx.textAlign = "center";
        this.ctx.font = "300 25px Montserrat, Roboto, sans-serif";
        this.ctx.fillText(tierLabel, 400, height - 9);
    }

    static downloadCanvas(canvas: HTMLCanvasElement): void {
        const now = new Date();
        const time = [
            now.getHours(),
            now.getMinutes(),
            now.getDate(),
            now.getMonth() + 1,
            now.getFullYear()
        ].map(x => x.toFixed()).join("-");

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `LiberationValues-${time}.png`;
        link.click();
    }
}

export function orderScores(scores: Map<string, number>, ideologies: Ideology[])
    : Ideology[] {
    for (const ideology of ideologies) {
        let sum = 0;
        for (const [k, v] of scores) {
            sum += Math.abs(v - ideology.stats[k]);
        }
        ideology.score = sum / scores.size;
    }

    return ideologies.sort((a, b) => a.score! - b.score!);
}

export function findTier(score: number, labels: string[]): string {
    const tiers = [90, 75, 60, 40, 25, 10, 0];
    for (const [i, v] of tiers.entries()) {
        if (score >= v && score < (tiers[i - 1] ?? 100.1)) {
            return labels[i];
        }
    }
    return "";
}