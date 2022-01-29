[overrun](../README.md) / [index](../modules/index.md) / TransformTask

# Class: TransformTask<In, Out\>

[index](../modules/index.md).TransformTask

A simplified transform task which accepts a synchronous transform function.

## Type parameters

| Name |
| :------ |
| `In` |
| `Out` |

## Hierarchy

- [`AbstractTask`](index.AbstractTask.md)<`Out`\>

  ↳ **`TransformTask`**

## Table of contents

### Constructors

- [constructor](index.TransformTask.md#constructor)

### Accessors

- [path](index.TransformTask.md#path)

### Methods

- [addDependent](index.TransformTask.md#adddependent)
- [pipe](index.TransformTask.md#pipe)
- [read](index.TransformTask.md#read)
- [transform](index.TransformTask.md#transform)

## Constructors

### constructor

• **new TransformTask**<`In`, `Out`\>(`source`, `transformer`)

Construct a new transform task.

#### Type parameters

| Name |
| :------ |
| `In` |
| `Out` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | [`Task`](../interfaces/index.Task.md)<`In`\> | The input to the transform. |
| `transformer` | (`input`: `In`) => `Out` \| `Promise`<`Out`\> | A function which accepts an input value and returns an output value. This function will be called during the build, once the input data is ready. |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[AbstractTask.ts:36](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L36)

## Accessors

### path

• `get` **path**(): `undefined` \| [`Path`](index.Path.md)

#### Returns

`undefined` \| [`Path`](index.Path.md)

#### Overrides

AbstractTask.path

#### Defined in

[AbstractTask.ts:45](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L45)

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

[AbstractTask.ts:40](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L40)

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
| `taskGen` | (`input`: [`TransformTask`](index.TransformTask.md)<`In`, `Out`\>) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L24)

___

### read

▸ **read**(): `Promise`<`Out`\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<`Out`\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[AbstractTask.ts:49](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L49)

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
| `transform` | (`input`: `Out`) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/AbstractTask.ts#L16)
