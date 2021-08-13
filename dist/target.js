"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTargets = exports.target = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const TaskArray_1 = require("./TaskArray");
const errors_1 = require("./errors");
const chokidar_1 = __importDefault(require("chokidar"));
const sourceInternal_1 = require("./sourceInternal");
const targets = [];
function target(nameOrBuilder, builder) {
    if (typeof nameOrBuilder === 'string') {
        if (!builder) {
            console.error(ansi_colors_1.default.red(`No builders specified for target '${nameOrBuilder}'.`));
            process.exit(1);
        }
        else if (Array.isArray(builder)) {
            if (builder.length > 0) {
                targets.push({
                    builders: builder,
                    name: nameOrBuilder,
                });
            }
            else {
                console.error(ansi_colors_1.default.red(`No tasks specified for target '${nameOrBuilder}'.`));
            }
        }
        else if (builder instanceof TaskArray_1.TaskArray) {
            if (builder.items().length > 0) {
                targets.push({
                    builders: builder.items(),
                    name: nameOrBuilder,
                });
            }
            else {
                console.error(ansi_colors_1.default.red(`No tasks specified for rule '${nameOrBuilder}'.`));
            }
        }
        else {
            targets.push({
                builders: [builder],
                name: nameOrBuilder,
            });
        }
    }
    else if (Array.isArray(nameOrBuilder)) {
        if (nameOrBuilder.length > 0) {
            targets.push({
                builders: nameOrBuilder,
                name: nameOrBuilder[0].getName(),
            });
        }
        else {
            console.error(ansi_colors_1.default.red(`No tasks specified for unnamed target'.`));
        }
    }
    else if (nameOrBuilder instanceof TaskArray_1.TaskArray) {
        if (nameOrBuilder.length > 0) {
            targets.push({
                builders: nameOrBuilder.items(),
                name: nameOrBuilder.items()[0].getName(),
            });
        }
        else {
            console.error(ansi_colors_1.default.red(`No tasks specified for unnamed target'.`));
        }
    }
    else if (nameOrBuilder) {
        targets.push({
            builders: [nameOrBuilder],
            name: nameOrBuilder.getName(),
        });
    }
    else {
        console.error(ansi_colors_1.default.red('No builders specified for unnamed target.'));
        process.exit(1);
    }
}
exports.target = target;
async function checkOutOfDateTargets(builders) {
    const toBuild = new Set();
    await Promise.all(builders.map(async (b) => {
        const modified = await b.isModified();
        if (modified) {
            toBuild.add(b);
        }
    }));
    return toBuild;
}
async function buildTargets(options = {}) {
    let targetsToBuild = targets;
    if (options.targets !== undefined && options.targets.length > 0) {
        targetsToBuild = targets.filter(t => options.targets.includes(t.name));
    }
    sourceInternal_1.getWatchDirs();
    const results = await Promise.allSettled(targetsToBuild.map(async ({ name, builders }) => {
        // const toBuild = await checkOutOfDateTargets(builders);
        // if (toBuild.size > 0) {
        const promises = builders.map(b => b.build(options).catch(err => {
            if (err instanceof errors_1.BuildError) {
                console.error(`${ansi_colors_1.default.blue('Target')} ${ansi_colors_1.default.magentaBright(name)}: ${ansi_colors_1.default.red(err.message)}`);
            }
            else {
                console.log(`Not a build error?`);
                console.error(err);
            }
            throw err;
        }));
        return Promise.all(promises).then(() => {
            console.log(`${ansi_colors_1.default.greenBright('Finished')}: ${name}`);
        });
        // } else {
        //   console.log(`${c.cyanBright('Already up to date')}: ${name}`);
        //   return Promise.resolve();
        // }
    }));
    const rejected = results.filter(result => result.status === 'rejected');
    if (rejected.length > 0) {
        console.log(ansi_colors_1.default.red(`${rejected.length} targets failed.`));
        return false;
    }
    if (options.watchMode && !options.dryRun) {
        const dirs = sourceInternal_1.getWatchDirs();
        const watcher = chokidar_1.default.watch(dirs, {
            persistent: true,
            alwaysStat: true,
        });
        let debounceTimer = null; //  = global.setTimeout();
        let isChanged = false;
        const rebuild = async () => {
            isChanged = false;
            const promises = targetsToBuild.map(async ({ name, builders }) => {
                const toBuild = await checkOutOfDateTargets(builders);
                if (toBuild.size > 0) {
                    const promises = builders.map(b => b.build(options).catch(err => {
                        if (err instanceof errors_1.BuildError) {
                            console.error(`${ansi_colors_1.default.blue('Target')} ${ansi_colors_1.default.magentaBright(name)}: ${ansi_colors_1.default.red(err.message)}`);
                        }
                        else {
                            console.log(`Not a build error?`);
                            console.error(err);
                        }
                    }));
                    return Promise.all(promises).then(() => {
                        console.log(`${ansi_colors_1.default.greenBright('Rebuilt')}: ${name}`);
                    });
                }
            });
            await Promise.all(promises);
            // Don't clear the timer until build is done; that way we don't schedule a new build
            // until the previous one has finished.
            debounceTimer = null;
            if (isChanged) {
                rebuild();
            }
        };
        watcher.on('change', (path, stats) => {
            if (path && stats) {
                const source = sourceInternal_1.getSource(path);
                if (source) {
                    source.updateStats(stats);
                    isChanged = true;
                    if (!debounceTimer) {
                        debounceTimer = global.setTimeout(rebuild, 300);
                    }
                }
            }
        });
    }
    return true;
}
exports.buildTargets = buildTargets;
