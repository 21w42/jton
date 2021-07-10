import {CallConfig} from './interfaces/CallConfig'
import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {InfoConfig} from '../info'
import {Printer} from '../../printer'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Contract} from '../../contract'
import transferAbi from '../../contract/abi/transfer.abi.json'
import colors from 'colors'
import {CallMessages} from './constants/CallMessages'
import {AccountType} from '../../contract'
import {createClient, createRandomKeyFileIfNotExists} from '../../utils'
import {StringMap} from '../../types'

export class Call {
    protected readonly _config: InfoConfig
    protected readonly _names: string[]
    protected readonly _args: string[]
    protected readonly _client: TonClient

    /**
     * @param config
     * Example:
     *     {
     *         net: {
     *             url: 'http://localhost',
     *             timeout: 30_000
     *         },
     *         locale: 'EN',
     *         keys: `${__dirname}/../library/keys/GiverV2.se.keys.json`
     *     }
     * @param names
     * Example:
     *     [
     *         address,
     *         value,
     *         flags
     *     ]
     */
    constructor(config: CallConfig, names: string[]) {
        TonClient.useBinaryLibrary(libNode)
        this._config = config
        this._names = names
        this._args = process.argv.slice(2)
        this._client = createClient(config.net.url)
    }

    /**
     * Run command.
     */
    async run(): Promise<void> {
        const printer: Printer = new Printer(this._config.locale)

        ///////////////////////////
        // Check arguments count //
        ///////////////////////////
        if (this._names.length !== this._args.length)
            this._invalidArgumentsCountError(printer)

        const keys: KeyPair = await createRandomKeyFileIfNotExists(this._config.keys, this._client)
        const contract: Contract = this._getContract(keys)

        ////////////////////////
        // Check account type //
        ////////////////////////
        const accountType: AccountType = await contract.accountType()
        if (accountType !== AccountType.ACTIVE)
            await this._accountInsNotActiveError(printer, contract)

        const map: StringMap = this._readArguments()
        const targetContract: Contract = this._getTargetContract(map)

        /////////////
        // Network //
        /////////////
        printer.network(this._config.net.url)

        ////////////////////
        // Contracts data //
        ////////////////////
        await printer.account(contract)
        await printer.account(targetContract)

        //////////
        // Mark //
        //////////
        printer.print(CallMessages.CALL)

        //////////
        // Call //
        //////////
        await this._call(contract, map, keys)

        //////////
        // Mark //
        //////////
        printer.print(`${CallMessages.DONE}\n`)

        ////////////////////
        // Contracts data //
        ////////////////////
        await printer.account(contract)
        await printer.account(targetContract)

        this._client.close()
    }

    /**
     * Print error and exit.
     * @param printer
     */
    private _invalidArgumentsCountError(printer: Printer): void {
        printer.print(CallMessages.INVALID_ARGUMENTS_COUNT)
        printer.print(CallMessages.ARGUMENTS)
        for (let i: number = 0; i < this._names.length; i++)
            printer.print(`    ${colors.yellow(this._names[i])}`)
        process.exit()
    }

    /**
     * Print error and exit.
     * @param printer
     * @param contract
     */
    private async _accountInsNotActiveError(printer: Printer, contract: Contract): Promise<void> {
        await printer.network(this._config.net.url)
        await printer.account(contract)
        await printer.print(CallMessages.ACCOUNT_IS_NOT_ACTIVE)
        process.exit()
    }

    /**
     * Read arguments from process.argv and return Index.
     * @return
     * Example:
     *     {
     *         address: '0x01234...',
     *         value: '1_000_000_000'
     *     }
     */
    private _readArguments(): StringMap {
        const result: StringMap = {}
        for (let i: number = 0; i < this._args.length; i++)
            result[this._names[i]] = this._args[i]
        return result
    }



    //////////////////////
    // MUST BE OVERRIDE //
    //////////////////////
    /**
     * Create and return contract object.
     * @param keys
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    protected _getContract(keys: KeyPair): Contract {
        return new Contract(this._client, this._config.net.timeout, {
            abi: transferAbi,
            keys: keys,
            address: '0x0000000000000000000000000000000000000000000000000000000000000000'
        })
    }

    /**
     * Create and return target contract object.
     * @param map
     * Example:
     *     {
     *         address: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff'
     *     }
     */
    protected _getTargetContract(map: StringMap): Contract {
        return new Contract(this._client, this._config.net.timeout,{
            abi: {},
            address: map['address']
        })
    }

    /**
     * Call the public method with an external message.
     * @param _0 A contract on which we call the public method with an external message.
     * @param _1
     * Example:
     *     {
     *         address: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff ',
     *         value: '1_000_000_000',
     *         bounce: 'false'
     *     }
     * @param _2
     * Example:
     *     {
     *         public: '0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff',
     *         secret: '0x0000000011111111222222223333333344444444555555556666666677777777'
     *     }
     */
    protected async _call(_0: Contract, _1: StringMap, _2?: KeyPair): Promise<void> {
        return
    }
}