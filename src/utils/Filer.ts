import {StringMap} from '../types'

export class Filer {
    private static readonly ERROR_MESSAGE: string = 'INVALID GIVER KEY'

    /**
     * @param key
     * Example:
     *     'se'
     * @param keys
     * Example:
     *     {
     *         se: `${__dirname}/../library/keys/GiverV2.se.keys.json`,
     *         dev: `${__dirname}/../keys/GiverV2.keys.json`
     *     }
     * @return
     * Example:
     *     ${__dirname}/../library/keys/GiverV2.se.keys.json`
     */
    public static getKeys(key: string, keys: StringMap): string {
        if (!keys.hasOwnProperty(key))
            throw new Error(`${Filer.ERROR_MESSAGE} ${key}`)

        return keys[key]
    }
}