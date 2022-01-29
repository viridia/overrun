[overrun](../README.md) / [index](../modules/index.md) / Builder

# Interface: Builder

[index](../modules/index.md).Builder

Represents a chain of pipeline stages that produce some output.

## Implemented by

- [`OutputFileTask`](../classes/index.OutputFileTask.md)

## Table of contents

### Methods

- [build](index.Builder.md#build)
- [getName](index.Builder.md#getname)
- [isModified](index.Builder.md#ismodified)

## Methods

### build

▸ **build**(`options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BuilderOptions`](index.BuilderOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[target.ts:16](https://github.com/viridia/overrun/blob/b21a862/src/target.ts#L16)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Defined in

[target.ts:18](https://github.com/viridia/overrun/blob/b21a862/src/target.ts#L18)

___

### isModified

▸ **isModified**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[target.ts:17](https://github.com/viridia/overrun/blob/b21a862/src/target.ts#L17)
