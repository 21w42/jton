import {TonClient} from '@tonclient/core'
import {libNode} from '@tonclient/lib-node'
import {KeyPair} from '@tonclient/core/dist/modules'
import {Printer} from '../../printer'
import {DeployConfig} from './interfaces/DeployConfig'
import {Contract} from '../../contract'
import transferAbi from '../../contract/abi/transfer.abi.json'
import {AccountType} from '../../contract'
import {DeployMessages} from './constants/DeployMessages'
import {B} from '../../utils'
import {createClient, createRandomIfNotExist} from '../../utils'

export class Deploy {
    protected readonly _config: DeployConfig
    protected readonly _client: TonClient

    /**
     * @param config
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
    constructor(config: DeployConfig) {
        TonClient.useBinaryLibrary(libNode)
        this._config = config
        this._client = createClient(config.net.url)
    }

    /**
     * Execute script.
     */
    public async run(): Promise<void> {
        const printer: Printer = new Printer(this._config.locale)
        const keys: KeyPair = await createRandomIfNotExist(this._config.keys, this._client)
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
            case AccountType.NOT_FOUND:
                printer.print(DeployMessages.NOT_ENOUGH_BALANCE)
                this._client.close()
                return
            case AccountType.ACTIVE:
                printer.print(DeployMessages.ALREADY_DEPLOYED)
                this._client.close()
                return
            case AccountType.FROZEN:
                printer.print(DeployMessages.FROZEN)
                this._client.close()
                return
            case AccountType.NON_EXIST:
                printer.print(DeployMessages.NON_EXIST)
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
            printer.print(DeployMessages.NOT_ENOUGH_BALANCE)
            this._client.close()
            return
        }

        //////////
        // Mark //
        //////////
        printer.print(DeployMessages.DEPLOYING)

        ///////////////
        // Deploying //
        ///////////////
        await this._deploy(contract)

        //////////
        // Mark //
        //////////
        printer.print(`${DeployMessages.DEPLOYED}\n`)

        ///////////////////
        // Contract data //
        ///////////////////
        await printer.account(contract)

        this._client.close()
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
     * Deploy contract.
     * @param contract
     */
    protected async _deploy(contract: Contract): Promise<void> {
        await contract.balance()
    }
}