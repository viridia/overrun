[overrun](../README.md) / [index](../modules/index.md) / AbstractTask

# Class: AbstractTask<T\>

[index](../modules/index.md).AbstractTask

An abstract base class useful for defining custom tasks. It implements most of the methods
of the `Task` interface.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`AbstractTask`**

  ↳ [`TransformTask`](index.TransformTask.md)

  ↳ [`DirectoryTask`](index.DirectoryTask.md)

  ↳ [`OutputFileTask`](index.OutputFileTask.md)

  ↳ [`SourceFileTask`](index.SourceFileTask.md)

  ↳ [`TaskArray`](index.TaskArray.md)

## Implements

- [`Task`](../interfaces/index.Task.md)<`T`\>

## Table of contents

### Constructors

- [constructor](index.AbstractTask.md#constructor)

### Accessors

- [path](index.AbstractTask.md#path)

### Methods

- [addDependent](index.AbstractTask.md#adddependent)
- [pipe](index.AbstractTask.md#pipe)
- [read](index.AbstractTask.md#read)
- [transform](index.AbstractTask.md#transform)

## Constructors

### constructor

• **new AbstractTask**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

## Accessors

### path

• `Abstract` `get` **path**(): `undefined` \| [`Path`](index.Path.md)

#### Returns

`undefined` \| [`Path`](index.Path.md)

#### Implementation of

Task.path

#### Defined in

[AbstractTask.ts:9](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L9)

## Methods

### addDependent

▸ `Abstract` **addDependent**(`dependent`, `dependencies`): `void`

Mark a task as being dependent on this task, meaning that the target is considered to
be out of date when any of its dependencies are out of date.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependent` | [`Task`](../interfaces/index.Task.md)<`unknown`\> |
| `dependencies` | `Set`<[`SourceTask`](../interfaces/index.SourceTask.md)\> |

#### Returns

`void`

#### Implementation of

[Task](../interfaces/index.Task.md).[addDependent](../interfaces/index.Task.md#adddependent)

#### Defined in

[AbstractTask.ts:8](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L8)

___

### pipe

▸ **pipe**<`Out`, `Dependant`\>(`taskGen`): `Dependant`

Pipe the output of this task through another task.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Out` | `Out` |
| `Dependant` | extends [`Task`](../interfaces/index.Task.md)<`Out`, `Dependant`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGen` | (`input`: [`AbstractTask`](index.AbstractTask.md)<`T`\>) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Implementation of

[Task](../interfaces/index.Task.md).[pipe](../interfaces/index.Task.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L24)

___

### read

▸ `Abstract` **read**(): `Promise`<`T`\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<`T`\>

#### Implementation of

[Task](../interfaces/index.Task.md).[read](../interfaces/index.Task.md#read)

#### Defined in

[AbstractTask.ts:10](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L10)

___

### transform

▸ **transform**<`Out`\>(`transform`): [`Task`](../interfaces/index.Task.md)<`Out`\>

Transform the output of this task through a function.

#### Type parameters

| Name |
| :------ |
| `Out` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | (`input`: `T`) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Implementation of

[Task](../interfaces/index.Task.md).[transform](../interfaces/index.Task.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L16)
