import {AccountType, Contract} from '../contract'
import colors, {Color} from 'colors'
import {B} from '../utils'
import {StringMap} from '../types'
import {ClientConfig} from '@tonclient/core'

const contractTypes: StringMap = {
    '-1': 'Not found',
    '0': 'Un init',
    '1': 'Active',
    '2': 'Frozen',
    '3': 'Non exist'
}

type ColorFunctionMap = { [key: string]: Color }
const colorFunctions: ColorFunctionMap = {
    '-1': colors.gray,
    '0': colors.yellow,
    '1': colors.green,
    '2': colors.blue,
    '3': colors.red
}

export class Printer {
    /**
     * @param _locale One or more BCP 47 extension sequences or `undefined`
     * Examples:
     *     'RU'
     *     'EN'
     *     undefined
     */
    constructor(private readonly _locale?: string) {
    }

    /**
     * Print text.
     * @param [text]
     * Example:
     *     'Hello, world!'
     */
    public print(text: string = ''): void {
        console.log(text)
    }

    /**
     * @param config
     */
    public network(config: ClientConfig): void {
        let text: string | undefined = config.network?.server_address ??
            config.network?.endpoints ? config.network?.endpoints?.join(' | ') : undefined
        console.log(`${colors.gray(String(text))}\n`)
    }

    /**
     * Read account data from blockchain and output in console.
     * @param contract
     */
    public async account(contract: Contract): Promise<void> {
        const address: string = await contract.address()
        const balance: string = await contract.balance()
        const accountType: AccountType = await contract.accountType()
        const colorFunction: Color = colorFunctions[accountType.toString()]
        const balanceAndType: string = `${this._getBalance(balance)}   ${contractTypes[accountType.toString()]}`
        const contractName: string = contract.constructor.name
        console.log(
            `${colors.gray(contractName)}\n` +
            `${colors.white(address)}   ${colorFunction(balanceAndType)}\n`
        )
    }

    /**
     * Return balance in human readable format.
     * @param balance
     * Examples:
     *     '0x4563918243faa410'
     *     '0x0'
     * @return
     * Example:
     *     '4,999,999,999.983658'
     *     '0'
     */
    private _getBalance(balance: string): string {
        const integerPartOfNumber: BigInt = BigInt(balance) / BigInt(B)
        const integerPartOfNumberText: string = integerPartOfNumber.toLocaleString(this._locale)
        const fractionalPartOfNumber: BigInt = BigInt(balance) % BigInt(B) + BigInt(B)
        const fractionalPartOfNumberFloat: number = parseInt(fractionalPartOfNumber.toString()) / B
        const fractionalPartOfNumberText: string = fractionalPartOfNumberFloat.toLocaleString(
            this._locale,
            {
                maximumFractionDigits: 10
            }
        ).substr(1)
        return integerPartOfNumberText + fractionalPartOfNumberText
    }
}
