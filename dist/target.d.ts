import { TaskArray } from './TaskArray';
import { Builder, BuilderContainer, BuilderOptions, Task } from './Task';
import './TransformTask';
import './OutputFileTask';
/** @internal */
export interface Target {
    name: string;
    builders: BuilderContainer[];
}
declare type Builders = BuilderContainer | BuilderContainer[] | TaskArray<any, Builder & Task<unknown>>;
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
