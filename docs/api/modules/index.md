[overrun](../README.md) / index

# Module: index

## Table of contents

### Classes

- [AbstractTask](../classes/index.AbstractTask.md)
- [DirectoryTask](../classes/index.DirectoryTask.md)
- [OutputFileTask](../classes/index.OutputFileTask.md)
- [Path](../classes/index.Path.md)
- [SourceFileTask](../classes/index.SourceFileTask.md)
- [TaskArray](../classes/index.TaskArray.md)
- [TransformTask](../classes/index.TransformTask.md)

### Interfaces

- [Builder](../interfaces/index.Builder.md)
- [BuilderOptions](../interfaces/index.BuilderOptions.md)
- [SourceTask](../interfaces/index.SourceTask.md)
- [Task](../interfaces/index.Task.md)
- [WriteOptions](../interfaces/index.WriteOptions.md)

### Type aliases

- [TransformFn](index.md#transformfn)
- [TransformFnAsync](index.md#transformfnasync)

### Functions

- [directory](index.md#directory)
- [output](index.md#output)
- [source](index.md#source)
- [target](index.md#target)

## Type aliases

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

[Task.ts:3](https://github.com/viridia/overrun/blob/b21a862/src/Task.ts#L3)

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

[Task.ts:4](https://github.com/viridia/overrun/blob/b21a862/src/Task.ts#L4)

## Functions

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

[directory.ts:5](https://github.com/viridia/overrun/blob/b21a862/src/directory.ts#L5)

___

### output

▸ **output**(`options?`): (`source`: `WritableTask`) => [`OutputFileTask`](../classes/index.OutputFileTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`WriteOptions`](../interfaces/index.WriteOptions.md) |

#### Returns

`fn`

▸ (`source`): [`OutputFileTask`](../classes/index.OutputFileTask.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `WritableTask` |

##### Returns

[`OutputFileTask`](../classes/index.OutputFileTask.md)

#### Defined in

[output.ts:14](https://github.com/viridia/overrun/blob/b21a862/src/output.ts#L14)

▸ **output**(`options?`): (`source`: `WritableTask`[]) => [`OutputFileTask`](../classes/index.OutputFileTask.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`WriteOptions`](../interfaces/index.WriteOptions.md) |

#### Returns

`fn`

▸ (`source`): [`OutputFileTask`](../classes/index.OutputFileTask.md)[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `WritableTask`[] |

##### Returns

[`OutputFileTask`](../classes/index.OutputFileTask.md)[]

#### Defined in

[output.ts:15](https://github.com/viridia/overrun/blob/b21a862/src/output.ts#L15)

▸ **output**(`options?`): (`source`: [`TaskArray`](../classes/index.TaskArray.md)<`WritableTask`\>) => [`OutputFileTask`](../classes/index.OutputFileTask.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`WriteOptions`](../interfaces/index.WriteOptions.md) |

#### Returns

`fn`

▸ (`source`): [`OutputFileTask`](../classes/index.OutputFileTask.md)[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`TaskArray`](../classes/index.TaskArray.md)<`WritableTask`\> |

##### Returns

[`OutputFileTask`](../classes/index.OutputFileTask.md)[]

#### Defined in

[output.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/output.ts#L16)

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

[source.ts:6](https://github.com/viridia/overrun/blob/b21a862/src/source.ts#L6)

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

[target.ts:36](https://github.com/viridia/overrun/blob/b21a862/src/target.ts#L36)

▸ **target**(`name`, `builder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `builder` | `Builders` |

#### Returns

`void`

#### Defined in

[target.ts:37](https://github.com/viridia/overrun/blob/b21a862/src/target.ts#L37)
