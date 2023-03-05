"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTargets = exports.buildTargets = exports.target = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const TaskArray_1 = require("./TaskArray");
const errors_1 = require("./errors");
const chokidar_1 = __importDefault(require("chokidar"));
const sourceInternal_1 = require("./sourceInternal");
require("./TransformTask");
require("./OutputFileTask");
const path_1 = __importDefault(require("path"));
const debug_1 = require("./debug");
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
            if (builder.length > 0) {
                // This needs to recalculate when directory changes.
                // What we need is something like an output task array.
                targets.push({
                    builders: [builder],
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
                builders: [nameOrBuilder],
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
async function checkOutOfDateTargets(builders, force) {
    const toBuild = new Set();
    await Promise.all(builders.map(async (b) => {
        const outOfDate = await b.gatherOutOfDate(force);
        outOfDate.forEach(b => {
            toBuild.add(b);
        });
    }));
    return toBuild;
}
/** @internal */
async function buildTargets(options = {}) {
    let targetsToBuild = targets;
    if (options.targets !== undefined && options.targets.length > 0) {
        targetsToBuild = targets.filter(t => options.targets.includes(t.name));
    }
    sourceInternal_1.getWatchDirs();
    const buildTargets = (force) => {
        return targetsToBuild.map(async ({ name, builders }) => {
            const toBuild = Array.from(new Set(await checkOutOfDateTargets(builders, force)));
            if (toBuild.length > 0) {
                const promises = toBuild.map(b => b.build(options).catch(err => {
                    if (err instanceof errors_1.BuildError) {
                        console.error(`${ansi_colors_1.default.blue('Target')} ${ansi_colors_1.default.magentaBright(name)}: ${ansi_colors_1.default.red(err.message)}`);
                    }
                    else {
                        console.log(`Not a build error?`);
                        console.error(err);
                    }
                    throw err;
                }));
                await Promise.all(promises);
                if (force) {
                    console.log(`${ansi_colors_1.default.greenBright('Finished')}: ${name}`);
                }
                else {
                    console.log(`${ansi_colors_1.default.greenBright('Rebuilt')}: ${name}`);
                }
            }
        });
    };
    const results = await Promise.allSettled(buildTargets(true));
    const rejected = results.filter(result => result.status === 'rejected');
    if (rejected.length > 0) {
        console.log(ansi_colors_1.default.red(`${rejected.length} targets failed.`));
        return false;
    }
    if (options.watchMode && !options.dryRun) {
        const dirs = sourceInternal_1.getWatchDirs();
        // console.log(dirs);
        const watcher = chokidar_1.default.watch(dirs, {
            persistent: true,
            alwaysStat: true,
        });
        let debounceTimer = null; //  = global.setTimeout();
        let isChanged = false;
        let isReady = false;
        const rebuild = async () => {
            isChanged = false;
            const results = await Promise.allSettled(buildTargets(false));
            const rejected = results.filter(result => result.status === 'rejected');
            if (rejected.length > 0) {
                console.log(ansi_colors_1.default.red(`${rejected.length} targets failed.`));
                return false;
            }
            else {
                console.log(ansi_colors_1.default.green('Targets successfully rebuilt'));
            }
            // Don't clear the timer until build is done; that way we don't schedule a new build
            // until the previous one has finished.
            debounceTimer = null;
            if (isChanged) {
                rebuild();
            }
        };
        watcher.on('error', error => {
            console.error('Watcher error:', error);
        });
        watcher.on('ready', () => {
            isReady = true;
            console.log(`Watching for changes...`);
        });
        watcher.on('change', (filePath, stats) => {
            if (isReady && filePath && stats) {
                debug_1.log(`'change' event for ${filePath}`);
                if (stats.isFile()) {
                    const task = sourceInternal_1.getSourceTask(filePath);
                    if (task) {
                        task.updateStats(stats);
                        task.updateModTime(stats.mtime);
                        isChanged = true;
                        if (!debounceTimer) {
                            debounceTimer = global.setTimeout(rebuild, 300);
                        }
                    }
                }
            }
        });
        watcher.on('add', filePath => {
            if (isReady && filePath) {
                debug_1.log(`'add' event for ${filePath}`);
                const dirname = path_1.default.dirname(filePath);
                sourceInternal_1.getDirectoryTasks(dirname).forEach(task => {
                    task.bumpVersion();
                    isChanged = true;
                    if (!debounceTimer) {
                        debounceTimer = global.setTimeout(rebuild, 300);
                    }
                });
            }
        });
        watcher.on('unlink', filePath => {
            if (isReady && filePath) {
                debug_1.log(`'unlink' event for ${filePath}`);
                const dirname = path_1.default.dirname(filePath);
                sourceInternal_1.getDirectoryTasks(dirname).forEach(task => {
                    task.bumpVersion();
                    isChanged = true;
                    if (!debounceTimer) {
                        debounceTimer = global.setTimeout(rebuild, 300);
                    }
                });
            }
        });
    }
    return true;
}
exports.buildTargets = buildTargets;
/** Remove all targets. Mainly used for testing. */
function clearTargets() {
    targets.length = 0;
}
exports.clearTargets = clearTargets;
