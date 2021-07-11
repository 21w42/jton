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