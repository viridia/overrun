import { TaskArray } from './TaskArray';
import { Task } from './Task';
export interface BuilderOptions {
    dryRun?: boolean;
    watchMode?: boolean;
    targets?: string[];
}
/** A target is anything that can be built.
    @internal
*/
export interface Builder {
    build(options: BuilderOptions): Promise<void>;
    isModified(): Promise<boolean>;
}
/** @internal */
export interface NamedBuilder extends Builder {
    getName(): string;
}
/** @internal */
export interface Target {
    name: string;
    builders: Builder[];
}
declare type Builders = NamedBuilder | NamedBuilder[] | TaskArray<NamedBuilder & Task<unknown>>;
/**
 *
 * @param name
 * @param builders
 */
export declare function target(builder: Builders): void;
export declare function target(name: string, builder: Builders): void;
/** @internal */
export declare function buildTargets(options?: BuilderOptions): Promise<boolean>;
export {};
