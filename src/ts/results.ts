import { themeChange, currentTheme, Canvas, orderScores, findTier } from "./common.js";
import type { Value, Ideology, CanvasParams } from "./types.d.ts"

const [values, ideologies] = await Promise.all(
    (await Promise.all([
        fetch("./dist/values.json"), fetch("./dist/ideologies.json")
    ])).map(x => x.json())
) as [Value[], Ideology[]];

const params = new URLSearchParams(location.search);

const parsedScores = new Map<string, number>();
for (const value of values) {
    const scoreStr = params.get(value.alias);
    if (!scoreStr) {
        throw new Error(`Missing value ${value.name}`);
    }

    const score = parseFloat(scoreStr);
    if (isNaN(score) || score > 100 || score < 0) {
        throw new Error(`Invalid score for ${value.name}: ${score}`);
    }

    parsedScores.set(value.alias, score);
}

function fillScores() {
    const theme = currentTheme();
    const [bg, fg] = theme === "dark" ? ["#141414", "#EEE"] : ["#EEE", "#141414"];
    const canvasParams: CanvasParams = {
        bg, fg,
        version: window.VERSION
    };

    const canvasElm = <HTMLCanvasElement>document.getElementById("results")!;
    const canvas = new Canvas(canvasElm, canvasParams);

    const orderedScores = orderScores(parsedScores, ideologies)

    const match = orderedScores[0].name;
    canvas.drawHeader(match);
    document.getElementById("ideology-label")!.textContent = match;

    const fillElm = (name: string, score: number) => {
        const elm = document.getElementById("span-" + name);
        const outElm = document.getElementById("bar-" + name);
        if (!elm || !outElm) return;

        const value = score.toFixed(1) + "%";
        elm.textContent = value;
        outElm.style.width = value;

        if (elm.offsetWidth + 20 > outElm.offsetWidth) {
            elm.style.visibility = "hidden";
        }
    };


    for (const [index, value] of values.entries()) {
        const score = parsedScores.get(value.alias)!
        const label = findTier(score, value.tiers);
        canvas.drawAxis(value, score, index, label);

        const names = value.labels.map(x => x.toLowerCase());
        fillElm(names[0], score);
        fillElm(names[1], (100 - score));

        document.getElementById(value.name.toLowerCase() + "-label")!
            .textContent = label;
    }
}

themeChange("theme-toggle", fillScores);

window.addEventListener("load", fillScores);

document.getElementById("download-button")?.addEventListener("click", () => {
    Canvas.downloadCanvas(<HTMLCanvasElement>document.getElementById("results")!);
});

setTimeout(() => {
    const event = new Event("load");
    window.dispatchEvent(event);
}, 1000);