[overrun](../README.md) / [index](../modules/index.md) / SourceTask

# Interface: SourceTask

[index](../modules/index.md).SourceTask

A task that has a "last modified" date.

## Table of contents

### Accessors

- [path](index.SourceTask.md#path)

### Methods

- [getModTime](index.SourceTask.md#getmodtime)

## Accessors

### path

• `get` **path**(): [`Path`](../classes/index.Path.md)

Location of this file in the source tree.

#### Returns

[`Path`](../classes/index.Path.md)

#### Defined in

[Task.ts:45](https://github.com/viridia/overrun/blob/b21a862/src/Task.ts#L45)

## Methods

### getModTime

▸ **getModTime**(): `Promise`<`Date`\>

Return true if the last modified time of this file is newer than the given date.

#### Returns

`Promise`<`Date`\>

#### Defined in

[Task.ts:48](https://github.com/viridia/overrun/blob/b21a862/src/Task.ts#L48)
