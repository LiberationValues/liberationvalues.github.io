import { themeChange } from "./common.js"
import type { Question } from "./types.d.ts";

themeChange("theme-toggle");

function tlArr2toRecord(pv: Record<string, number>, cv: [string, number][]) {
    const reduced = {} as Record<string, number>;
    for (const [k, v] of cv) {
        reduced[k] = v + (pv[k] ?? 0);
    }
    return reduced;
}


class Quiz {
    private questions: Question[];
    private _index = 0;
    private weights: number[] = [];
    constructor(questions: Question[]) {
        this.questions = questions;
    }

    get index(): number {
        return this._index + 1;
    }

    get size(): number {
        return this.questions.length;
    }

    get text(): string {
        return this.questions[this._index].question;
    }

    nextQuestion(weight: number): string | null {
        this.weights[this._index] = weight;
        if (this._index < this.questions.length - 1) {
            return this.questions[++this._index].question;
        }
        return null;
    }

    previousQuestion(): string | null {
        if (this._index > 0) {
            return this.questions[--this._index].question;
        }
        return null;
    }

    calculateScores(): string {
        const scores = this.questions
            .map((x, i) => {
                const entries = Array.from(Object.entries(x.effect));
                const weight = this.weights[i];
                return entries.map(e => [e[0], e[1] * weight]) as [string, number][];
            })
            .reduce(tlArr2toRecord, {} as Record<string, number>);

        const maxScores = this.questions
            .map((x, i) => {
                const entries = Array.from(Object.entries(x.effect));
                return entries.map(e => [e[0], Math.abs(e[1])]) as [string, number][];
            })
            .reduce(tlArr2toRecord, {} as Record<string, number>);

        const balancedScores = {} as Record<string, string>;
        for (const [k, score] of Object.entries(scores)) {
            const max = maxScores[k];
            const value = (100 * (max + score)) / (2 * max);
            balancedScores[k] = value.toFixed(1);
        }

        const params = new URLSearchParams(balancedScores);
        return "results.html?" + params.toString();
    }
}

const questions: Question[] = await (await fetch("./dist/questions.json")).json();
const quiz = new Quiz(questions);

const questionText = <HTMLParagraphElement>document.getElementById("question-text")!;
const questionNumber = <HTMLHeadingElement>document.getElementById("question-number")!;
function updateQuestion(text: string) {
    questionText.textContent = text;
    questionNumber.textContent = `Question ${quiz.index} of ${quiz.size}`;
}

for (let i = 0; i < 7; i++) {
    const button = document.getElementById("button-" + i.toString());
    if (!button) continue;

    const weight = 1 - ((1 / 3) * i);
    button.addEventListener<"click">("click", () => {
        const answer = quiz.nextQuestion(weight);
        if (answer) {
            updateQuestion(answer);
        } else {
            location.href = quiz.calculateScores();
        }
    });
}

document.getElementById("back-button")?.addEventListener<"click">("click", () => {
    const answer = quiz.previousQuestion();
    if (answer) {
        updateQuestion(answer);
    } else {
        window.history.back();
    }
});

questionText.addEventListener("click", () => {
    const minHeight = questionText.style.minHeight;
    const newheight = minHeight === "255pt" ? "150pt" : "255pt";
    questionText.style.minHeight = newheight;
});

updateQuestion(quiz.text);