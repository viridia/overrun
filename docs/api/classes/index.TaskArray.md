[overrun](../README.md) / [index](../modules/index.md) / TaskArray

# Class: TaskArray<T2\>

[index](../modules/index.md).TaskArray

Represents an array of tasks. These are usually created when operating on collections of
source files.

The `transform()` and `pipe()` methods operate on the entire collection of tasks. To
process tasks individually, use the `map()` or `reduce()` methods.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T2` | extends [`Task`](../interfaces/index.Task.md)<`any`\> |

## Hierarchy

- [`AbstractTask`](index.AbstractTask.md)<`T2`[]\>

  ↳ **`TaskArray`**

## Table of contents

### Constructors

- [constructor](index.TaskArray.md#constructor)

### Accessors

- [length](index.TaskArray.md#length)
- [path](index.TaskArray.md#path)

### Methods

- [addDependent](index.TaskArray.md#adddependent)
- [find](index.TaskArray.md#find)
- [items](index.TaskArray.md#items)
- [map](index.TaskArray.md#map)
- [pipe](index.TaskArray.md#pipe)
- [read](index.TaskArray.md#read)
- [reduce](index.TaskArray.md#reduce)
- [transform](index.TaskArray.md#transform)

## Constructors

### constructor

• **new TaskArray**<`T2`\>(`sources`, `dirPath?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T2` | extends [`Task`](../interfaces/index.Task.md)<`any`, `T2`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `sources` | `T2`[] |
| `dirPath?` | [`Path`](index.Path.md) |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[TaskArray.ts:12](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L12)

## Accessors

### length

• `get` **length**(): `number`

Returns the number of tasks in this `TaskArray`.

#### Returns

`number`

#### Defined in

[TaskArray.ts:39](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L39)

___

### path

• `get` **path**(): `undefined` \| [`Path`](index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Returns

`undefined` \| [`Path`](index.Path.md)

#### Overrides

AbstractTask.path

#### Defined in

[TaskArray.ts:20](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L20)

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

[TaskArray.ts:16](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L16)

___

### find

▸ **find**(`predicate`): `undefined` \| `T2`

Find a task by some predicate.

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`value`: `T2`) => `boolean` |

#### Returns

`undefined` \| `T2`

#### Defined in

[TaskArray.ts:44](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L44)

___

### items

▸ **items**(): `T2`[]

The array of tasks contained in this `TaskArray`.

#### Returns

`T2`[]

#### Defined in

[TaskArray.ts:25](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L25)

___

### map

▸ **map**<`Out`, `Depends`\>(`fn`): [`TaskArray`](index.TaskArray.md)<`Depends`\>

Works like Array.map(), except that the elements are tasks.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Out` | `Out` |
| `Depends` | extends [`Task`](../interfaces/index.Task.md)<`Out`, `Depends`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`input`: `T2`) => `Depends` |

#### Returns

[`TaskArray`](index.TaskArray.md)<`Depends`\>

#### Defined in

[TaskArray.ts:34](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L34)

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
| `taskGen` | (`input`: [`TaskArray`](index.TaskArray.md)<`T2`\>) => `Dependant` | A function which creates a task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/20a7ff0/src/AbstractTask.ts#L24)

___

### read

▸ **read**(): `Promise`<`T2`[]\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<`T2`[]\>

#### Overrides

[AbstractTask](index.AbstractTask.md).[read](index.AbstractTask.md#read)

#### Defined in

[TaskArray.ts:29](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L29)

___

### reduce

▸ **reduce**<`Out`\>(`init`, `reducer`): [`Task`](../interfaces/index.Task.md)<`Out`\>

Combine the output of all the tasks in the task array into a single data structure.
The reducer function operates much like `Array.reduce()` except that it is asynchronous.

#### Type parameters

| Name |
| :------ |
| `Out` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `init` | `Out` | The initial value before any reductions. |
| `reducer` | (`acc`: `Out`, `next`: `T2`) => `Out` \| `Promise`<`Out`\> | Function which combines the accumulated value with new values. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which produces the combined output of the reduction.

#### Defined in

[TaskArray.ts:54](https://github.com/viridia/overrun/blob/20a7ff0/src/TaskArray.ts#L54)

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
| `transform` | (`input`: `T2`[]) => `Out` \| `Promise`<`Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/20a7ff0/src/AbstractTask.ts#L16)
