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

### Accessors

- [path](index.DirectoryTask.md#path)

### Methods

- [addDependent](index.DirectoryTask.md#adddependent)
- [files](index.DirectoryTask.md#files)
- [match](index.DirectoryTask.md#match)
- [pipe](index.DirectoryTask.md#pipe)
- [read](index.DirectoryTask.md#read)
- [transform](index.DirectoryTask.md#transform)

## Constructors

### constructor

• **new DirectoryTask**(`dirPath`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dirPath` | [`Path`](index.Path.md) |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[DirectoryTask.ts:12](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L12)

## Accessors

### path

• `get` **path**(): [`Path`](index.Path.md)

#### Returns

[`Path`](index.Path.md)

#### Overrides

AbstractTask.path

#### Defined in

[DirectoryTask.ts:19](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L19)

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

[DirectoryTask.ts:17](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L17)

___

### files

▸ **files**(): [`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

Create a task for every file in the directory.

#### Returns

[`TaskArray`](index.TaskArray.md)<[`SourceFileTask`](index.SourceFileTask.md)\>

#### Defined in

[DirectoryTask.ts:24](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L24)

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

[DirectoryTask.ts:29](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L29)

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
| `taskGen` | (`input`: [`DirectoryTask`](index.DirectoryTask.md)) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L24)

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

[DirectoryTask.ts:47](https://github.com/viridia/overrun/blob/b21a862/src/DirectoryTask.ts#L47)

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
| `transform` | (`input`: [`Path`](index.Path.md)[]) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L16)
