[overrun](../README.md) / [index](../modules/index.md) / Task

# Interface: Task<T\>

[index](../modules/index.md).Task

A TypeScript interface representing an object which produces data asynchronously. It
has a single template parameter, which represents the type of data produced.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`Task`**

  ↳ [`OutputTask`](index.OutputTask.md)

## Implemented by

- [`AbstractTask`](../classes/index.AbstractTask.md)

## Table of contents

### Properties

- [path](index.Task.md#path)

### Methods

- [addDependent](index.Task.md#adddependent)
- [dest](index.Task.md#dest)
- [pipe](index.Task.md#pipe)
- [read](index.Task.md#read)
- [transform](index.Task.md#transform)

## Properties

### path

• `Readonly` **path**: [`Path`](../classes/index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Defined in

[Task.ts:15](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L15)

## Methods

### addDependent

▸ **addDependent**(`dependent`, `dependencies`): `void`

Mark a task as being dependent on this task, meaning that the target is considered to
be out of date when any of its dependencies are out of date.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependent` | [`Task`](index.Task.md)<`unknown`\> |
| `dependencies` | `Set`<[`SourceTask`](index.SourceTask.md)\> |

#### Returns

`void`

#### Defined in

[Task.ts:12](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L12)

___

### dest

▸ **dest**(`baseOrPath`, `fragment?`): [`OutputTask`](index.OutputTask.md)<`string` \| `Buffer`\>

Create an output task that writes to a specified location. This method is only
valid if the output type of the task is a string or Buffer object.

Examples:

```ts
path.dest(newPath);
path.dest(newBase, null);
path.dest(null, newFragment);
path.dest(path => path.withBase(newBase));
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseOrPath` | ``null`` \| `string` \| [`Path`](../classes/index.Path.md) \| [`PathMapping`](../modules/index.md#pathmapping) | New base path; if this is the sole argument, then the source path will be replaced entirely by this path. You can also pass in a callback function which transforms the path. If null or undefined is passed, then the base path is unmodified. |
| `fragment?` | ``null`` \| `string` | New fragment. This is appended to the base path. This is required if the first argument is null or undefined. |

#### Returns

[`OutputTask`](index.OutputTask.md)<`string` \| `Buffer`\>

#### Defined in

[Task.ts:60](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L60)

___

### pipe

▸ **pipe**<`Out`, `Dependant`\>(`taskGen`): `Dependant`

Pipe the output of this task through another task. Similar to `transform()`, except that
it allows more flexibility in processing.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Out` | `Out` |
| `Dependant` | extends [`Task`](index.Task.md)<`Out`, `Dependant`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGen` | (`input`: [`Task`](index.Task.md)<`T`\>) => `Dependant` | A function which creates a new task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Defined in

[Task.ts:39](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L39)

___

### read

▸ **read**(): `Promise`<`T`\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<`T`\>

#### Defined in

[Task.ts:20](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L20)

___

### transform

▸ **transform**<`Out`\>(`transform`): [`Task`](index.Task.md)<`Out`\>

Creates a new task which transforms the output of this task's data. The `transform`
argument is a function which accepts the task's output as an argument, and which returns
either the transformed data or a promise which resolves to that data.

The task created will list the current task as a dependency, so if the source file is changed
the transform task will be re-run.

#### Type parameters

| Name |
| :------ |
| `Out` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | [`TransformFnAsync`](../modules/index.md#transformfnasync)<`T`, `Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Defined in

[Task.ts:32](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L32)
