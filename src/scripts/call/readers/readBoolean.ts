/**
 * @param value {string}
 * Examples:
 *     'true'
 *     'false'
 *     '123'
 * @return {number}
 * Examples:
 *     true
 *     false
 *     false
 */
export function readBoolean(value: string): boolean {
    return value === 'true'
}