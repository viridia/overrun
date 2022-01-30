import { TaskArray } from './TaskArray';
import { Builder, BuilderOptions, Task } from './Task';
import './TransformTask';
import './OutputFileTask';
/** @internal */
export interface Target {
    name: string;
    builders: Builder[];
}
declare type Builders = Builder | Builder[] | TaskArray<Builder & Task<unknown>>;
/**
 *
 * @param name
 * @param builders
 */
export declare function target(builder: Builders): void;
export declare function target(name: string, builder: Builders): void;
/** @internal */
export declare function buildTargets(options?: BuilderOptions): Promise<boolean>;
/** Remove all targets. Mainly used for testing. */
export declare function clearTargets(): void;
export {};
