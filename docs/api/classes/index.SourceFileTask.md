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

### Accessors

- [path](index.SourceFileTask.md#path)

### Methods

- [addDependent](index.SourceFileTask.md#adddependent)
- [getModTime](index.SourceFileTask.md#getmodtime)
- [pipe](index.SourceFileTask.md#pipe)
- [read](index.SourceFileTask.md#read)
- [transform](index.SourceFileTask.md#transform)

## Constructors

### constructor

• **new SourceFileTask**(`filePath`, `stats?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | [`Path`](index.Path.md) |
| `stats?` | `Stats` |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[SourceFileTask.ts:14](https://github.com/viridia/overrun/blob/b21a862/src/SourceFileTask.ts#L14)

## Accessors

### path

• `get` **path**(): [`Path`](index.Path.md)

#### Returns

[`Path`](index.Path.md)

#### Overrides

AbstractTask.path

#### Defined in

[SourceFileTask.ts:26](https://github.com/viridia/overrun/blob/b21a862/src/SourceFileTask.ts#L26)

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

[SourceFileTask.ts:21](https://github.com/viridia/overrun/blob/b21a862/src/SourceFileTask.ts#L21)

___

### getModTime

▸ **getModTime**(): `Promise`<`Date`\>

Return the modification date of this source file.

#### Returns

`Promise`<`Date`\>

#### Defined in

[SourceFileTask.ts:31](https://github.com/viridia/overrun/blob/b21a862/src/SourceFileTask.ts#L31)

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
| `taskGen` | (`input`: [`SourceFileTask`](index.SourceFileTask.md)) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L24)

___

### read

▸ **read**(): `Promise`<`Buffer`\>

Return the output of the task.

#### Returns

`Promise`<`Buffer`\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[SourceFileTask.ts:36](https://github.com/viridia/overrun/blob/b21a862/src/SourceFileTask.ts#L36)

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
| `transform` | (`input`: `Buffer`) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L16)
