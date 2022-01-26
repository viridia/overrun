---
layout: default
title: Installation and setup
nav_order: 1
---

# Installation and setup

```sh
npm install overrun
```

Then, in your project's package.json:

```
{
  "build": "overrun -f pipeline.ts",
  "build:watch": "overrun -f pipeline.ts --watch",
}
```

You can also import overrun as a library and execute builds programmatically.
