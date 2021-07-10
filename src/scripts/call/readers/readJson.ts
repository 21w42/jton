/**
 * @param text
 * Example:
 *     '{"value": "123"}'
 */
export function readJson(text: string): Object {
    return JSON.parse(text)
}