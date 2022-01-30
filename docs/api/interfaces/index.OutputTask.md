[overrun](../README.md) / [index](../modules/index.md) / OutputTask

# Interface: OutputTask<T\>

[index](../modules/index.md).OutputTask

A task that has a "last modified" date.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`Task`](index.Task.md)<`T`\>

- [`Builder`](index.Builder.md)

  ↳ **`OutputTask`**

## Table of contents

### Properties

- [path](index.OutputTask.md#path)

### Methods

- [addDependent](index.OutputTask.md#adddependent)
- [build](index.OutputTask.md#build)
- [dest](index.OutputTask.md#dest)
- [getName](index.OutputTask.md#getname)
- [isModified](index.OutputTask.md#ismodified)
- [pipe](index.OutputTask.md#pipe)
- [read](index.OutputTask.md#read)
- [transform](index.OutputTask.md#transform)

## Properties

### path

• `Readonly` **path**: [`Path`](../classes/index.Path.md)

The filesystem location associated with the build artifact produced by this task.

#### Inherited from

[Task](index.Task.md).[path](index.Task.md#path)

#### Defined in

[Task.ts:15](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L15)

## Methods

### addDependent

▸ **addDependent**(`dependent`, `dependencies`): `void`

Mark a task as being dependent on this task, meaning that the target is considered to
be out of date when any of its dependencies are out of date.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependent` | [`Task`](index.Task.md)<`unknown`\> |
| `dependencies` | `Set`<[`SourceTask`](index.SourceTask.md)\> |

#### Returns

`void`

#### Inherited from

[Task](index.Task.md).[addDependent](index.Task.md#adddependent)

#### Defined in

[Task.ts:12](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L12)

___

### build

▸ **build**(`options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BuilderOptions`](index.BuilderOptions.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Builder](index.Builder.md).[build](index.Builder.md#build)

#### Defined in

[Task.ts:86](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L86)

___

### dest

▸ **dest**(`baseOrPath`, `fragment?`): [`OutputTask`](index.OutputTask.md)<`string` \| `Buffer`\>

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseOrPath` | ``null`` \| `string` \| [`Path`](../classes/index.Path.md) \| [`PathMapping`](../modules/index.md#pathmapping) | New base path; if this is the sole argument, then the source path will be replaced entirely by this path. You can also pass in a callback function which transforms the path. If null or undefined is passed, then the base path is unmodified. |
| `fragment?` | ``null`` \| `string` | New fragment. This is appended to the base path. This is required if the first argument is null or undefined. |

#### Returns

[`OutputTask`](index.OutputTask.md)<`string` \| `Buffer`\>

#### Inherited from

[Task](index.Task.md).[dest](index.Task.md#dest)

#### Defined in

[Task.ts:60](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L60)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Inherited from

[Builder](index.Builder.md).[getName](index.Builder.md#getname)

#### Defined in

[Task.ts:88](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L88)

___

### isModified

▸ **isModified**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[Builder](index.Builder.md).[isModified](index.Builder.md#ismodified)

#### Defined in

[Task.ts:87](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L87)

___

### pipe

▸ **pipe**<`Out`, `Dependant`\>(`taskGen`): `Dependant`

Pipe the output of this task through another task. Similar to `transform()`, except that
it allows more flexibility in processing.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Out` | `Out` |
| `Dependant` | extends [`Task`](index.Task.md)<`Out`, `Dependant`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taskGen` | (`input`: [`OutputTask`](index.OutputTask.md)<`T`\>) => `Dependant` | A function which creates a new task, given a reference to this task. |

#### Returns

`Dependant`

A new Task which transforms the output when run.

#### Inherited from

[Task](index.Task.md).[pipe](index.Task.md#pipe)

#### Defined in

[Task.ts:39](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L39)

___

### read

▸ **read**(): `Promise`<`T`\>

Returns a Promise that resolves to the data output by this task. This is
generally called by pipeline operators to read the data from the previous step, however
operators are not required to do this.

#### Returns

`Promise`<`T`\>

#### Inherited from

[Task](index.Task.md).[read](index.Task.md#read)

#### Defined in

[Task.ts:20](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L20)

___

### transform

▸ **transform**<`Out`\>(`transform`): [`Task`](index.Task.md)<`Out`\>

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `transform` | [`TransformFnAsync`](../modules/index.md#transformfnasync)<`T`, `Out`\> | A function which accepts the input type and returns the output type. |

#### Returns

[`Task`](index.Task.md)<`Out`\>

A new Task which transforms the output when run.

#### Inherited from

[Task](index.Task.md).[transform](index.Task.md#transform)

#### Defined in

[Task.ts:32](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L32)
