import {AbiContract} from '@tonclient/core/dist/modules'

/**
 * Add 0x to number or string.
 * @param number
 * Example:
 *     '123'
 * @return
 * Example:
 *     '0x123'
 */
export function x0(number: number | string): string {
    return `0x${number}`
}

/**
 * Convert abi to hex.
 * @param abi
 * Example:
 *     '{ABI ver...'
 * @return
 * Example:
 *     '7b0a0922...'
 */
export function abiToHex(abi: AbiContract): string {
    return stringToHex(JSON.stringify(abi))
}

/**
 * Convert string to hex.
 * @param string
 * Example:
 *     'XYZ123'
 * @return
 * Example:
 *     '58595a313233'
 */
export function stringToHex(string: string): string {
    return string.split('').map(x => x.charCodeAt(0).toString(16)).join('')
}

/**
 * Convert array of strings to hex. Actual for string[] or bytes[] parameter in Solidity.
 * @param strings
 * Example:
 *     ['XYZ123', 'ABC456']
 * @return
 * Example:
 *     ['58595a313233', '414243343536']
 */
export function stringsToHex(strings: string[]): string[] {
    return strings.map(x => stringToHex(x))
}

/**
 * Convert number to hex.
 * @param number
 * Example:
 *     1_000_000_000
 * @return
 * Example:
 *     '0x3b9aca00'
 */
export function numberToHex(number: number): string {
    return x0(number.toString(16))
}