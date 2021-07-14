import fs from 'fs'
import {AbiContract} from '@tonclient/core/dist/modules'

/**
 * @param pathToFile
 * Example:
 *     '/home/user/contracts/SafeMultisigWallet.abi.json'
 */
export function readAbi(pathToFile: string): AbiContract {
    const text: string = fs.readFileSync(pathToFile, {encoding: 'utf8'})
    return JSON.parse(text) as AbiContract
}

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

/**
 * @param text
 * Example:
 *     '{"value": "123"}'
 */
export function readJson(text: string): Object {
    return JSON.parse(text)
}