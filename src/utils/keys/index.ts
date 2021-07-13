import {KeyPair} from '@tonclient/core/dist/modules'
import {TonClient} from '@tonclient/core'
import fs from 'fs'
import {StringMap} from '../../types'

/**
 * Wrapper for crypto.generate_random_sign_keys()
 * @param client
 */
export async function getRandomKeyPair(client: TonClient): Promise<KeyPair> {
    return await client.crypto.generate_random_sign_keys()
}

/**
 * Read keys from `*.keys.json` file.
 * @param file Absolute path to file.
 * Example:
 *     '/home/user/keys/GiverV2.keys.json'
 */
export function readKeys(file: string): KeyPair {
    const text: string = fs.readFileSync(file, {encoding: 'utf8'})
    return JSON.parse(text)
}

/**
 * Create random keys if keys file not exists. If file exists calls readKeys().
 * @param file Absolute path to file.
 * Example:
 *     '/home/user/keys/GiverV2.keys.json'
 * @param client
 */
export async function createKeysOrRead(file: string, client: TonClient): Promise<KeyPair> {
    if (fs.existsSync(file))
        return readKeys(file)

    const keys: KeyPair = await getRandomKeyPair(client)
    fs.writeFileSync(file, JSON.stringify(keys))
    return keys
}

/**
 * Select keys path by name or throw error.
 * @param map
 * Example:
 *     {
 *         se: `${__dirname}/../keys/GiverV2.se.keys.json`,
 *         dev: `${__dirname}/../keys/GiverV2.keys.json`
 *     }
 * @param name
 * Example:
 *     'se'
 * @return
 * Example:
 *    `${__dirname}/../keys/GiverV2.se.keys.json`,
 */
export function getKeysByName(map: StringMap, name: string): string {
    const ERROR_MESSAGE: string = 'INVALID KEY NAME'
    if (!map.hasOwnProperty(name))
        throw new Error(`${ERROR_MESSAGE} ${name}`)

    return map[name]
}