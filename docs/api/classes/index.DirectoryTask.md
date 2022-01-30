[overrun](../README.md) / [index](../modules/index.md) / DirectoryTask

# Class: DirectoryTask

[index](../modules/index.md).DirectoryTask

A task which reads the contents of a directory.

## Hierarchy

- [`AbstractTask`](index.AbstractTask.md)<[`Path`](index.Path.md)[]\>

  ↳ **`DirectoryTask`**

## Table of contents

### Constructors

- [constructor](index.DirectoryTask.md#constructor)

### Properties

- [path](index.DirectoryTask.md#path)

### Methods

- [addDependent](index.DirectoryTask.md#adddependent)
- [dest](index.DirectoryTask.md#dest)
- [files](index.DirectoryTask.md#files)
- [match](index.DirectoryTask.md#match)
- [pipe](index.DirectoryTask.md#pipe)
- [read](index.DirectoryTask.md#read)
- [transform](index.DirectoryTask.md#transform)

## Constructors

### constructor

• **new DirectoryTask**(`path`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`Path`](index.Path.md) |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[DirectoryTask.ts:12](https://github.com/viridia/overrun/blob/2973034/src/DirectoryTask.ts#L12)

## Properties

### path

• `Readonly` **path**: [`Path`](index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[path](index.AbstractTask.md#path)

## Methods

### addDependent

▸ **addDependent**(`dependent`, `dependencies`): `void`

Mark a task as being dependent on this task, meaning that the target is considered to
be out of date when any of its dependencies are out of date.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependent` | [`Task`](../interfaces/index.Task.md)<`unknown`\> |
| `dependencies` | `Set`<[`SourceTask`](../interfaces/index.SourceTask.md)\> |

#### Returns

`void`

#### Overrides

[AbstractTask](index.AbstractTask.md).[addDependent](index.AbstractTask.md#adddependent)

#### Defined in

[DirectoryTask.ts:17](https://github.com/viridia/overrun/blob/2973034/src/DirectoryTask.ts#L17)

___

### dest

▸ **dest**(`baseOrPath`, `fragment?`): `OutputFileTask`

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

| Name | Type |
| :------ | :------ |
| `baseOrPath` | ``null`` \| `string` \| [`Path`](index.Path.md) \| [`PathMapping`](../modules/index.md#pathmapping) |
| `fragment?` | ``null`` \| `string` |

#### Returns

`OutputFileTask`

#### Inherited from

[AbstractTask](index.AbstractTask.md).[dest](index.AbstractTask.md#dest)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L24)

___

### files

▸ **files**(): [`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

Create a task for every file in the directory.

#### Returns

[`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

#### Defined in

[DirectoryTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/DirectoryTask.ts#L20)

___

### match

▸ **match**(`pattern`): [`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

Create a task for every file that matches the glob.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` |

#### Returns

[`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

#### Defined in

[DirectoryTask.ts:25](https://github.com/viridia/overrun/blob/2973034/src/DirectoryTask.ts#L25)

___

### pipe

▸ **pipe**<`Out`, `Dependant`\>(`taskGen`): `Dependant`

Pipe the output of this task through another task. Similar to `transform()`, except that
it allows more flexibility in processing.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Out` | `Out` |
| `Dependant` | extends [`Task`](../interfaces/index.Task.md)<`Out`, `Dependant`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `taskGen` | (`input`: [`DirectoryTask`](index.DirectoryTask.md)) => `Dependant` |

#### Returns

`Dependant`

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L20)

___

### read

▸ **read**(): `Promise`<[`Path`](index.Path.md)[]\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<[`Path`](index.Path.md)[]\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[DirectoryTask.ts:41](https://github.com/viridia/overrun/blob/2973034/src/DirectoryTask.ts#L41)

___

### transform

▸ **transform**<`Out`\>(`transform`): [`Task`](../interfaces/index.Task.md)<`Out`\>

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

| Name | Type |
| :------ | :------ |
| `transform` | (`input`: [`Path`](index.Path.md)[]) => `Out` \| `Promise`<`Out`\> |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L16)
