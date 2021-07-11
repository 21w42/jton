import {AccountType, Contract} from '../contract'
import colors from 'colors'
import {contractTypes} from './utils/contractTypes'
import {colorFunctions} from './utils/colorFunctions'
import {ColorFunction} from './interfaces/ColorFunction'
import {B} from '../utils'

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
     * @param url
     * Example:
     *     'http://localhost'
     */
    public network(url: string): void {
        console.log(`${colors.gray(url)}`)
        console.log()
    }

    /**
     * Read account data from blockchain and output in console.
     * @param contract
     */
    public async account(contract: Contract): Promise<void> {
        const address: string = await contract.address()
        const balance: string = await contract.balance()
        const accountType: AccountType = await contract.accountType()
        const colorFunction: ColorFunction = colorFunctions[accountType.toString()]
        const balanceAndType: string = `${this._getBalance(balance)}   ${contractTypes[accountType.toString()]}`
        const contractName: string = contract.constructor.name
        console.log(`${colors.gray(contractName)}`)
        console.log(`${colors.white(address)}   ${colorFunction(balanceAndType)}`)
        console.log()
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
