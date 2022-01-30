[overrun](../README.md) / [index](../modules/index.md) / AbstractTask

# Class: AbstractTask<T\>

[index](../modules/index.md).AbstractTask

An abstract base class useful for defining custom tasks. It implements most of the methods
of the [Task](../interfaces/index.Task.md) interface.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`AbstractTask`**

  ↳ [`DirectoryTask`](index.DirectoryTask.md)

  ↳ [`SourceFileTask`](index.SourceFileTask.md)

  ↳ [`TaskArray`](index.TaskArray.md)

## Implements

- [`Task`](../interfaces/index.Task.md)<`T`\>

## Table of contents

### Constructors

- [constructor](index.AbstractTask.md#constructor)

### Properties

- [path](index.AbstractTask.md#path)

### Methods

- [addDependent](index.AbstractTask.md#adddependent)
- [dest](index.AbstractTask.md#dest)
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

## Properties

### path

• `Readonly` `Abstract` **path**: [`Path`](index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Implementation of

[Task](../interfaces/index.Task.md).[path](../interfaces/index.Task.md#path)

#### Defined in

[AbstractTask.ts:13](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L13)

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

[AbstractTask.ts:12](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L12)

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

#### Implementation of

[Task](../interfaces/index.Task.md).[dest](../interfaces/index.Task.md#dest)

#### Defined in

[AbstractTask.ts:24](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L24)

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
| `taskGen` | (`input`: [`AbstractTask`](index.AbstractTask.md)<`T`\>) => `Dependant` |

#### Returns

`Dependant`

#### Implementation of

[Task](../interfaces/index.Task.md).[pipe](../interfaces/index.Task.md#pipe)

#### Defined in

[AbstractTask.ts:20](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L20)

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

[AbstractTask.ts:14](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L14)

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
| `transform` | (`input`: `T`) => `Out` \| `Promise`<`Out`\> |

#### Returns

[`Task`](../interfaces/index.Task.md)<`Out`\>

#### Implementation of

[Task](../interfaces/index.Task.md).[transform](../interfaces/index.Task.md#transform)

#### Defined in

[AbstractTask.ts:16](https://github.com/viridia/overrun/blob/2973034/src/AbstractTask.ts#L16)
