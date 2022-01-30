[overrun](../README.md) / [index](../modules/index.md) / Builder

# Interface: Builder

[index](../modules/index.md).Builder

A 'builder' is the final task of a task pipeline. Only tasks which produce
artifacts (such as {@link OutputFileTask} can be builders.

## Hierarchy

- **`Builder`**

  ↳ [`OutputTask`](index.OutputTask.md)

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

[Task.ts:86](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L86)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Defined in

[Task.ts:88](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L88)

___

### isModified

▸ **isModified**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[Task.ts:87](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L87)
