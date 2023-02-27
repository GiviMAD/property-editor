/** Encapsulates the read and write operations to a path. */
export interface PropertyEditor<T> {
    /** Returns the property value or null. */
    read: PropertyReader<T>;
    /** Sets the property value. */
    write: PropertyWriter<T>;
}
/** Interface for write operations. */
export interface PropertyWriter<T> {
    (value: T): void;
}
/** Interface for read operations. */
export interface PropertyReader<T> {
    (): T | null;
}
/**
 * Create a new {@link PropertyEditor}.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyEditor} that provides read and write access to the provided path inside the data container.
 */
export declare function getPropertyEditor<T = unknown>(object: unknown, path: string): PropertyEditor<T>;
/**
 * Create a new {@link PropertyWriter} function.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyWriter} function that provides write access to the provided path inside the data container.
 */
export declare function getPropertyWriter<T = unknown>(object: unknown, path: string): PropertyWriter<T>;
/**
 * Create a new {@link PropertyReader} function.
 *
 * @param object a data container.
 * @param path a path in js notation.
 * @returns a {@link PropertyReader} function that provides read access to the provided path inside the data container.
 */
export declare function getPropertyReader<T = unknown>(object: unknown, path: string): PropertyReader<T>;
