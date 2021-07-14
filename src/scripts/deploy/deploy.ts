import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Printer} from '../../printer'
import {AccountType, Contract} from '../../contract'
import transferAbi from '../../contract/abi/transfer.abi.json'
import {B, createClient, createKeysOrRead} from '../../utils'
import {messages} from './messages'
import {NetConfig} from '../../config'

export interface DeployConfig {
    net: NetConfig
    locale: string | undefined
    keys: string
    requiredForDeployment: number
}

export class Deploy {
    protected readonly _client: TonClient

    /**
     * @param _config
     * Example:
     *     {
     *         net: {
     *             url: 'http://localhost:8080',
     *             timeout: 30_000,
     *             transactionFee: 0.02,
     *             tolerance: 0.000_001,
     *             giver: 'se'
     *         },
     *         locale: 'EN',
     *         keys: `${__dirname}/../keys/GiverV2.keys.json`,
     *         requiredForDeployment: 0.03
     *     }
     */
    constructor(protected readonly _config: DeployConfig) {
        TonClient.useBinaryLibrary(libNode)
        this._client = createClient(this._config.net.url)
    }

    /**
     * Run command.
     */
    public async run(): Promise<void> {
        const printer: Printer = new Printer(this._config.locale)
        const keys: KeyPair = await createKeysOrRead(this._config.keys, this._client)
        const contract: Contract = this._getContract(keys)

        /////////////
        // Network //
        /////////////
        printer.network(this._config.net.url)

        ///////////////////
        // Contract data //
        ///////////////////
        await printer.account(contract)

        ////////////////////////
        // Check account type //
        ////////////////////////
        const contractType: AccountType = await contract.accountType()
        switch (contractType) {
            case AccountType.notFound:
                printer.print(messages.NOT_ENOUGH_BALANCE)
                this._client.close()
                return
            case AccountType.active:
                printer.print(messages.ALREADY_DEPLOYED)
                this._client.close()
                return
            case AccountType.frozen:
                printer.print(messages.FROZEN)
                this._client.close()
                return
            case AccountType.nonExist:
                printer.print(messages.NON_EXIST)
                this._client.close()
                return
        }

        ///////////////////
        // Check balance //
        ///////////////////
        const balance: number = parseInt(await contract.balance())
        const requiredBalance: number = this._config.requiredForDeployment * B
        const tolerance: number = this._config.net.tolerance * B
        if (balance < requiredBalance - tolerance) {
            printer.print(messages.NOT_ENOUGH_BALANCE)
            this._client.close()
            return
        }

        //////////
        // Mark //
        //////////
        printer.print(messages.DEPLOYING)

        ///////////////
        // Deploying //
        ///////////////
        await this._deploy(contract)

        //////////
        // Mark //
        //////////
        printer.print(`${messages.DEPLOYED}\n`)

        ///////////////////
        // Contract data //
        ///////////////////
        await printer.account(contract)

        this._client.close()
    }


    ////////////////////////
    // MUST BE OVERRIDDEN //
    ////////////////////////
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
            address: '0:0000000000000000000000000000000000000000000000000000000000000000'
        })
    }

    /**
     * Deploy contract.
     * @param contract
     */
    protected async _deploy(contract: Contract): Promise<boolean> {
        return await contract.deploy()
    }
}