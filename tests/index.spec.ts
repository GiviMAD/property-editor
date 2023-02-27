import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { getPropertyEditor } from '../index';

test('read from non nested property', () => {
    const model = { test: 16 };
    const propertyEditor = getPropertyEditor<number>(model, "test");
    assert.is(propertyEditor.read(), model.test);
});

test('write to non nested property', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test");
    propertyEditor.write(value);
    assert.is((model as any).test, value);
});

test('read from nested property', () => {
    const model = { test: { nested: 16 } };
    const propertyEditor = getPropertyEditor<number>(model, "test.nested");
    assert.is(propertyEditor.read(), model.test.nested);
});

test('write to nested property', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test.nested");
    propertyEditor.write(value);
    assert.is((model as any).test.nested, value);
});

test('read from non nested array', () => {
    const model = { test: [16, 1, 1992] };
    const propertyEditor = getPropertyEditor<number>(model, "test[1]");
    assert.is(propertyEditor.read(), model.test[1]);
});

test('write to non nested array', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test[1]");
    propertyEditor.write(value);
    assert.is((model as any).test[1], value);
});

test('read from nested array', () => {
    const model = { test: { nested: [16, 1, 1992] } };
    const propertyEditor = getPropertyEditor<number>(model, "test.nested[1]");
    assert.is(propertyEditor.read(), model.test.nested[1]);
});

test('write to nested array', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test.nested[1]");
    propertyEditor.write(value);
    assert.is((model as any).test.nested[1], value);
});

test('read from nested object in nested array', () => {
    const model = { test: { nested: [{ test: 16 }, { test: 1 }, { test: 1992 }] } };
    const propertyEditor = getPropertyEditor<number>(model, "test.nested[1].test");
    assert.is(propertyEditor.read(), model.test.nested[1].test);
});

test('write to nested object in nested array', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test.nested[1].test");
    propertyEditor.write(value);
    assert.is((model as any).test.nested[1].test, value);
});

test('read from nested array in nested array', () => {
    const model = { test: [[16], [1], [1992]] };
    const propertyEditor = getPropertyEditor<number>(model, "test[1][0]");
    assert.is(propertyEditor.read(), model.test[1][0]);
});

test('write to nested array in nested array', () => {
    const model = {};
    const value = 1;
    const propertyEditor = getPropertyEditor<number>(model, "test[1][0]");
    propertyEditor.write(value);
    assert.is((model as any).test[1][0], value);
});

test.run();