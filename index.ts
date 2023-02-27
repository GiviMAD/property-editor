
/** Encapsulates the read and write operations to a path. */
export interface PropertyEditor<T> {
    /** Returns the property value or null. */
    read: PropertyReader<T>,
    /** Sets the property value. */
    write: PropertyWriter<T>,
}

/** Interface for write operations. */
export interface PropertyWriter<T> {
    (value: T): void,
}

/** Interface for read operations. */
export interface PropertyReader<T> {
    (): T | null,
}

/**
 * Create a new {@link PropertyEditor}.
 * 
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyEditor} that provides read and write access to the provided path inside the data container.
 */
export function getPropertyEditor<T = unknown>(object: unknown, path: string): PropertyEditor<T> {
    const pathParts = parsePath(path);
    return {
        read: getPropertyReaderInternal<T>(object, [...pathParts]),
        write: getPropertyWriterInternal<T>(object, [...pathParts]),
    };
}

/**
 * Create a new {@link PropertyWriter} function.
 * 
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyWriter} function that provides write access to the provided path inside the data container.
 */
export function getPropertyWriter<T = unknown>(object: unknown, path: string): PropertyWriter<T> {
    return getPropertyWriterInternal(object, parsePath(path));
}

/**
 * Create a new {@link PropertyReader} function.
 * 
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyReader} function that provides read access to the provided path inside the data container.
 */
export function getPropertyReader<T = unknown>(object: unknown, path: string): PropertyReader<T> {
    return getPropertyReaderInternal(object, parsePath(path));
}

function getPropertyWriterInternal<T = unknown>(object: unknown, pathParts: (string | number)[]): PropertyWriter<T> {
    if (typeof object !== 'object') {
        throw new Error('Invalid data object.');
    }
    const endPart = pathParts.pop();
    if (endPart == null) {
        throw new Error('Missing property path.');
    }
    let fnChain: Function = (value: any) => value;
    for (let i = 0; i < pathParts.length; i++) {
        const isArray = i !== pathParts.length - 1 ? typeof pathParts[i + 1] === 'number' : typeof endPart === 'number';
        fnChain = chainFns((objectOrChild: any) => navigateAndMaybeInit(objectOrChild, pathParts[i], isArray), fnChain);
    }
    return (value: any) => fnChain(object as any)[endPart] = value;
}

function getPropertyReaderInternal<T = unknown>(object: unknown, pathParts: (string | number)[]): PropertyReader<T> {
    if (typeof object !== 'object') {
        throw new Error('Invalid data object.');
    }
    if (pathParts.length === 0) {
        throw new Error('Missing property path');
    }
    let fnChain: Function = undefined as any;
    for (const pathPart of pathParts) {
        fnChain = chainFns((objectOrChild: any) => tryReadOrNull(objectOrChild, pathPart), fnChain);
    }
    return () => fnChain(object as any);
}

function parsePath(path: string): (string | number)[] {
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
        } else {
            acc.push(part);
        }
        return acc;
    }, [] as (string | number)[]);
}

function chainFns(step: Function, prev?: Function) {
    return prev ? (value?: any) => step(prev(value)) : step;
}

function navigateAndMaybeInit<T>(model: T, path: keyof T, isArray: boolean) {
    if (!model[path]) {
        model[path] = (isArray ? [] : {}) as any;
    }
    return model[path];
}

function tryReadOrNull<T>(model: T, path: keyof T) {
    return model != null ? model[path] ?? null : null;
}