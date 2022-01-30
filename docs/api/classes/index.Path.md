[overrun](../README.md) / [index](../modules/index.md) / Path

# Class: Path

[index](../modules/index.md).Path

A `Path` object contains a filesystem path. Path object are similar to, and are inspired by, the
Python `pathlib` module.

Typically in build environments, there is both a source directory structure and a destination
directory structure; and it is often the case that these two are a mirror of each other, or at
least share some structural similarities.

As such, it is often convenient to be able to manipulate paths by swapping out the `source`
part of the path and replacing it with the `output` location, while leaving the rest of the
path unchanged. `Path` objects provide a means to do this easily, although it is not required
that they be used this way.

The `Path` object actually contains two path strings, known as the `base` and the `fragment`.
The `base` represents either the source or destination directory, while the `fragment`
represents the location of a file or directory within the base. The complete path is simply the
concatenation of `base` and `fragment` together.

The `base` part of the path is optional; if not present then the `fragment` represents the
complete path. (If the fragment is a relative path, it will be relative to the current working
directory.)

The `base` path need not be an absolute path, although it often is. If it is a relative path,
it will be resolved relative to the current working directory.

The canonical way to construct a Path is via `Path.from()`, which has two forms:

## Table of contents

### Constructors

- [constructor](index.Path.md#constructor)

### Accessors

- [base](index.Path.md#base)
- [complete](index.Path.md#complete)
- [ext](index.Path.md#ext)
- [filename](index.Path.md#filename)
- [fragment](index.Path.md#fragment)
- [isAbsolute](index.Path.md#isabsolute)
- [parent](index.Path.md#parent)
- [parentName](index.Path.md#parentname)
- [stem](index.Path.md#stem)

### Methods

- [compose](index.Path.md#compose)
- [resolve](index.Path.md#resolve)
- [withBase](index.Path.md#withbase)
- [withExtension](index.Path.md#withextension)
- [withFilename](index.Path.md#withfilename)
- [withFragment](index.Path.md#withfragment)
- [withStem](index.Path.md#withstem)
- [from](index.Path.md#from)

## Constructors

### constructor

• **new Path**(`value`, `base?`)

Construct a new path from a string. Note: this normalizes the path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | A string representing the file path. |
| `base?` | `string` \| [`Path`](index.Path.md) | Optional base path, which `value` is relative to.  If `base` is not present and value is a Path, it will use value.base as the base. |

#### Defined in

Path.ts:60

## Accessors

### base

• `get` **base**(): `undefined` \| `string`

Return the base path.

#### Returns

`undefined` \| `string`

#### Defined in

Path.ts:76

___

### complete

• `get` **complete**(): `string`

The complete path, including both base and fragment.

#### Returns

`string`

#### Defined in

Path.ts:71

___

### ext

• `get` **ext**(): `string`

The filename extension, including the leading '.'

#### Returns

`string`

#### Defined in

Path.ts:81

___

### filename

• `get` **filename**(): `string`

The filename part of the path, including the filename extension.

#### Returns

`string`

#### Defined in

Path.ts:91

___

### fragment

• `get` **fragment**(): `string`

The part of the path relative to the base.

#### Returns

`string`

#### Defined in

Path.ts:66

___

### isAbsolute

• `get` **isAbsolute**(): `boolean`

Returns true if this is an absolute path, false otherwise.

#### Returns

`boolean`

#### Defined in

Path.ts:106

___

### parent

• `get` **parent**(): [`Path`](index.Path.md)

Return a new Path object representing the parent directory of this path.

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:96

___

### parentName

• `get` **parentName**(): `string`

Return a string containing the parent directory of this path.

#### Returns

`string`

#### Defined in

Path.ts:101

___

### stem

• `get` **stem**(): `string`

The filename, without the directory or file extension.

#### Returns

`string`

#### Defined in

Path.ts:86

## Methods

### compose

▸ **compose**(`newBaseOrPath`, `newFragment?`): [`Path`](index.Path.md)

Combine two paths, replacing either the base or the fragment or both.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newBaseOrPath` | ``null`` \| `string` \| [`Path`](index.Path.md) \| [`PathMapping`](../modules/index.md#pathmapping) | Either a function which transforms the path, or the new base of the path. If there is no second argument, then this represents the complete path. |
| `newFragment?` | ``null`` \| `string` | The new fragment. If this is `null` it means we want to keep the existing fragment. If it's a string, it means we want to replace it. |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:161

___

### resolve

▸ **resolve**(...`fragment`): [`Path`](index.Path.md)

Return a new Path object representing the concatenation of this path with one or
more relative paths.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...fragment` | `string`[] |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:112

___

### withBase

▸ **withBase**(`base`): [`Path`](index.Path.md)

Return a copy of this Path object, but with the base replaced by `base`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `string` \| [`Path`](index.Path.md) |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:119

___

### withExtension

▸ **withExtension**(`newExt`): [`Path`](index.Path.md)

Return a copy of this Path object, but with the file extension replaced by `ext`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newExt` | `string` | The new file extension. |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:133

___

### withFilename

▸ **withFilename**(`newFilename`): [`Path`](index.Path.md)

Return a copy of this Path object, but with the filename (including extension) replaced
by 'newFilename'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newFilename` | `string` | The new filename, with extension. |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:150

___

### withFragment

▸ **withFragment**(`fragment`): [`Path`](index.Path.md)

Return a copy of this Path object, but with the fragment replaced by `base`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fragment` | `string` | The new path fragment. |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:126

___

### withStem

▸ **withStem**(`newStem`): [`Path`](index.Path.md)

Return a copy of this Path object, but with the stem replaced by 'newStem'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newStem` | `string` | The new filename, not including file extension. |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:141

___

### from

▸ `Static` **from**(`path`): [`Path`](index.Path.md)

Create a path from a string or Path. This method has two overloaded forms:

If supplied with a single argument, that argument represents the `fragment` part of the path.
Otherwise, the first argument is the `base` and the second argument is the `fragment`.

You can also construct a `Path` object direcly by calling the constructor, however note that
the order of arguments is reversed, making the second parameter the optional one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| [`Path`](index.Path.md) |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:44

▸ `Static` **from**(`base`, `fragment?`): [`Path`](index.Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `string` \| [`Path`](index.Path.md) |
| `fragment?` | `string` |

#### Returns

[`Path`](index.Path.md)

#### Defined in

Path.ts:45
