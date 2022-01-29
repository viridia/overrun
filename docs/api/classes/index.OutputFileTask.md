[overrun](../README.md) / [index](../modules/index.md) / OutputFileTask

# Class: OutputFileTask

[index](../modules/index.md).OutputFileTask

A task which reads a source file and returns a buffer.

## Hierarchy

- [`AbstractTask`](index.AbstractTask.md)<`Buffer` \| `string`\>

  ↳ **`OutputFileTask`**

## Implements

- [`Builder`](../interfaces/index.Builder.md)

## Table of contents

### Constructors

- [constructor](index.OutputFileTask.md#constructor)

### Accessors

- [path](index.OutputFileTask.md#path)

### Methods

- [addDependent](index.OutputFileTask.md#adddependent)
- [build](index.OutputFileTask.md#build)
- [getName](index.OutputFileTask.md#getname)
- [pipe](index.OutputFileTask.md#pipe)
- [read](index.OutputFileTask.md#read)
- [transform](index.OutputFileTask.md#transform)

## Constructors

### constructor

• **new OutputFileTask**(`source`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `WritableTask` |
| `options?` | [`WriteOptions`](../interfaces/index.WriteOptions.md) |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[OutputFileTask.ts:22](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L22)

## Accessors

### path

• `get` **path**(): [`Path`](index.Path.md)

#### Returns

[`Path`](index.Path.md)

#### Overrides

AbstractTask.path

#### Defined in

[OutputFileTask.ts:42](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L42)

## Methods

### addDependent

▸ **addDependent**(`dependent`, `dependencies`): `void`

Add a task as a dependent of this task.

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

[OutputFileTask.ts:51](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L51)

___

### build

▸ **build**(`options`): `Promise`<`void`\>

Run all tasks and generate the file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BuilderOptions`](../interfaces/index.BuilderOptions.md) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Builder](../interfaces/index.Builder.md).[build](../interfaces/index.Builder.md#build)

#### Defined in

[OutputFileTask.ts:79](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L79)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Implementation of

[Builder](../interfaces/index.Builder.md).[getName](../interfaces/index.Builder.md#getname)

#### Defined in

[OutputFileTask.ts:46](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L46)

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
| `taskGen` | (`input`: [`OutputFileTask`](index.OutputFileTask.md)) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/20a7ff0/src/AbstractTask.ts#L24)

___

### read

▸ **read**(): `Promise`<`string` \| `Buffer`\>

Return a conduit containing the file path, which lazily reads the file.

#### Returns

`Promise`<`string` \| `Buffer`\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[OutputFileTask.ts:74](https://github.com/viridia/overrun/blob/20a7ff0/src/OutputFileTask.ts#L74)

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
| `transform` | (`input`: `string` \| `Buffer`) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/20a7ff0/src/AbstractTask.ts#L16)
