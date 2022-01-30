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

### Properties

- [path](index.TaskArray.md#path)

### Accessors

- [length](index.TaskArray.md#length)

### Methods

- [addDependent](index.TaskArray.md#adddependent)
- [dest](index.TaskArray.md#dest)
- [find](index.TaskArray.md#find)
- [items](index.TaskArray.md#items)
- [map](index.TaskArray.md#map)
- [pipe](index.TaskArray.md#pipe)
- [read](index.TaskArray.md#read)
- [reduce](index.TaskArray.md#reduce)
- [transform](index.TaskArray.md#transform)

## Constructors

### constructor

• **new TaskArray**<`T2`\>(`sources`, `path`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T2` | extends [`Task`](../interfaces/index.Task.md)<`any`, `T2`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `sources` | `T2`[] |
| `path` | [`Path`](index.Path.md) |

#### Overrides

[AbstractTask](index.AbstractTask.md).[constructor](index.AbstractTask.md#constructor)

#### Defined in

[TaskArray.ts:13](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L13)

## Properties

### path

• `Readonly` **path**: [`Path`](index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Inherited from

[AbstractTask](index.AbstractTask.md).[path](index.AbstractTask.md#path)

## Accessors

### length

• `get` **length**(): `number`

Returns the number of tasks in this `TaskArray`.

#### Returns

`number`

#### Defined in

[TaskArray.ts:36](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L36)

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

[TaskArray.ts:17](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L17)

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

[TaskArray.ts:41](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L41)

___

### items

▸ **items**(): `T2`[]

The array of tasks contained in this `TaskArray`.

#### Returns

`T2`[]

#### Defined in

[TaskArray.ts:22](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L22)

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

[TaskArray.ts:31](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L31)

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
| `taskGen` | (`input`: [`TaskArray`](index.TaskArray.md)<`T2`\>) => `Dependant` |

#### Returns

`Dependant`

#### Inherited from

[AbstractTask](index.AbstractTask.md).[pipe](index.AbstractTask.md#pipe)

#### Defined in

[AbstractTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L20)

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

[TaskArray.ts:26](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L26)

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

[TaskArray.ts:51](https://github.com/viridia/overrun/blob/2973034/src/TaskArray.ts#L51)

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
| `transform` | (`input`: `T2`[]) => `Out` \| `Promise`<`Out`\> |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

#### Inherited from

[AbstractTask](index.AbstractTask.md).[transform](index.AbstractTask.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L16)
