[overrun](../README.md) / index

# Module: index

## Table of contents

### Classes

- [AbstractTask](../classes/index.AbstractTask.md)
- [DirectoryTask](../classes/index.DirectoryTask.md)
- [Path](../classes/index.Path.md)
- [SourceFileTask](../classes/index.SourceFileTask.md)
- [TaskArray](../classes/index.TaskArray.md)

### Interfaces

- [Builder](../interfaces/index.Builder.md)
- [BuilderOptions](../interfaces/index.BuilderOptions.md)
- [OutputTask](../interfaces/index.OutputTask.md)
- [SourceTask](../interfaces/index.SourceTask.md)
- [Task](../interfaces/index.Task.md)

### Type aliases

- [PathMapping](index.md#pathmapping)
- [TransformFn](index.md#transformfn)
- [TransformFnAsync](index.md#transformfnasync)

### Functions

- [clearTargets](index.md#cleartargets)
- [directory](index.md#directory)
- [output](index.md#output)
- [source](index.md#source)
- [target](index.md#target)

## Type aliases

### PathMapping

Ƭ **PathMapping**: (`path`: [`Path`](../classes/index.Path.md)) => [`Path`](../classes/index.Path.md)

#### Type declaration

▸ (`path`): [`Path`](../classes/index.Path.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`Path`](../classes/index.Path.md) |

##### Returns

[`Path`](../classes/index.Path.md)

#### Defined in

Path.ts:3

___

### TransformFn

Ƭ **TransformFn**<`In`, `Out`\>: (`input`: `In`) => `Out`

#### Type parameters

| Name |
| :------ |
| `In` |
| `Out` |

#### Type declaration

▸ (`input`): `Out`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `In` |

##### Returns

`Out`

#### Defined in

[Task.ts:3](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L3)

___

### TransformFnAsync

Ƭ **TransformFnAsync**<`In`, `Out`\>: (`input`: `In`) => `Promise`<`Out`\> \| `Out`

#### Type parameters

| Name |
| :------ |
| `In` |
| `Out` |

#### Type declaration

▸ (`input`): `Promise`<`Out`\> \| `Out`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `In` |

##### Returns

`Promise`<`Out`\> \| `Out`

#### Defined in

[Task.ts:4](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L4)

## Functions

### clearTargets

▸ **clearTargets**(): `void`

Remove all targets. Mainly used for testing.

#### Returns

`void`

#### Defined in

[target.ts:198](https://github.com/viridia/overrun/blob/2973034/src/target.ts#L198)

___

### directory

▸ **directory**(`baseOrPath`, `fragment?`): [`DirectoryTask`](../classes/index.DirectoryTask.md)

Create a task which reads a source file and returns a buffer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseOrPath` | `string` \| [`Path`](../classes/index.Path.md) |
| `fragment?` | `string` |

#### Returns

[`DirectoryTask`](../classes/index.DirectoryTask.md)

#### Defined in

[directory.ts:5](https://github.com/viridia/overrun/blob/2973034/src/directory.ts#L5)

___

### output

▸ **output**(`options?`): (`source`: `WritableTask`) => `OutputFileTask`

Task generator function that generates an output task.

**`deprecated`** Prefer `task.writeTo()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `OutputOptions` |

#### Returns

`fn`

▸ (`source`): `OutputFileTask`

Task generator function that generates an output task.

**`deprecated`** Prefer `task.writeTo()`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `WritableTask` |

##### Returns

`OutputFileTask`

#### Defined in

[output.ts:31](https://github.com/viridia/overrun/blob/2973034/src/output.ts#L31)

▸ **output**(`options?`): (`source`: `WritableTask`[]) => `OutputFileTask`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `OutputOptions` |

#### Returns

`fn`

▸ (`source`): `OutputFileTask`[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `WritableTask`[] |

##### Returns

`OutputFileTask`[]

#### Defined in

[output.ts:32](https://github.com/viridia/overrun/blob/2973034/src/output.ts#L32)

▸ **output**(`options?`): (`source`: [`TaskArray`](../classes/index.TaskArray.md)<`WritableTask`\>) => `OutputFileTask`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `OutputOptions` |

#### Returns

`fn`

▸ (`source`): `OutputFileTask`[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`TaskArray`](../classes/index.TaskArray.md)<`WritableTask`\> |

##### Returns

`OutputFileTask`[]

#### Defined in

[output.ts:33](https://github.com/viridia/overrun/blob/2973034/src/output.ts#L33)

___

### source

▸ **source**(`baseOrFile`, `fragment?`): [`SourceFileTask`](../classes/index.SourceFileTask.md)

Create a task which reads a source file and returns a buffer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseOrFile` | `string` \| [`Path`](../classes/index.Path.md) |
| `fragment?` | `string` |

#### Returns

[`SourceFileTask`](../classes/index.SourceFileTask.md)

#### Defined in

[source.ts:6](https://github.com/viridia/overrun/blob/2973034/src/source.ts#L6)

___

### target

▸ **target**(`builder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `builder` | `Builders` |

#### Returns

`void`

#### Defined in

[target.ts:25](https://github.com/viridia/overrun/blob/2973034/src/target.ts#L25)

▸ **target**(`name`, `builder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `builder` | `Builders` |

#### Returns

`void`

#### Defined in

[target.ts:26](https://github.com/viridia/overrun/blob/2973034/src/target.ts#L26)
