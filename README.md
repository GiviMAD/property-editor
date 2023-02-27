# Property Editor

## Description

This JavaScript library tries to simplify the fact of reading/writing to a nested object property using a path contained in a string.
It's created with the purpose of been used on polymorphic interfaces or web-components with dynamic mappings.

## Features

* Handles the <b>initialization on write</b>, the path doesn't need to exist.
* It's compatible with <b>array paths</b>.
* It's a <b>light weight</b> package, implementation is short and there are no external dependencies.
* Includes <b>Typescript</b> definitions (paths are not type checked).
* It's <b>fast</b>. 

Under the hood the library process the path once and creates a <b>function chain</b> for reading and another for writing.
This way operations are way faster than if they have to reprocess the path.

The implementation way has also other advantages like avoiding problems with references, 
the editor will always point to the correct object and will recreate its path on write, 
there is no problem if you modify it externally without using the PropertyEditor instance.

## Examples

Reading from an object property in a nested array:

```ts
const model = { test: { nested: [{ property: 16 }, { property: 1 }, { property: 1992 }] } };
const propertyEditor = getPropertyEditor<number>(model, "test.nested[1].property");
propertyEditor.read() === model.test.nested[1].property; // This evaluates to true

```

Writing to an object property in a nested array:

```ts
const model = {} as any;
const value = 1;
const propertyEditor = getPropertyEditor<number>(model, "test.nested[1].property");
propertyEditor.write(value);
model.test.nested[1].property === value; // This will also be true

```