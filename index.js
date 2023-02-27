"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyReader = exports.getPropertyWriter = exports.getPropertyEditor = void 0;
/**
 * Create a new {@link PropertyEditor}.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyEditor} that provides read and write access to the provided path inside the data container.
 */
function getPropertyEditor(object, path) {
    const pathParts = parsePath(path);
    return {
        read: getPropertyReaderInternal(object, [...pathParts]),
        write: getPropertyWriterInternal(object, [...pathParts]),
    };
}
exports.getPropertyEditor = getPropertyEditor;
/**
 * Create a new {@link PropertyWriter} function.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyWriter} function that provides write access to the provided path inside the data container.
 */
function getPropertyWriter(object, path) {
    return getPropertyWriterInternal(object, parsePath(path));
}
exports.getPropertyWriter = getPropertyWriter;
/**
 * Create a new {@link PropertyReader} function.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyReader} function that provides read access to the provided path inside the data container.
 */
function getPropertyReader(object, path) {
    return getPropertyReaderInternal(object, parsePath(path));
}
exports.getPropertyReader = getPropertyReader;
function getPropertyWriterInternal(object, pathParts) {
    if (typeof object !== 'object') {
        throw new Error('Invalid data object.');
    }
    const endPart = pathParts.pop();
    if (endPart == null) {
        throw new Error('Missing property path.');
    }
    let fnChain = (value) => value;
    for (let i = 0; i < pathParts.length; i++) {
        const isArray = i !== pathParts.length - 1 ? typeof pathParts[i + 1] === 'number' : typeof endPart === 'number';
        fnChain = chainFns((objectOrChild) => navigateAndMaybeInit(objectOrChild, pathParts[i], isArray), fnChain);
    }
    return (value) => fnChain(object)[endPart] = value;
}
function getPropertyReaderInternal(object, pathParts) {
    if (typeof object !== 'object') {
        throw new Error('Invalid data object.');
    }
    if (pathParts.length === 0) {
        throw new Error('Missing property path');
    }
    let fnChain = undefined;
    for (const pathPart of pathParts) {
        fnChain = chainFns((objectOrChild) => tryReadOrNull(objectOrChild, pathPart), fnChain);
    }
    return () => fnChain(object);
}
function parsePath(path) {
    const pathParts = path.split('.');
    if (pathParts.some(part => part.includes(' ') || !part.length)) {
        throw new Error('Invalid property path');
    }
    return pathParts.reduce((acc, part) => {
        if (part.endsWith("]")) {
            let index = part.lastIndexOf('[');
            let arrayPaths = [];
            while (index !== -1 && part.endsWith("]")) {
                const arrayIndex = Number(part.substring(index + 1, part.length - 1));
                arrayPaths.unshift(arrayIndex);
                part = part.substring(0, index);
                index = part.lastIndexOf('[');
            }
            acc.push(part);
            acc.push(...arrayPaths);
        }
        else {
            acc.push(part);
        }
        return acc;
    }, []);
}
function chainFns(step, prev) {
    return prev ? (value) => step(prev(value)) : step;
}
function navigateAndMaybeInit(model, path, isArray) {
    if (!model[path]) {
        model[path] = (isArray ? [] : {});
    }
    return model[path];
}
function tryReadOrNull(model, path) {
    var _a;
    return model != null ? (_a = model[path]) !== null && _a !== void 0 ? _a : null : null;
}
