import {
  Builders,
  SourceFileTask,
  DirectoryTask,
  BuilderOptions,
} from './dist/index';

declare global {
  function target(builder: Builders): void;
  function target(name: string, builder: Builders): void;
  function source(baseOrFile: string | Path, fragment?: string): SourceFileTask;
  function directory(baseOrPath: string | Path, fragment?: string): DirectoryTask;
  function buildTargets(options?: BuilderOptions): Promise<boolean>;
  function clearTargets(): void;
  async function build(): void;
}
