import * as pug from "pug";
import * as terser from "terser";
import { Dirent, promises as fs } from "fs";

const version = process.env.npm_package_version ?? "0.0.0";
const url = process.env.npm_package_homepage ?? "github.com";

const minify = process.argv.some(x => x.toLowerCase() === "--minify");
const deleteFiles = process.argv.some(x => x.toLowerCase() === "--delete");

const pugDirName = "./src/pug/";
const jsonDirName = "./src/json/";
const distDirName = "./dist/";

const [pugDir, jsonDir, distDir] = await Promise.all(
    [
        fs.readdir(pugDirName, { withFileTypes: true }),
        fs.readdir(jsonDirName, { withFileTypes: true }),
        fs.readdir(distDirName, { withFileTypes: true })
    ]
);

function promiseWrap<T>(name: string, promise: Promise<T>): Promise<[string, T]> {
    return new Promise<[string, T]>((resolve, reject) => {
        promise.then(x => resolve([name, x]));
        promise.catch(reject);
    });
}

function tlToRecord<T>(tupleList: [string, T][]): Record<string, T> {
    return tupleList.reduce(
        (pv, cv) => ({ ...pv, [cv[0]]: cv[1] }),
        {} as Record<string, T>
    );
}

async function getFileTl(files: Dirent[], dir: string, ext: string):
    Promise<[string, Buffer][]> {
    const promises = files
        .filter(x => x.name.split(".").at(-1) === ext)
        .map(x => promiseWrap(x.name, fs.readFile(dir + x.name)));

    return Promise.all(promises);
}

const jsonList = await getFileTl(jsonDir, jsonDirName, "json");
const jsList = await getFileTl(distDir, distDirName, "js");

const jsonRecord = tlToRecord<any>(
    jsonList.map(x => [x[0], JSON.parse(x[1].toString("utf-8"))])
);

const terserParams: terser.MinifyOptions = {
    compress: {
        ecma: 2020
    },
    module: true,
    toplevel: true
};

const jsRecord = minify ? tlToRecord<string>(
    (await Promise.all(
        jsList.map(x => {
            const minified = terser.minify(
                x[1].toString("utf-8"), terserParams
            );

            return promiseWrap<terser.MinifyOutput>(x[0], minified);
        }))).map(x => {
            const code = x[1].code?.replace("./common.js", "./dist/common.js");

            return [x[0], code ?? ""]
        })
) : null;

const pugParams = {
    version: version,
    url: url,
    inlineJS: minify,
    js: jsRecord,
    questionLength: jsonRecord["questions.json"]?.length ?? 0,
    params: jsonRecord["params.json"] ?? {}
};


pugDir.forEach(async (x) => {
    if (x.name.endsWith(".pug")) {
        const filepath = pugDirName + x.name;
        const html = pug.renderFile(filepath, pugParams) + "\n";
        const name = x.name.replace("pug", "html");
        await fs.writeFile("./" + name, html);
    }
});

const valuesJSONraw = jsonRecord["params.json"].axis as Record<string, string[]>[];
jsonRecord["values.json"] = valuesJSONraw.map((x) => {
    const value = structuredClone(x);
    delete value.desc;
    return value;
});

const jsKeep = ["common.js"];
const jsonExclude = ["params.json"];

for (const [name, file] of Object.entries(jsonRecord)) {
    if (jsonExclude.includes(name)) {
        continue;
    }
    const stringified = JSON.stringify(file);
    await fs.writeFile(distDirName + name, stringified);
}


if (minify) {
    for (const file of jsKeep) {
        const js = jsRecord![file];
        if (!js) {
            throw new Error(`Invalid file: ${file}`);
        }
        await fs.writeFile(distDirName + file, js + "\n");
    }
}

if (deleteFiles) {
    for (const file of distDir) {
        if (jsKeep.includes(file.name)) {
            continue;
        }
        const fileExt = file.name.split(".").at(-1);
        if (fileExt === "js" || fileExt == "map") {
            await fs.unlink(distDirName + file.name);
        }
    }
}