[overrun](../README.md) / [index](../modules/index.md) / SourceFileTask

# Class: SourceFileTask

[index](../modules/index.md).SourceFileTask

A task which reads a source file and returns a buffer.

## Hierarchy

- [`AbstractTask`](index.AbstractTask.md)<`Buffer`\>

  ↳ **`SourceFileTask`**

## Table of contents

### Constructors

- [constructor](index.SourceFileTask.md#constructor)

### Properties

- [path](index.SourceFileTask.md#path)

### Methods

- [addDependent](index.SourceFileTask.md#adddependent)
- [dest](index.SourceFileTask.md#dest)
- [getModTime](index.SourceFileTask.md#getmodtime)
- [pipe](index.SourceFileTask.md#pipe)
- [read](index.SourceFileTask.md#read)
- [transform](index.SourceFileTask.md#transform)

## Constructors

### constructor

• **new SourceFileTask**(`path`, `stats?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`Path`](index.Path.md) |
| `stats?` | `Stats` |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[SourceFileTask.ts:13](https://github.com/viridia/overrun/blob/2973034/src/SourceFileTask.ts#L13)

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

[SourceFileTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/SourceFileTask.ts#L20)

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

### getModTime

▸ **getModTime**(): `Promise`<`Date`\>

Return the modification date of this source file.

#### Returns

`Promise`<`Date`\>

#### Defined in

[SourceFileTask.ts:26](https://github.com/viridia/overrun/blob/2973034/src/SourceFileTask.ts#L26)

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
| `taskGen` | (`input`: [`SourceFileTask`](index.SourceFileTask.md)) => `Dependant` |

#### Returns

`Dependant`

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L20)

___

### read

▸ **read**(): `Promise`<`Buffer`\>

Return the output of the task.

#### Returns

`Promise`<`Buffer`\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[SourceFileTask.ts:31](https://github.com/viridia/overrun/blob/2973034/src/SourceFileTask.ts#L31)

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
| `transform` | (`input`: `Buffer`) => `Out` \| `Promise`<`Out`\> |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L16)
