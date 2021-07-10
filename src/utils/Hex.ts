import {AbiContract} from '@tonclient/core/dist/modules'

export class Hex {
    /**
     * Add 0x to number or string.
     * @param number
     * Example:
     *     '123'
     * @return
     * Example:
     *     '0x123'
     */
    public static x0(number: number | string): string {
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
    public static abi(abi: AbiContract): string {
        return Hex.string(JSON.stringify(abi))
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
    public static string(string: string): string {
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
    public static strings(strings: string[]): string[] {
        return strings.map(x => Hex.string(x))
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
    public static number(number: number): string {
        return Hex.x0(number.toString(16))
    }
}