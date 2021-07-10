/**
 * @param value
 * Example:
 *     '1_000_000_000'
 * @return
 * Example:
 *     1000000000
 */
export function readInt(value: string): number {
    return parseInt(value.split('_').join(''))
}