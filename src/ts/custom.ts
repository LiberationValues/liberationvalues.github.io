import { themeChange, Canvas, findTier, currentTheme } from "./common.js";
import type { CanvasParams, Value } from "./types.d.ts";

function between(val: number, bound1: number, bound2: number): boolean {
    if (val < bound1) {
        return false;
    }

    if (val > bound2) {
        return false;
    }

    return true;
}

function divMod(numerator: number, denominator: number): [q: number, r: number] {
    const remainder = numerator % denominator;
    const quotient = Math.floor(numerator / denominator);

    return [quotient, remainder];
}

class TouchCanvas extends Canvas {
    name: string;
    state: number[];
    values: Value[];
    canvas: HTMLCanvasElement;
    touchEv: (ev: MouseEvent) => any;
    constructor(
        canvas: HTMLCanvasElement, params: CanvasParams, values: Value[],
        state: number[] | null = null, name: string | null = null) {
        super(canvas, params);
        this.canvas = canvas;

        this.touchEv = (ev: MouseEvent) => this.touchEvent(ev);
        this.canvas.addEventListener("click", this.touchEv);

        this.state = state ?? Array(7).fill(50);
        this.name = name ?? "Touch to enter custom name";

        this.values = values;
        this.drawAll(true);
    }

    // Removes unused event listner
    // WARNING: ALWAYS MANUALLY CALL WHEN OBJECT GETS REMOVED!
    // NOT CALLING THIS WILL RESULT IN A MEMORY LEAK
    destructor(): void {
        this.canvas.removeEventListener("click", this.touchEv);
    }

    // Future TS versions will add a destructor global symbol that triggers
    // once the object is out of scope, based on the following TC39 proposal:
    // https://github.com/tc39/proposal-explicit-resource-management#additions-to-symbol
    // [Symbol.dispose]() {
    //     this.destructor();
    // }

    toJSON(): { color: string; state: number[]; name: string; time: Date; } {
        return {
            color: this.params.bg === "#EEE" ? "light" : "dark",
            state: this.state,
            name: this.name,
            time: new Date()
        };
    }

    clear(): void {
        this.ctx.fillStyle = this.params.bg;
        this.ctx.fillRect(0, 0, 800, 170);

        for (let i = 0; i < 7; i++) {
            const height = 150 + 120 * i;
            this.ctx.fillRect(120, height, 562, 30);
        }
    }

    async drawAll(drawImages = false): Promise<void> {
        this.clear();
        this.drawHeader(this.name, "custom");

        for (const [i, val] of this.values.entries()) {
            const score = this.state[i];
            const tier = findTier(score, val.tiers);

            await this.drawAxis(val, score, i, tier, drawImages);
        }
    }

    async touchEvent(ev: MouseEvent): Promise<void> {
        const target = <HTMLCanvasElement>ev.target;
        const rect = target.getBoundingClientRect();

        const relX = ev.clientX - rect.left;
        const relY = ev.clientY - rect.top;

        const renderedWidth = rect.right - rect.left;
        const renderedHeight = rect.top - rect.bottom;

        const x = Math.round(relX / (renderedWidth / 800));
        const y = - Math.round(relY / (renderedHeight / 1000));

        // Clicked header name
        if (between(y, 90, 148)) {
            const res = prompt("Insert the desired username", this.name);

            if (res) {
                this.name = res;
            }

            await this.drawAll();
            return;
        }

        // Clicked body axis
        if (y > 180 && between(x, 120, 682)) {
            const adjY = y - 180;
            const [i, r] = divMod(adjY, 120);

            if (r > 80) {
                return;
            }

            const xRatio = (x - 120) / 562;
            const adjX = Math.round(xRatio * 20) * 5;

            this.state[i] = adjX;

            await this.drawAll();
            return;
        }

        // Clicked left icons
        if (y > 170 && between(x, 20, 120)) {
            const adjY = y - 170;
            const [i, r] = divMod(adjY, 120);

            if (r > 100) {
                return;
            }

            const curr = this.state[i];

            if (curr <= 95) {
                this.state[i] += 5;
            }

            await this.drawAll();
            return;
        }

        // Clicked right icons
        if (y > 170 && between(x, 680, 780)) {
            const adjY = y - 170;
            const [i, r] = divMod(adjY, 120);

            if (r > 100) {
                return;
            }

            const curr = this.state[i];

            if (curr >= 5) {
                this.state[i] -= 5;
            }

            await this.drawAll();
            return;
        }

    }
}

function getParams(): CanvasParams {
    const [bg, fg] = currentTheme() === "dark" ? ["#141414", "#EEE"] : ["#EEE", "#141414"];

    return {
        bg, fg,
        version: window.VERSION
    };
}

const canvasElm = <HTMLCanvasElement>document.getElementById("custom");
const values = await (await fetch("./dist/values.json")).json() as Value[];
let canvas: TouchCanvas;

// Objects for checking if old object is getting destroyed properly
let lastRef: WeakRef<TouchCanvas>;
const gcRun = new FinalizationRegistry((val) => {
    console.info("Destroyed: ", val);
});

function reloadCanvas(): void {
    let oldName: string | null = null;
    let oldState: number[] | null = null;

    if (canvas) {
        oldName = canvas.name;
        oldState = canvas.state;

        canvas.destructor();

        // Registering the object in the destruction loggers
        {
            console.info("Oldref: ", lastRef?.deref() ?? "GCed/unassigned")
            lastRef = new WeakRef(canvas);
            gcRun.register(canvas, JSON.stringify(canvas), canvas);
        }
    }

    canvas = new TouchCanvas(canvasElm, getParams(), values, oldState, oldName);
}

window.addEventListener("load", reloadCanvas);

themeChange("theme-toggle", reloadCanvas);

setTimeout(() => {
    const event = new Event("load");
    window.dispatchEvent(event);
}, 1000);

const downloadButton = <HTMLButtonElement>document.getElementById("download");
downloadButton.addEventListener("click", () => {
    Canvas.downloadCanvas(canvasElm);
});