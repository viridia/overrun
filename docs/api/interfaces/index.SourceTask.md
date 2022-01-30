[overrun](../README.md) / [index](../modules/index.md) / SourceTask

# Interface: SourceTask

[index](../modules/index.md).SourceTask

A task that has a "last modified" date.

## Table of contents

### Properties

- [path](index.SourceTask.md#path)

### Methods

- [getModTime](index.SourceTask.md#getmodtime)

## Properties

### path

• `Readonly` **path**: [`Path`](../classes/index.Path.md)

Location of this file in the source tree.

#### Defined in

[Task.ts:70](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L70)

## Methods

### getModTime

▸ **getModTime**(): `Promise`<`Date`\>

Return true if the last modified time of this file is newer than the given date.

#### Returns

`Promise`<`Date`\>

#### Defined in

[Task.ts:73](https://github.com/viridia/overrun/blob/2973034/src/Task.ts#L73)
