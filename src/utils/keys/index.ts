import {KeyPair} from '@tonclient/core/dist/modules'
import {TonClient} from '@tonclient/core'
import fs from 'fs'
import {StringMap} from '../../types'

/**
 * Wrapper for crypto.generate_random_sign_keys()
 * @param client
 */
export async function random(client: TonClient): Promise<KeyPair> {
    return await client.crypto.generate_random_sign_keys()
}

/**
 * Read keys from `*.json` file.
 * @param file Absolute path to file.
 * Example:
 *     '/home/user/keys/GiverV2.keys.json'
 */
export function read(file: string): KeyPair {
    const text: string = fs.readFileSync(file, { encoding: 'utf8'})
    return JSON.parse(text)
}

/**
 * Create random keys if keys not exists.
 * @param file Absolute path to file.
 * Example:
 *     '/home/user/keys/GiverV2.keys.json'
 * @param client
 */
export async function createRandomIfNotExist(file: string, client: TonClient): Promise<KeyPair> {
    if (fs.existsSync(file))
        return read(file)

    const keys: KeyPair = await random(client)
    fs.writeFileSync(file, JSON.stringify(keys))
    return keys
}

/**
 * @param key
 * Example:
 *     'se'
 * @param keys
 * Example:
 *     {
 *         se: `${__dirname}/../node_modules/jton/dist/contract/keys/GiverV2.se.keys.json`,
 *         dev: `${__dirname}/../keys/GiverV2.keys.json`
 *     }
 * @return
 * Example:
 *     ${__dirname}/../library/keys/GiverV2.se.keys.json`
 */
export function getKeys(key: string, keys: StringMap): string {
    if (!keys.hasOwnProperty(key))
        throw new Error(`INVALID GIVER KEY ${key}`)

    return keys[key]
}