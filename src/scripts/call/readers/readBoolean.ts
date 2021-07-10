/**
 * @param value
 * Examples:
 *     'true'
 *     'false'
 *     '123'
 * @return
 * Examples:
 *     true
 *     false
 *     false
 */
export function readBoolean(value: string): boolean {
    return value === 'true'
}